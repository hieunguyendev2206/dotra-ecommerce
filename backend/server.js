const express = require("express");
const app = express();
const env = require("./config/env.config");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const socket = require("socket.io");
const { databaseConnect } = require("./database/database");
const server = http.createServer(app);
const stripe = require("stripe")("sk_test_51PGcpoAJsOUKToQLJFP71JX7fI1YP7Wv1xu1dQteGu1yfwTwO6dlfIdZVGCS8SQPwxggVl3BVHa55tmgjzrpZ5ni00XgCx7Tff");
const endpointSecret = "whsec_8acc169e541ff3c316ca885ecb3b1a30e216f6ba50e80902d9dee1d9ed6a0f40";
const io = socket(server, {
    cors: {
        origin: "*",
        credentials: true,
    },
});

// Quản lý các danh sách kết nối
let allCustomer = [];
let allSeller = [];
let admin = {};

const addCustomer = (customerId, socketId, customerInfo) => {
    const isCustomerExist = allCustomer.some((customer) => customer.customerId === customerId);
    if (!isCustomerExist) {
        allCustomer.push({ customerId, socketId, customerInfo });
    }
};

const addSeller = (sellerId, socketId, sellerInfo) => {
    const isSellerExist = allSeller.some((seller) => seller.sellerId === sellerId);
    if (!isSellerExist) {
        allSeller.push({ sellerId, socketId, sellerInfo });
    }
};

const findCustomer = (customerId) => allCustomer.find((customer) => customer.customerId === customerId);

const findSeller = (sellerId) => allSeller.find((seller) => seller.sellerId === sellerId);

const removeUser = (socketId) => {
    allCustomer = allCustomer.filter((customer) => customer.socketId !== socketId);
    allSeller = allSeller.filter((seller) => seller.socketId !== socketId);
};

const removeAdmin = (socketId) => {
    if (admin.socketId === socketId) {
        admin = {};
    }
};

// Stripe Webhook xử lý các sự kiện thanh toán
function handleCheckoutSessionCompleted(session) {
    console.log(`Completed session: ${session.id}`);
    // Thêm logic xử lý tại đây
}

function handleChargeSucceeded(charge) {
    console.log(`Charge succeeded: ${charge.id}`);
    // Thêm logic xử lý tại đây
}

// Middleware
app.use(cors({
    origin: ["https://admin-topaz-three.vercel.app", "https://dotra-home.vercel.app"],
    credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api", require("./routes/auth.routes"));
app.use("/api", require("./routes/category.routes"));
app.use("/api", require("./routes/coupons.routes"));
app.use("/api", require("./routes/product.routes"));
app.use("/api", require("./routes/seller.routes"));
app.use("/api/home", require("./routes/home.routes"));
app.use("/api", require("./routes/customer.routes"));
app.use("/api/cart", require("./routes/cart.routes"));
app.use("/api/wishlist", require("./routes/wishlist.routes"));
app.use("/api/order", require("./routes/order.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/review", require("./routes/review.routes"));
app.use("/api/chat", require("./routes/chat.routes"));
app.use("/api/payment", require("./routes/payment.routes"));

// Stripe Webhook
app.post("/webhook", express.raw({ type: "application/json" }), (request, response) => {
    const sig = request.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        console.error(`Failed to construct event: ${err.message}`);
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle Stripe Events
    switch (event.type) {
        case "checkout.session.completed":
            handleCheckoutSessionCompleted(event.data.object);
            break;
        case "charge.succeeded":
            handleChargeSucceeded(event.data.object);
            break;
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    response.send();
});

// WebSocket xử lý các kết nối thời gian thực
io.on("connection", (socket) => {
    console.log("Socket server is connected...");

    socket.on("add_customer", (customerId, customerInfo) => {
        addCustomer(customerId, socket.id, customerInfo);
        io.emit("active_seller", allSeller);
        io.emit("active_customer", allCustomer);
    });

    socket.on("add_seller", (sellerId, sellerInfo) => {
        addSeller(sellerId, socket.id, sellerInfo);
        io.emit("active_seller", allSeller);
        io.emit("active_customer", allCustomer);
    });

    socket.on("add_admin", (adminInfo) => {
        admin = adminInfo;
        admin.socketId = socket.id;
        io.emit("active_seller", allSeller);
    });

    socket.on("send_message_seller_to_customer", (msg) => {
        const customer = findCustomer(msg.receiverId);
        if (customer) {
            socket.to(customer.socketId).emit("seller_message", msg);
        }
    });

    socket.on("send_message_customer_to_seller", (msg) => {
        const seller = findSeller(msg.receiverId);
        if (seller) {
            socket.to(seller.socketId).emit("customer_message", msg);
        }
    });

    socket.on("send_message_admin_to_seller", (msg) => {
        const seller = findSeller(msg.receiverId);
        if (seller) {
            socket.to(seller.socketId).emit("receive_admin_message", msg);
        }
    });

    socket.on("send_message_seller_to_admin", (msg) => {
        if (admin.socketId) {
            socket.to(admin.socketId).emit("receive_seller_message", msg);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected...");
        removeUser(socket.id);
        io.emit("active_customer", allCustomer);
        io.emit("active_seller", allSeller);
    });
});

// Kết nối Database và khởi động Server
databaseConnect();
const port = env.PORT || 5000;
server.listen(port, () => console.log(`Server đang chạy ở cổng ${port}!`));

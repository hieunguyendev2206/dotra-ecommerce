const env = require("../config/env.config");
const axios = require("axios");
const moment = require("moment");
const qs = require("qs");
const response = require("../utils/response");
const httpStatusCode = require("../config/httpStatusCode");
const paymentModel = require("../database/models/payment.models");
const sellerModel = require("../database/models/seller.models");
const sellerOfOrderModel = require("../database/models/sellerOfOrder.models");
const sellerWallet = require("../database/models/sellerWallet.models");
const dotraWallet = require("../database/models/dotraWallet.models");
const orderModel = require("../database/models/order.models");
const withdrawalRequestModel = require("../database/models/withdrawalRequest.models");
const stripe = require("stripe")("sk_test_51OvzNvRsSTvz81Cp2v9m5hvS4iRbak0TVrng5LJpwDRZ7ReUVMZMnzJJKlzfdc8i8TQ3L42t5Hw7ZAb8qlNCBhAX00EEOqLJHO");
const {v4: uuidv4} = require("uuid");
const {successMessage, errorMessage} = require("../config/message.config");
const {
    mongo: {ObjectId},
} = require("mongoose");
const crypto = require("crypto");

const paypal = require("@paypal/checkout-server-sdk");
const {client} = require("@paypal/checkout-server-sdk/samples/Common/payPalClient");
const paypalEnvironment = new paypal.core.SandboxEnvironment(
    env.PAYPAL_CLIENT_ID,
    env.PAYPAL_SECRET
);
const paypalClient = new paypal.core.PayPalHttpClient(paypalEnvironment);

function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
        sorted[key] = obj[key];
    });
    return sorted;
}

function buildQueryString(params) {
    const keys = Object.keys(params).sort();
    const queryArray = keys.map(key => `${key}=${params[key]}`);
    return queryArray.join("&");
}

function createVnPayHash(data, secretKey) {
    const sortedData = sortObject(data);
    const signData = qs.stringify(sortedData, { encode: false });
    return crypto.createHmac("sha512", secretKey)
        .update(Buffer.from(signData, "utf-8"))
        .digest("hex");
}


class paymentController {
    // Tạo PayPal Order
    create_paypal_order = async (req, res) => {
        const { amount, currency, orderId } = req.body;

        try {
            const request = new paypal.orders.OrdersCreateRequest();
            request.requestBody({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        reference_id: orderId,
                        amount: {
                            currency_code: currency,
                            value: amount,
                        },
                    },
                ],
            });

            const response = await paypalClient.execute(request);
            const approvalUrl = response.result.links.find((link) => link.rel === "approve").href;

            res.status(200).json({ approvalUrl, orderID: response.result.id });
        } catch (error) {
            console.error("Error creating PayPal order:", error);
            res.status(500).json({ error: "Failed to create PayPal order" });
        }
    };

    // Capture PayPal Order
    capture_paypal_order = async (req, res) => {
        const { orderID } = req.body;

        if (!orderID) {
            return res.status(400).json({ error: "Order ID is required" });
        }

        try {
            const request = new paypal.orders.OrdersCaptureRequest(orderID);
            const capture = await paypalClient.execute(request);

            // Lấy reference_id để cập nhật trạng thái đơn hàng
            const orderId = capture.result.purchase_units[0].reference_id;

            // Cập nhật trạng thái đơn hàng
            await orderModel.findByIdAndUpdate(orderId, { payment_status: "paid" });

            await sellerOfOrderModel.updateMany({
                orderId: new ObjectId(orderId),
            }, {
                $set: {payment_status: "paid"},
            });

            const order = await orderModel.findById(orderId);

            const sellerOfOrder = await sellerOfOrderModel.find({
                orderId: new ObjectId(orderId),
            });
            await dotraWallet.create({
                amount: order.price,
            });
            for (let i = 0; i < sellerOfOrder.length; i++) {
                await sellerWallet.create({
                    sellerId: sellerOfOrder[i].sellerId, amount: sellerOfOrder[i].price,
                });
            }

            res.status(200).json({
                message: "Payment captured successfully",
                capture,
            });
        } catch (error) {
            console.error("Error capturing PayPal order:", error);
            res.status(500).json({ error: "Failed to capture PayPal order" });
        }
    };

    //Thanh toán VNPAY
    create_vnpay_payment = async (req, res) => {
        try {
            const { amount, orderInfo } = req.body;

            if (!amount || isNaN(amount) || amount <= 0) {
                return res.status(400).json({ error: "Số tiền không hợp lệ" });
            }

            const clientIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress || "127.0.0.1";
            const fixedIp = clientIp.includes("::1") ? "127.0.0.1" : clientIp.replace("::ffff:", "");
            const currentDate = moment().format("YYYYMMDDHHmmss");

            let vnp_Params = {
                vnp_Version: "2.1.0",
                vnp_Command: "pay",
                vnp_TmnCode: env.VNP_TMN_CODE,
                vnp_Amount: amount * 100,
                vnp_CurrCode: "VND",
                vnp_TxnRef: currentDate,
                vnp_OrderInfo: `${orderInfo}`.replace(/[^a-zA-Z0-9]/g, ""),
                vnp_OrderType: "billpayment",
                vnp_Locale: "vn",
                vnp_ReturnUrl: env.VNP_RETURN_URL,
                vnp_IpAddr: fixedIp,
                vnp_CreateDate: currentDate,
            };

            console.log("Params before signing:", vnp_Params);

            const secureHash = createVnPayHash(vnp_Params, env.VNP_HASH_SECRET);
            vnp_Params["vnp_SecureHash"] = secureHash;

            console.log("Generated Secure Hash:", secureHash);
            console.log("Generated VNPay URL:", `${env.VNP_API_URL}?${qs.stringify(vnp_Params, { encode: false })}`);

            return res.status(200).json({
                paymentUrl: `${env.VNP_API_URL}?${qs.stringify(vnp_Params, { encode: false })}`,
            });
        } catch (error) {
            console.error("Error creating VNPay payment:", error.message);
            return res.status(500).json({ error: "Có lỗi xảy ra khi tạo thanh toán VNPay" });
        }
    };

    handle_vnpay_return = async (req, res) => {
        try {
            let vnp_Params = req.query;
            const secureHash = vnp_Params["vnp_SecureHash"];

            // Loại bỏ chữ ký để xác minh
            delete vnp_Params["vnp_SecureHash"];
            delete vnp_Params["vnp_SecureHashType"];

            // Sắp xếp và xác minh chữ ký
            const validHash = createVnPayHash(vnp_Params, env.VNP_HASH_SECRET);

            if (secureHash.toLowerCase() === validHash.toLowerCase()) {
                if (vnp_Params["vnp_ResponseCode"] === "00") {
                    console.log("Payment Successful:", vnp_Params);
                    return res.redirect("/payment/payment-success");
                } else {
                    console.log("Payment Failed:", vnp_Params);
                    return res.redirect("/payment/payment-error");
                }
            } else {
                console.error("Invalid Signature");
                return res.status(400).json({ error: "Chữ ký không hợp lệ" });
            }
        } catch (error) {
            console.error("Error handling VNPay return:", error.message);
            return res.status(500).json({ error: "Lỗi xử lý phản hồi VNPay" });
        }
    };

    // Tạo thanh toán ZaloPay
    create_zalopay_payment = async (req, res) => {
        try {
            const { amount, orderId } = req.body;

            // Validate input
            if (!amount || isNaN(amount) || amount <= 0) {
                return res.status(400).json({ error: "Số tiền không hợp lệ" });
            }

            const partnerCode = env.ZALOPAY_PARTNER_CODE;
            const accessKey = env.ZALOPAY_ACCESS_KEY;
            const secretKey = env.ZALOPAY_SECRET_KEY;
            const endpoint = env.ZALOPAY_ENDPOINT;
            const callbackUrl = `${env.SERVER_URL}/api/payment/capture-zalopay-order`;

            const appTransId = `${moment().format("YYMMDD")}_${orderId}`; // Transaction ID
            const appUser = "demo_user"; // Tên người dùng (tuỳ chỉnh theo hệ thống)
            const appTime = new Date().getTime(); // Thời gian gửi yêu cầu

            const data = {
                app_id: partnerCode,
                app_trans_id: appTransId,
                app_user: appUser,
                app_time: appTime,
                item: JSON.stringify([{ name: "Order Payment", price: amount, quantity: 1 }]),
                amount: amount,
                description: `Thanh toán đơn hàng #${orderId}`,
                embed_data: JSON.stringify({ orderId }),
                callback_url: callbackUrl,
            };

            // Tạo chữ ký bảo mật
            const rawData = `${partnerCode}|${appTransId}|${appUser}|${amount}|${appTime}|${callbackUrl}`;
            const mac = crypto.createHmac("sha256", secretKey).update(rawData).digest("hex");
            data.mac = mac;

            // Gửi yêu cầu tới ZaloPay
            const zalopayResponse = await axios.post(endpoint, data);

            if (zalopayResponse.data && zalopayResponse.data.order_url) {
                return res.status(200).json({
                    paymentUrl: zalopayResponse.data.order_url, // URL cổng thanh toán
                });
            } else {
                throw new Error("Không thể tạo thanh toán ZaloPay");
            }
        } catch (error) {
            console.error("Error creating ZaloPay payment:", error.message);
            return res.status(500).json({ error: "Lỗi tạo thanh toán ZaloPay" });
        }
    };

    // Xử lý kết quả thanh toán từ ZaloPay
    capture_zalopay_order = async (req, res) => {
        try {
            const { data } = req.body; // Dữ liệu callback từ ZaloPay
            const { orderId } = JSON.parse(data.embed_data);

            if (data.return_code === 1) { // Kiểm tra giao dịch thành công
                // Cập nhật trạng thái đơn hàng
                await orderModel.findByIdAndUpdate(orderId, { payment_status: "paid" });
                await sellerOfOrderModel.updateMany(
                    { orderId: orderId },
                    { $set: { payment_status: "paid" } }
                );

                const order = await orderModel.findById(orderId);
                const sellerOfOrder = await sellerOfOrderModel.find({ orderId });

                // Add tiền vào dotraWallet và sellerWallet
                await dotraWallet.create({ amount: order.price });
                for (let i = 0; i < sellerOfOrder.length; i++) {
                    await sellerWallet.create({
                        sellerId: sellerOfOrder[i].sellerId,
                        amount: sellerOfOrder[i].price,
                    });
                }

                return res.status(200).json({ message: "Thanh toán ZaloPay thành công!" });
            } else {
                console.error("ZaloPay Payment Failed:", data);
                return res.status(400).json({ error: "Thanh toán thất bại!" });
            }
        } catch (error) {
            console.error("Error capturing ZaloPay order:", error.message);
            return res.status(500).json({ error: "Lỗi xử lý thanh toán ZaloPay" });
        }
    };

    // Tạo thanh toán MoMo
    create_momo_payment = async (req, res) => {
        try {
            const { amount, orderId } = req.body;

            // Validate input
            if (!amount || isNaN(amount) || amount <= 0) {
                return res.status(400).json({ error: "Số tiền không hợp lệ" });
            }

            const partnerCode = env.MOMO_PARTNER_CODE;
            const accessKey = env.MOMO_ACCESS_KEY;
            const secretKey = env.MOMO_SECRET_KEY;
            const endpoint = env.MOMO_ENDPOINT;
            const returnUrl = env.MOMO_RETURN_URL;
            const notifyUrl = env.MOMO_NOTIFY_URL;

            const requestId = `${partnerCode}_${new Date().getTime()}`;
            const orderInfo = `Thanh toán đơn hàng #${orderId}`;
            const rawData = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${notifyUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=captureWallet`;

            // Tạo chữ ký bảo mật
            const signature = crypto.createHmac("sha256", secretKey).update(rawData).digest("hex");

            const requestBody = {
                partnerCode,
                accessKey,
                requestId,
                amount: amount.toString(),
                orderId,
                orderInfo,
                redirectUrl: returnUrl,
                ipnUrl: notifyUrl,
                extraData: "",
                requestType: "captureWallet",
                signature,
            };

            // Gửi yêu cầu tới MoMo API
            const momoResponse = await axios.post(endpoint, requestBody);

            if (momoResponse.data && momoResponse.data.payUrl) {
                return res.status(200).json({
                    paymentUrl: momoResponse.data.payUrl,
                    qrCodeUrl: momoResponse.data.qrCodeUrl,
                });
            } else {
                throw new Error("Không thể tạo thanh toán MoMo");
            }
        } catch (error) {
            console.error("Error creating MoMo payment:", error.message);
            return res.status(500).json({ error: "Lỗi tạo thanh toán MoMo" });
        }
    };

    // Xử lý kết quả thanh toán MoMo
    capture_momo_payment = async (req, res) => {
        try {
            const { partnerCode, orderId, requestId, amount, orderInfo, orderType, transId, resultCode, message, payType } = req.body;

            console.log("MoMo Callback Data:", req.body);

            // Kiểm tra kết quả thanh toán
            if (resultCode === 0) { // Thanh toán thành công
                // Cập nhật trạng thái đơn hàng
                await orderModel.findByIdAndUpdate(orderId, { payment_status: "paid" });
                await sellerOfOrderModel.updateMany(
                    { orderId: orderId },
                    { $set: { payment_status: "paid" } }
                );

                const order = await orderModel.findById(orderId);
                const sellerOfOrder = await sellerOfOrderModel.find({ orderId });

                // Add tiền vào dotraWallet và sellerWallet
                await dotraWallet.create({ amount: order.price });
                for (let i = 0; i < sellerOfOrder.length; i++) {
                    await sellerWallet.create({
                        sellerId: sellerOfOrder[i].sellerId,
                        amount: sellerOfOrder[i].price,
                    });
                }

                return res.status(200).json({ message: "Thanh toán MoMo thành công!" });
            } else {
                console.error("MoMo Payment Failed:", message);
                return res.status(400).json({ error: "Thanh toán thất bại!", message });
            }
        } catch (error) {
            console.error("Error capturing MoMo payment:", error.message);
            return res.status(500).json({ error: "Lỗi xử lý thanh toán MoMo" });
        }
    };

    create_stripe_connect_account = async (req, res) => {
        const {id} = req;
        const uuid = uuidv4();

        try {
            const paymentInfo = await paymentModel.findOne({sellerId: id});
            if (paymentInfo) {
                await paymentModel.deleteOne({sellerId: id});
                const account = await stripe.accounts.create({
                    type: "express",
                });
                const accountLink = await stripe.accountLinks.create({
                    account: account.id,
                    refresh_url: "https://admin-topaz-three.vercel.app/refresh",
                    return_url: `https://admin-topaz-three.vercel.app/success?activeCode=${uuid}`,
                    type: "account_onboarding",
                });
                await paymentModel.create({
                    sellerId: id, accountId: account.id, activeCode: uuid,
                });
                response(res, httpStatusCode.Created, {url: accountLink.url});
            } else {
                const account = await stripe.accounts.create({
                    type: "express",
                });
                const accountLink = await stripe.accountLinks.create({
                    account: account.id,
                    refresh_url: "https://admin-topaz-three.vercel.app/refresh",
                    return_url: `https://admin-topaz-three.vercel.app/success?activeCode=${uuid}`,
                    type: "account_onboarding",
                });
                await paymentModel.create({
                    sellerId: id, accountId: account.id, activeCode: uuid,
                });
                response(res, httpStatusCode.Created, {url: accountLink.url});
            }
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Kích hoạt tài khoản thanh toán Stripe
    activate_stripe_connect_account = async (req, res) => {
        const {activeCode} = req.params;
        const {id} = req;
        try {
            const userInfoPayment = await paymentModel.findOne({
                activeCode: activeCode,
            });
            if (userInfoPayment) {
                await sellerModel.findByIdAndUpdate(id, {
                    payment: "active",
                });
                response(res, httpStatusCode.Ok, {
                    message: successMessage.ACTIVE_ACCOUNT_PAYMENT_SUCCESS,
                });
            } else {
                response(res, httpStatusCode.NotFound, {
                    message: successMessage.ACTIVE_ACCOUNT_PAYMENT_FAIL,
                });
            }
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    create_checkout_session = async (req, res) => {
        const {orderId} = req.body;
        try {
            const order = await orderModel.findById(orderId);

            const line_items = order.products.map((product) => ({
                price_data: {
                    currency: "vnd", product_data: {
                        name: product.product_name,
                        images: [product.images[0]],
                        description: product.quantity + " sản phẩm, Giảm giá " + product.discount + "%",
                    }, unit_amount: Math.round(product.price * (1 - product.discount / 100)),
                }, quantity: product.quantity,
            }));
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items,
                mode: "payment",
                success_url: `https://dotra-home.vercel.app/payment/payment-success`,
                cancel_url: "https://dotra-home.vercel.app/payment/payment-error",
            });
            res.send({sessionId: session.id});
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    update_payment = async (req, res) => {
        const {orderId} = req.params;
        try {
            await orderModel.findByIdAndUpdate(orderId, {
                payment_status: "paid",
            });

            await sellerOfOrderModel.updateMany({
                orderId: new ObjectId(orderId),
            }, {
                $set: {payment_status: "paid"},
            });
            const order = await orderModel.findById(orderId);
            const sellerOfOrder = await sellerOfOrderModel.find({
                orderId: new ObjectId(orderId),
            });
            await dotraWallet.create({
                amount: order.price,
            });
            for (let i = 0; i < sellerOfOrder.length; i++) {
                await sellerWallet.create({
                    sellerId: sellerOfOrder[i].sellerId, amount: sellerOfOrder[i].price,
                });
            }
            await response(res, httpStatusCode.Ok, {
                message: successMessage.UPDATE_PAYMENT_SUCCESS,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    sumAmount = (data) => {
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            sum = sum + data[i].amount;
        }
        return sum;
    };

    seller_request_revenue = async (req, res) => {
        const {sellerId} = req.params;
        try {
            const sellerWalletInfo = await sellerWallet.find({sellerId: sellerId});

            const pendingWithdrawalRequest = await withdrawalRequestModel.find({
                $and: [{
                    sellerId: {
                        $eq: sellerId,
                    },
                }, {
                    status: {
                        $eq: "pending",
                    },
                },],
            });

            const successWithdrawalRequest = await withdrawalRequestModel.find({
                $and: [{
                    sellerId: {
                        $eq: sellerId,
                    },
                }, {
                    status: {
                        $eq: "success",
                    },
                },],
            });

            const pendingAmount = this.sumAmount(pendingWithdrawalRequest);
            const successAmount = this.sumAmount(successWithdrawalRequest);
            const totalAmount = this.sumAmount(sellerWalletInfo);

            let availableAmount = 0;
            if (totalAmount > 0) {
                availableAmount = totalAmount - (pendingAmount + successAmount);
            }
            response(res, httpStatusCode.Ok, {
                pendingWithdrawalRequest,
                successWithdrawalRequest,
                pendingAmount,
                successAmount,
                totalAmount,
                availableAmount,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    send_request_withdrawal = async (req, res) => {
        const {sellerId, amount} = req.body;
        const exchangeRate = 25473;
        try {
            const sellerWalletInfo = await sellerWallet.find({sellerId: sellerId});
            const totalAmount = this.sumAmount(sellerWalletInfo);
            if (totalAmount >= amount) {
                // Chuyển đổi số tiền từ VND sang USD 💸
                const amountInUSD = amount / exchangeRate;
                const sellerWithdrawlRequest = await withdrawalRequestModel.create({sellerId: sellerId, amount: amountInUSD, currency: "usd", // Thêm loại tiền tệ vnd sang usd 💸
                });
                response(res, httpStatusCode.Created, {
                    message: successMessage.SEND_REQUEST_WITHDRAWAL_SUCCESS, data: sellerWithdrawlRequest,
                });
            } else {
                response(res, httpStatusCode.BadRequest, {
                    message: errorMessage.SEND_REQUEST_WITHDRAWAL_FAIL,
                });
            }
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    admin_receive_withdrawal_request = async (req, res) => {
        try {
            const pendingWithdrawalRequest = await withdrawalRequestModel.find({
                status: "pending",
            });
            response(res, httpStatusCode.Ok, {
                pendingWithdrawalRequest,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    confirm_withdrawal_request = async (req, res) => {
        const {withdrawalRequestId} = req.params;
        try {
            const withdrawalRequest = await withdrawalRequestModel.findById(withdrawalRequestId);

            const payment = await paymentModel.findOne({
                sellerId: new ObjectId(withdrawalRequest.sellerId),
            });

            const amountInCents = Math.round(withdrawalRequest.amount * 100);

            await stripe.transfers.create({
                amount: amountInCents, currency: "usd", destination: payment.accountId,
            });

            await withdrawalRequestModel.findByIdAndUpdate(withdrawalRequestId, {
                status: "success",
            });

            const updateWithdrawalRequest = await withdrawalRequestModel.findById(withdrawalRequestId);
            response(res, httpStatusCode.Ok, {
                message: successMessage.CONFIRM_WITHDRAWAL_REQUEST_SUCCESS, data: updateWithdrawalRequest,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };
}

module.exports = new paymentController();

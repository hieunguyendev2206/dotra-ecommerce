const orderModel = require("../database/models/order.models");
const sellerOfOrderModel = require("../database/models/sellerOfOrder.models");
const productModel = require("../database/models/product.models");
const cartModel = require("../database/models/cart.models");
const response = require("../utils/response");
const httpStatusCode = require("../config/httpStatusCode");
const { successMessage } = require("../config/message.config");
const {
    mongo: { ObjectId },
} = require("mongoose");
const queryOrders = require("../utils/queryOrders");
const mongoose = require("mongoose");

class orderController {
    // Kiểm tra đơn hàng đã được thanh toán chưa
    checkPaymentStatus = async (orderId) => {
        try {
            const order = await orderModel.findById(orderId);
            if (order.payment_status === "unpaid") {
                await orderModel.findByIdAndUpdate(orderId, {
                    delivery_status: "processing",
                });
                await sellerOfOrderModel.updateMany({ orderId: orderId }, { delivery_status: "processing" });
            }
            return true;
        } catch (error) {
            throw new Error(error);
        }
    };

    // Cập nhật lại số lượng sản phẩm sau khi đặt hàng
    updateProductQuantity = async (productId, quantity) => {
        const product = await productModel.findById(productId);
        let newQuantity = product.quantity - quantity;
        if (newQuantity < 0) {
            newQuantity = 0;
        }
        await productModel.findByIdAndUpdate(productId, { quantity: newQuantity });
    };

    // Đặt hàng
    place_order = async (req, res) => {
        const {
            customerId, customer_name, products, price, shipping_fee, items, shippingInfo,
        } = req.body;
        let sellerOfOrderData = [];
        let cartId = [];
        let customerOrder = [];

        for (let i = 0; i < products.length; i++) {
            const productIndex = products[i].products;
            for (let j = 0; j < productIndex.length; j++) {
                let tempCustomerOrder = productIndex[j].product_info;
                tempCustomerOrder.quantity = productIndex[j].quantity;
                tempCustomerOrder.color = productIndex[j].color;
                tempCustomerOrder.size = productIndex[j].size;
                await this.updateProductQuantity(productIndex[j].product_info._id, productIndex[j].quantity);
                customerOrder.push(tempCustomerOrder);
                if (productIndex[j]._id) {
                    cartId.push(productIndex[j]._id);
                }
            }
        }
        try {
            const order = await orderModel.create({
                customerId: customerId,
                customer_name: customer_name,
                products: customerOrder,
                price: price + shipping_fee,
                delivery_status: "processing",
                payment_status: "unpaid",
                delivery_address: shippingInfo,
                changeStatusDate: null,
            });

            for (let i = 0; i < products.length; i++) {
                const productIndex = products[i].products;
                const totalPriceIndex = products[i].total_price;
                const sellerId = products[i].sellerId;
                let storeProducts = [];
                for (let i = 0; i < productIndex.length; i++) {
                    let tempProduct = productIndex[i].product_info;
                    tempProduct.quantity = productIndex[i].quantity;
                    tempProduct.color = productIndex[i].color;
                    tempProduct.size = productIndex[i].size;
                    storeProducts.push(tempProduct);
                }
                sellerOfOrderData.push({
                    orderId: order.id,
                    sellerId: sellerId,
                    customerId: customerId,
                    customer_name: customer_name,
                    products: storeProducts,
                    price: totalPriceIndex,
                    payment_status: "unpaid",
                    shippingInfo: "Giao hàng tiết kiệm",
                    delivery_status: "processing",
                    changeStatusDate: null,
                });
            }

            await sellerOfOrderModel.insertMany(sellerOfOrderData);
            for (let i = 0; i < cartId.length; i++) {
                await cartModel.findByIdAndDelete(cartId[i]);
            }
            setTimeout(() => {
                this.checkPaymentStatus(order.id);
            }, 15000);
            response(res, httpStatusCode.Ok, {
                message: successMessage.ORDER_SUCCESS, data: order.id,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy thông tin đơn hàng trả về customer
    get_orders_to_customer = async (req, res) => {
        const { customerId } = req.params;
        try {
            const orders = await orderModel.find({ customerId: customerId });
            response(res, httpStatusCode.Ok, {
                data: orders,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy thông tin chi tiết đơn hàng trả về customer
    get_order_details_to_customer = async (req, res) => {
        const { orderId } = req.params;
        try {
            const order = await orderModel.findById(orderId);
            response(res, httpStatusCode.Ok, {
                data: order,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy thông tin đơn hàng trả về admin
    get_order_to_admin = async (req, res) => {
        const { searchValue, pageNumber, parPage } = req.query;
        try {
            const orders = await orderModel
                .find({ customer_name: { $regex: searchValue, $options: "i" } })
                .sort({ createdAt: -1 })
                .limit(parPage * 1)
                .skip((pageNumber - 1) * parPage);
            const totalOrders = await orderModel.find({
                customer_name: { $regex: searchValue, $options: "i" },
            });
            response(res, httpStatusCode.Ok, {
                data: orders, total: totalOrders.length,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy thông tin chi tiết đơn hàng trả về admin
    get_order_details_to_admin = async (req, res) => {
        const { orderId } = req.params;
        try {
            const order = await orderModel.aggregate([{
                $match: { _id: new ObjectId(orderId) },
            }, {
                $lookup: {
                    from: "selleroforders", localField: "_id", foreignField: "orderId", as: "sellerOfOrder",
                },
            },]);
            response(res, httpStatusCode.Ok, {
                data: order[0],
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Admin thay đổi trạng thái đơn hàng
    admin_change_status_order = async (req, res) => {
        const { statusChange, orderId } = req.body;
        try {
            await orderModel.findByIdAndUpdate(orderId, {
                delivery_status: statusChange, changeStatusDate: new Date(),
            });
            const order = await orderModel.findById(orderId);
            response(res, httpStatusCode.Ok, {
                message: successMessage.CHANGE_STATUS_ORDER_SUCCESS, data: order,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Truy vấn đơn hàng
    admin_query_orders = async (req, res) => {
        try {
            const orders = await orderModel.find({}).sort({ createdAt: -1 });

            const query = new queryOrders(orders, req.query)
                .recentOrdersQuery()
                .statusQuery()
                .paymentQuery();

            const totalOrders = query.countOrders();
            const resultOrders = query.limit().skip().getOrders();

            response(res, httpStatusCode.Ok, {
                data: {
                    orders: resultOrders, totalOrders,
                },
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy danh sách đơn hàng trả về seller
    get_orders_to_seller = async (req, res) => {
        const { sellerId } = req.params;
        const { searchValue } = req.query;
        const pageNumber = parseInt(req.query.pageNumber);
        const parPage = parseInt(req.query.parPage);

        try {
            const ordersOfSeller = await sellerOfOrderModel
                .find({
                    sellerId: sellerId, customer_name: { $regex: searchValue, $options: "i" },
                })
                .sort({ createdAt: -1 })
                .limit(parPage)
                .skip((pageNumber - 1) * parPage);

            const totalOrders = await sellerOfOrderModel.countDocuments({
                sellerId: sellerId, customer_name: { $regex: searchValue, $options: "i" },
            });

            response(res, httpStatusCode.Ok, {
                data: ordersOfSeller, total: totalOrders,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy thông tin chi tiết đơn hàng trả về seller
    get_order_details_to_seller = async (req, res) => {
        const { orderId } = req.params;

        try {
            const order = await sellerOfOrderModel.findById({
                _id: new ObjectId(orderId),
            });
            response(res, httpStatusCode.Ok, {
                data: order,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Seller thay đổi trạng thái đơn hàng
    seller_change_status_order = async (req, res) => {
        const { statusChange, orderId } = req.body;
        try {
            const order = await sellerOfOrderModel.findById(orderId);

            if (statusChange === "shipping") {
                order.delivery_status = statusChange;
                order.changeStatusDate = new Date();
            } else {
                order.delivery_status = statusChange;
            }

            await order.save();

            response(res, httpStatusCode.Ok, {
                message: successMessage.CHANGE_STATUS_ORDER_SUCCESS, data: order,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Seller truy vấn đơn hàng
    seller_query_orders = async (req, res) => {
        const { sellerId } = req.params;
        try {
            const sellerOfOrders = await sellerOfOrderModel
                .find({ sellerId: sellerId })
                .sort({ createdAt: -1 });

            // Sáng thêm routes
            const query = new queryOrders(sellerOfOrders, req.query)
                .recentOrdersQuery()
                .statusQuery()
                .paymentQuery();

            const totalOrders = query.countOrders();
            const resultOrders = query.limit().skip().getOrders();

            response(res, httpStatusCode.Ok, {
                data: {
                    orders: resultOrders, totalOrders,
                },
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };
}


module.exports = new orderController();

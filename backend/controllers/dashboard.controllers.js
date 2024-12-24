const orderModel = require("../database/models/order.models");
const response = require("../utils/response");
const httpStatusCode = require("../config/httpStatusCode");
const dotraWalletModel = require("../database/models/dotraWallet.models");
const sellerWalletModel = require("../database/models/sellerWallet.models");
const productModel = require("../database/models/product.models");
const sellerModel = require("../database/models/seller.models");
const sellerOfOrderModel = require("../database/models/sellerOfOrder.models");
const categoryModel = require("../database/models/category.models");
const customerModel = require("../database/models/customer.models");
const {
    mongo: {ObjectId},
} = require("mongoose");

class dashboardController {
    // Lấy dữ liệu cho dashboard
    get_dashboard_data = async (req, res) => {
        const {customerId} = req.params;
        try {
            const recent_orders = await orderModel
                .find({
                    customerId: new ObjectId(customerId),
                })
                .limit(5)
                .sort({createdAt: -1});

            const total_orders = await orderModel
                .find({customerId: new ObjectId(customerId)})
                .countDocuments();

            const total_delivered = await orderModel
                .find({
                    customerId: new ObjectId(customerId), delivery_status: "delivered",
                })
                .countDocuments();

            const total_processing = await orderModel
                .find({
                    customerId: new ObjectId(customerId), delivery_status: "processing",
                })
                .countDocuments();

            const total_cancelled = await orderModel
                .find({
                    customerId: new ObjectId(customerId), delivery_status: "canceled",
                })
                .countDocuments();

            response(res, httpStatusCode.Ok, {
                data: {
                    recent_orders, total_orders, total_delivered, total_processing, total_cancelled,
                },
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy dữ liệu cho dashboard admin
    get_admin_dashboard_data = async (req, res) => {
        const {id} = req;
        try {
            const totalAmount = await dotraWalletModel.aggregate([{
                $group: {
                    _id: null, totalAmount: {$sum: "$amount"},
                },
            },]);

            const totalOrder = await orderModel.find().countDocuments();

            const totalProduct = await productModel.find().countDocuments();

            const totalSeller = await sellerModel.find().countDocuments();

            const recentOrder = await orderModel
                .find()
                .limit(5)
                .sort({createdAt: -1});
            response(res, httpStatusCode.Ok, {
                data: {
                    totalAmount: totalAmount[0]?.totalAmount || 0, totalOrder, totalProduct, totalSeller, recentOrder,
                },
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy dữ liệu cho dashboard seller
    get_seller_dashboard_data = async (req, res) => {
        const {id} = req;
        try {
            const totalAmount = await sellerWalletModel.aggregate([{
                $match: {
                    sellerId: new ObjectId(id),
                },
            }, {
                $group: {
                    _id: null, totalAmount: {$sum: "$amount"},
                },
            },]);

            const totalOrder = await sellerOfOrderModel
                .find({sellerId: id})
                .countDocuments();

            const totalProduct = await productModel
                .find({sellerId: id})
                .countDocuments();

            const recentOrder = await sellerOfOrderModel
                .find({sellerId: id})
                .limit(5)
                .sort({createdAt: -1});

            const customerIds = await sellerOfOrderModel
                .find({sellerId: id})
                .distinct("customerId");
            const totalCustomer = customerIds.length;

            response(res, httpStatusCode.Ok, {
                data: {
                    totalAmount: totalAmount[0]?.totalAmount || 0, totalOrder, totalProduct, totalCustomer, recentOrder,
                },
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy dữ liệu đưa lên chart
    get_data_on_chart = async (req, res) => {
        try {
            const orders = await orderModel.aggregate([{
                $project: {
                    month: {$month: "$createdAt"},
                },
            }, {
                $group: {
                    _id: "$month", count: {$sum: 1},
                },
            }, {
                $sort: {_id: 1},
            },]);

            const products = await productModel.aggregate([{
                $project: {
                    month: {$month: "$createdAt"},
                },
            }, {
                $group: {
                    _id: "$month", count: {$sum: 1},
                },
            }, {
                $sort: {_id: 1},
            },]);

            const sellers = await sellerModel.aggregate([{
                $project: {
                    month: {$month: "$createdAt"},
                },
            }, {
                $group: {
                    _id: "$month", count: {$sum: 1},
                },
            }, {
                $sort: {_id: 1},
            },]);

            const categories = await categoryModel.aggregate([{
                $project: {
                    month: {$month: "$createdAt"},
                },
            }, {
                $group: {
                    _id: "$month", count: {$sum: 1},
                },
            }, {
                $sort: {_id: 1},
            },]);

            const customers = await customerModel.aggregate([{
                $project: {
                    month: {$month: "$createdAt"},
                },
            }, {
                $group: {
                    _id: "$month", count: {$sum: 1},
                },
            }, {
                $sort: {_id: 1},
            },]);

            const revenues = await dotraWalletModel.aggregate([{
                $project: {
                    month: {$month: "$createdAt"}, amount: 1,
                },
            }, {
                $group: {
                    _id: "$month", total: {$sum: "$amount"},
                },
            }, {
                $sort: {_id: 1},
            },]);

            const deliveryStatuses = ["processing", "shipping", "delivered", "canceled",];
            const orderFilter = await orderModel.find({});

            const counts = deliveryStatuses.reduce((acc, status) => {
                acc[status] = orderFilter.filter((order) => order.delivery_status === status).length;
                return acc;
            }, {});

            const total = Object.values(counts).reduce((a, b) => a + b, 0);

            const percentages = {};
            for (const status of deliveryStatuses) {
                percentages[status] = total === 0 ? 0 : (counts[status] / total) * 100;
            }

            const percentagesArray = Object.entries(percentages).map(([status, percentage]) => ({
                status, percentage,
            }));

            const monthlyOrderCounts = Array(12).fill(0);
            const monthlyProductCounts = Array(12).fill(0);
            const monthlySellerCounts = Array(12).fill(0);
            const monthlyCustomerCounts = Array(12).fill(0);
            const monthlyCategoryCounts = Array(12).fill(0);
            const monthlyRevenues = Array(12).fill(0);

            orders.forEach((order) => {
                monthlyOrderCounts[order._id - 1] = order.count;
            });

            products.forEach((product) => {
                monthlyProductCounts[product._id - 1] = product.count;
            });

            sellers.forEach((seller) => {
                monthlySellerCounts[seller._id - 1] = seller.count;
            });

            customers.forEach((customer) => {
                monthlyCustomerCounts[customer._id - 1] = customer.count;
            });

            categories.forEach((category) => {
                monthlyCategoryCounts[category._id - 1] = category.count;
            });

            revenues.forEach((revenue) => {
                monthlyRevenues[revenue._id - 1] = revenue.total;
            });

            response(res, httpStatusCode.Ok, {
                monthlyOrderCounts,
                monthlyProductCounts,
                monthlySellerCounts,
                monthlyCustomerCounts,
                monthlyCategoryCounts,
                monthlyRevenues,
                percentagesArray,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy dữ liệu thống kê trả về cho seller
    get_seller_chart_data = async (req, res) => {
        const {id} = req;
        try {
            const orders = await sellerOfOrderModel.aggregate([{
                $match: {
                    sellerId: new ObjectId(id),
                },
            }, {
                $project: {
                    month: {$month: "$createdAt"},
                },
            }, {
                $group: {
                    _id: "$month", count: {$sum: 1},
                },
            }, {
                $sort: {_id: 1},
            },]);

            const products = await productModel.aggregate([{
                $match: {
                    sellerId: new ObjectId(id),
                },
            }, {
                $project: {
                    month: {$month: "$createdAt"},
                },
            }, {
                $group: {
                    _id: "$month", count: {$sum: 1},
                },
            }, {
                $sort: {_id: 1},
            },]);

            const customers = await sellerOfOrderModel.aggregate([{
                $match: {
                    sellerId: new ObjectId(id),
                },
            }, {
                $project: {
                    month: {$month: "$createdAt"}, customerId: 1,
                },
            }, {
                $group: {
                    _id: {month: "$month", customerId: "$customerId"},
                },
            }, {
                $group: {
                    _id: "$_id.month", uniqueCustomers: {$sum: 1},
                },
            }, {
                $sort: {_id: 1},
            },]);

            const revenues = await sellerWalletModel.aggregate([{
                $match: {
                    sellerId: new ObjectId(id),
                },
            }, {
                $project: {
                    month: {$month: "$createdAt"}, amount: 1,
                },
            }, {
                $group: {
                    _id: "$month", total: {$sum: "$amount"},
                },
            }, {
                $sort: {_id: 1},
            },]);

            const deliveryStatuses = ["processing", "shipping", "delivered", "canceled",];

            const orderFilter = await sellerOfOrderModel.find({sellerId: id});

            const counts = deliveryStatuses.reduce((acc, status) => {
                acc[status] = orderFilter.filter((order) => order.delivery_status === status).length;
                return acc;
            }, {});

            const total = Object.values(counts).reduce((a, b) => a + b, 0);

            const percentages = {};
            for (const status of deliveryStatuses) {
                percentages[status] = total === 0 ? 0 : (counts[status] / total) * 100;
            }

            const percentagesArray = Object.entries(percentages).map(([status, percentage]) => ({
                status, percentage,
            }));

            const monthlyOrderCounts = Array(12).fill(0);
            const monthlyProductCounts = Array(12).fill(0);
            const monthlyUniqueCustomerCounts = Array(12).fill(0);
            const monthlyRevenues = Array(12).fill(0);

            orders.forEach((order) => {
                monthlyOrderCounts[order._id - 1] = order.count;
            });

            products.forEach((product) => {
                monthlyProductCounts[product._id - 1] = product.count;
            });

            customers.forEach((result) => {
                if (result._id >= 1 && result._id <= 12) {
                    monthlyUniqueCustomerCounts[result._id - 1] = result.uniqueCustomers;
                }
            });

            revenues.forEach((revenue) => {
                monthlyRevenues[revenue._id - 1] = revenue.total;
            });

            response(res, httpStatusCode.Ok, {
                monthlyOrderCounts,
                monthlyProductCounts,
                monthlyUniqueCustomerCounts,
                monthlyRevenues,
                percentagesArray,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };
}

module.exports = new dashboardController();

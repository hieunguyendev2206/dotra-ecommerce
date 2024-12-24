const httpStatusCode = require("../config/httpStatusCode");
const {successMessage} = require("../config/message.config");
const sellerModel = require("../database/models/seller.models");
const response = require("../utils/response");

class sellerController {
    // Lấy danh sách seller yêu cầu kích hoạt tài khoản
    get_seller_request = async (req, res) => {
        const {page, parPage, searchValue} = req.query;
        try {
            let skipPage = "";
            if (page && parPage) {
                skipPage = (parseInt(page) - 1) * parseInt(parPage);
            }
            if (searchValue && page && parPage) {
                const sellers = await sellerModel
                    .find({
                        $text: {$search: searchValue}, status: "pending",
                    })
                    .skip(skipPage)
                    .limit(parPage)
                    .sort({createdAt: -1});
                const totalSeller = await sellerModel
                    .find({
                        $text: {$search: searchValue}, status: "pending",
                    })
                    .countDocuments();
                response(res, httpStatusCode.Ok, {
                    totalSeller, sellers,
                });
            } else if (searchValue === "" && page && parPage) {
                const sellers = await sellerModel
                    .find({status: "pending"})
                    .skip(skipPage)
                    .limit(parPage)
                    .sort({createdAt: -1});
                const totalSeller = await sellerModel
                    .find({status: "pending"})
                    .countDocuments();
                response(res, httpStatusCode.Ok, {
                    totalSeller, sellers,
                });
            } else {
                const sellers = await sellerModel.find({status: "pending"}).sort({
                    createdAt: -1,
                });
                const totalSeller = await sellerModel
                    .find({status: "pending"})
                    .countDocuments();
                response(res, httpStatusCode.Ok, {
                    totalSeller, sellers,
                });
            }
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy chi tiết thông tin seller
    get_seller_details = async (req, res) => {
        const {sellerId} = req.params;
        try {
            const seller_info = await sellerModel.findById(sellerId);
            response(res, httpStatusCode.Ok, {
                seller_info,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy chi tiết thông tin seller cho store
    get_seller_details_for_store = async (req, res) => {
        const { sellerId } = req.params;
        try {
            const seller = await sellerModel.findById(sellerId, {
                name: 1,
                shop_info: 1,
                image: 1,
            });
            if (!seller) {
                return res.status(404).json({ message: "Cửa hàng không tồn tại" });
            }
            res.status(200).json(seller);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error });
        }
    };

    // Thay đổi trạng thái seller
    seller_update_status = async (req, res) => {
        const {sellerId, status} = req.body;
        try {
            await sellerModel.findByIdAndUpdate(sellerId, {status});
            const seller_info = await sellerModel.findById(sellerId);
            response(res, httpStatusCode.Ok, {
                message: successMessage.UPDATE_SELLER_STATUS_SUCCESS, data: seller_info,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy danh sách seller đã kích hoạt
    get_seller_active = async (req, res) => {
        const {page, parPage, searchValue} = req.query;
        try {
            let skipPage = "";
            if (page && parPage) {
                skipPage = (parseInt(page) - 1) * parseInt(parPage);
            }
            if (searchValue && page && parPage) {
                const sellers = await sellerModel
                    .find({
                        $text: {$search: searchValue}, status: "active",
                    })
                    .skip(skipPage)
                    .limit(parPage)
                    .sort({createdAt: -1});
                const totalSeller = await sellerModel
                    .find({
                        $text: {$search: searchValue}, status: "active",
                    })
                    .countDocuments();
                response(res, httpStatusCode.Ok, {
                    totalSeller, sellers,
                });
            } else if (searchValue === "" && page && parPage) {
                const sellers = await sellerModel
                    .find({status: "active"})
                    .skip(skipPage)
                    .limit(parPage)
                    .sort({createdAt: -1});
                const totalSeller = await sellerModel
                    .find({status: "active"})
                    .countDocuments();
                response(res, httpStatusCode.Ok, {
                    totalSeller, sellers,
                });
            } else {
                const sellers = await sellerModel.find({status: "active"}).sort({
                    createdAt: -1,
                });
                const totalSeller = await sellerModel
                    .find({status: "active"})
                    .countDocuments();
                response(res, httpStatusCode.Ok, {
                    totalSeller, sellers,
                });
            }
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy danh sách seller bị vô hiệu hóa
    get_seller_deactive = async (req, res) => {
        const {page, parPage, searchValue} = req.query;
        try {
            let skipPage = "";
            if (page && parPage) {
                skipPage = (parseInt(page) - 1) * parseInt(parPage);
            }
            if (searchValue && page && parPage) {
                const sellers = await sellerModel
                    .find({
                        $text: {$search: searchValue}, status: "deactive",
                    })
                    .skip(skipPage)
                    .limit(parPage)
                    .sort({createdAt: -1});
                const totalSeller = await sellerModel
                    .find({
                        $text: {$search: searchValue}, status: "deactive",
                    })
                    .countDocuments();
                response(res, httpStatusCode.Ok, {
                    totalSeller, sellers,
                });
            } else if (searchValue === "" && page && parPage) {
                const sellers = await sellerModel
                    .find({status: "deactive"})
                    .skip(skipPage)
                    .limit(parPage)
                    .sort({createdAt: -1});
                const totalSeller = await sellerModel
                    .find({status: "deactive"})
                    .countDocuments();
                response(res, httpStatusCode.Ok, {
                    totalSeller, sellers,
                });
            } else {
                const sellers = await sellerModel.find({status: "deactive"}).sort({
                    createdAt: -1,
                });
                const totalSeller = await sellerModel
                    .find({status: "deactive"})
                    .countDocuments();
                response(res, httpStatusCode.Ok, {
                    totalSeller, sellers,
                });
            }
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };
}

module.exports = new sellerController();

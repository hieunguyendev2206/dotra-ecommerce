const {successMessage} = require("../config/message.config");
const httpStatusCode = require("../config/httpStatusCode");
const couponsModel = require("../database/models/coupons.models");
const response = require("../utils/response");
const moment = require("moment");

// Hàm kiểm tra hết hạn
const checkExpired = async (coupons, currentDate) => {
    for (let coupon of coupons) {
        if (moment(coupon.end_date).isBefore(currentDate)) {
            coupon.isExpired = true;
            await coupon.save();
        }
    }
};

class couponsController {
    // Thêm mã giảm giá
    add_coupons = async (req, res) => {
        const {coupons_name, coupons_code, coupons_price, start_day, end_date} = req.body;
        try {
            const new_coupons = await couponsModel.create({
                coupons_name,
                coupons_code,
                coupons_price,
                start_day: new Date(start_day),
                end_date: new Date(end_date),
                isExpired: false,
            });
            response(res, httpStatusCode.Created, {
                message: successMessage.ADD_COUPONS_SUCCESS, data: new_coupons,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy danh sách mã giảm giá
    get_coupons = async (req, res) => {
        const {page, parPage, searchValue} = req.query;
        try {
            let skipPage = "";
            if (page && parPage) {
                skipPage = (parseInt(page) - 1) * parseInt(parPage);
            }
            let coupons;
            if (searchValue && page && parPage) {
                coupons = await couponsModel
                    .find({
                        $text: {$search: searchValue},
                    })
                    .skip(skipPage)
                    .limit(parPage)
                    .sort({createdAt: -1});
            } else if (searchValue === "" && page && parPage) {
                coupons = await couponsModel
                    .find({})
                    .skip(skipPage)
                    .limit(parPage)
                    .sort({createdAt: -1});
            } else {
                coupons = await couponsModel.find({}).sort({createdAt: -1});
            }

            // Kiểm tra hết hạn
            const currentDate = moment();
            await checkExpired(coupons, currentDate);

            const totalCoupons = await couponsModel.find({}).countDocuments();
            response(res, httpStatusCode.Ok, {
                totalCoupons, data: coupons,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy chi tiết mã giảm giá
    get_coupon = async (req, res) => {
        const {couponId} = req.params;
        try {
            const coupon = await couponsModel.findById(couponId);
            response(res, httpStatusCode.Ok, {
                data: coupon,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Chỉnh sửa mã giảm giá
    update_coupons = async (req, res) => {
        const {
            coupons_id, coupons_name, coupons_code, coupons_price, start_day, end_date,
        } = req.body;
        try {
            await couponsModel.findByIdAndUpdate(coupons_id, {
                coupons_name, coupons_code, coupons_price, start_day: new Date(start_day), end_date: new Date(end_date),
            });
            const coupons = await couponsModel.findById(coupons_id);
            response(res, httpStatusCode.Ok, {
                message: successMessage.UPDATE_COUPONS_SUCCESS, data: coupons,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Xóa mã giảm giá
    delete_coupons = async (req, res) => {
        const {couponId} = req.params;
        try {
            const coupons = await couponsModel.findByIdAndDelete(couponId);
            response(res, httpStatusCode.Ok, {
                message: successMessage.DELETE_COUPONS_SUCCESS, data: coupons,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };
}

module.exports = new couponsController();

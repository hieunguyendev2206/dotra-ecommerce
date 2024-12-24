const wishlistModel = require("../database/models/wishlist.models");
const response = require("../utils/response");
const httpStatusCode = require("../config/httpStatusCode");
const {successMessage, errorMessage} = require("../config/message.config");

class wishlistController {
    // Thêm sản phẩm vào danh sách yêu thích
    add_to_wishlist = async (req, res) => {
        const {
            customerId, productId, product_name, brand_name, price, quantity, discount, image, slug, rating,
        } = req.body;
        try {
            const wishlistProduct = await wishlistModel.findOne({
                productId: productId,
            });
            if (wishlistProduct) {
                response(res, httpStatusCode.BadRequest, {
                    message: errorMessage.PRODUCT_ALREADY_IN_WISHLIST,
                });
            } else {
                await wishlistModel.create({
                    customerId, productId, product_name, brand_name, price, quantity, discount, image, slug, rating,
                });
                response(res, httpStatusCode.Ok, {
                    message: successMessage.ADD_TO_WISHLIST_SUCCESS,
                });
            }
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy danh sách yêu thích
    get_wishlist = async (req, res) => {
        const {customerId} = req.params;
        try {
            const wishlist = await wishlistModel.find({customerId: customerId});
            const total_wishlist = await wishlistModel.countDocuments({
                customerId: customerId,
            });
            response(res, httpStatusCode.Ok, {
                total_wishlist, data: wishlist,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Xóa sản phẩm khỏi danh sách yêu thích
    delete_wishlist = async (req, res) => {
        const {wishlistId} = req.params;
        try {
            const wishlist = await wishlistModel.findByIdAndDelete(wishlistId);
            response(res, httpStatusCode.Ok, {
                message: successMessage.DELETE_WISHLIST_SUCCESS, data: wishlist,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };
}

module.exports = new wishlistController();

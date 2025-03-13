const {errorMessage, successMessage} = require("../config/message.config");
const {
    mongo: {ObjectId},
} = require("mongoose");
const cartModel = require("../database/models/cart.models");
const couponModel = require("../database/models/coupons.models");
const response = require("../utils/response");
const httpStatusCode = require("../config/httpStatusCode");

class cartController {
    // Thêm sản phẩm vào giỏ hàng
    add_to_cart = async (req, res) => {
        const {customerId, productId, quantity, color, size} = req.body;

        try {
            if (!color || !color.name || !color.code) {
                return response(res, httpStatusCode.BadRequest, {
                    message: "Vui lòng chọn màu sắc sản phẩm",
                });
            }

            if (!size) {
                return response(res, httpStatusCode.BadRequest, {
                    message: "Vui lòng chọn kích thước sản phẩm",
                });
            }

            const existingCartItem = await cartModel.findOne({
                customerId,
                productId,
                'color.name': color.name,
                'color.code': color.code,
                size
            });

            if (existingCartItem) {
                existingCartItem.quantity += quantity;
                await existingCartItem.save();
                return response(res, httpStatusCode.Ok, {
                    message: successMessage.INCREASE_QUANTITY_SUCCESS,
                    data: existingCartItem,
                });
            }

            const cart = await cartModel.create({
                customerId,
                productId,
                quantity,
                color,
                size
            });

            response(res, httpStatusCode.Created, {
                message: successMessage.ADD_TO_CART_SUCCESS,
                data: cart,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy sản phẩm trong giỏ hàng
    get_cart = async (req, res) => {
        const {customerId} = req.params;
        try {
            const cart = await cartModel.aggregate([{
                $match: {
                    customerId: {$eq: new ObjectId(customerId)},
                },
            }, {
                $lookup: {
                    from: "products", localField: "productId", foreignField: "_id", as: "products",
                },
            },]);
            let caculate_price = 0;
            let cart_product_count = 0;
            let buy_product_item = 0;
            // Hết hàng
            let out_of_stock = cart.filter((item) => item.products[0].quantity < item.quantity);
            for (let i = 0; i < out_of_stock.length; i++) {
                cart_product_count += out_of_stock[i].quantity;
            }
            // Còn sản phẩm
            const quantity_product = cart.filter((item) => item.products[0].quantity >= item.quantity);
            for (let i = 0; i < quantity_product.length; i++) {
                const {quantity} = quantity_product[i];
                cart_product_count += quantity;
                buy_product_item += quantity;
                const {price, discount} = quantity_product[i].products[0];
                // Tính toán giá sản phẩm dựa trên số lượng (quantity), giá gốc (price), và tỷ lệ giảm giá (discount)
                if (discount > 0) {
                    caculate_price += quantity * (price - Math.floor((price * discount) / 100));
                } else {
                    caculate_price += quantity * price;
                }
            }

            // Tính toán sản phẩm từ nhiều seller khác nhau
            let p = [];
            let unique = [...new Set(quantity_product.map((item) => item.products[0].sellerId.toString())),];
            let shipping_fee = 30000 * unique.length;
            for (let i = 0; i < unique.length; i++) {
                let total_price = 0;
                for (let j = 0; j < quantity_product.length; j++) {
                    const temp_product = quantity_product[j].products[0];
                    if (unique[i] === temp_product.sellerId.toString()) {
                        let price = 0;
                        if (temp_product.discount !== 0) {
                            price = temp_product.price - Math.floor((temp_product.price * temp_product.discount) / 100);
                        } else {
                            price = temp_product.price;
                        }
                        total_price = total_price + price * quantity_product[j].quantity;
                        p[i] = {
                            sellerId: unique[i],
                            shop_name: temp_product.shop_name,
                            total_price,
                            products: p[i] ? [...p[i].products, {
                                _id: quantity_product[j]._id,
                                quantity: quantity_product[j].quantity,
                                product_info: temp_product,
                                color: quantity_product[j].color,
                                size: quantity_product[j].size
                            },] : [{
                                _id: quantity_product[j]._id,
                                quantity: quantity_product[j].quantity,
                                product_info: temp_product,
                                color: quantity_product[j].color,
                                size: quantity_product[j].size
                            },],
                        };
                    }
                }
            }
            response(res, httpStatusCode.Ok, {
                data: {
                    cart: p,
                    total_price: caculate_price,
                    cart_product_count,
                    buy_product_item,
                    out_of_stock,
                    shipping_fee,
                },
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Xóa sản phẩm khỏi giỏ hàng
    delete_product_cart = async (req, res) => {
        const {cartId} = req.params;
        try {
            await cartModel.findByIdAndDelete(cartId);
            response(res, httpStatusCode.Ok, {
                message: successMessage.DELETE_PRODUCT_CART_SUCCESS,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Tăng số lượng sản phẩm trong giỏ hàng
    increase_quantity = async (req, res) => {
        const {cartId} = req.params;
        try {
            await cartModel.findByIdAndUpdate(cartId, {
                $inc: {quantity: 1},
            });
            response(res, httpStatusCode.Ok, {
                message: successMessage.INCREASE_QUANTITY_SUCCESS,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Giảm số lượng sản phẩm trong giỏ hàng
    decrease_quantity = async (req, res) => {
        const {cartId} = req.params;
        try {
            await cartModel.findByIdAndUpdate(cartId, {
                $inc: {quantity: -1},
            });
            response(res, httpStatusCode.Ok, {
                message: successMessage.DECREASE_QUANTITY_SUCCESS,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Áp dụng mã giảm giá
    apply_coupons = async (req, res) => {
        const {coupons_code} = req.body;
        try {
            const coupons = await couponModel.findOne({coupons_code});
            if (!coupons) {
                response(res, httpStatusCode.BadRequest, {
                    message: errorMessage.COUPONS_NOT_FOUND,
                });
            } else if (coupons.isExpired) {
                response(res, httpStatusCode.BadRequest, {
                    message: errorMessage.COUPONS_EXPIRED,
                });
            } else {
                response(res, httpStatusCode.Ok, {
                    message: successMessage.APPLY_COUPONS_SUCCESS, data: coupons.coupons_price,
                });
            }
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

}

module.exports = new cartController();

const reviewModel = require("../database/models/review.models");
const orderModel = require("../database/models/order.models");
const productModel = require("../database/models/product.models");
const sellerModel = require("../database/models/seller.models");
const replyReviewModel = require("../database/models/replyReview.models");
const response = require("../utils/response");
const httpStatusCode = require("../config/httpStatusCode");
const {errorMessage, successMessage} = require("../config/message.config");
const {
    mongo: {ObjectId},
} = require("mongoose");

class reviewController {
    // Kiểm tra sản phẩm đã được mua chưa
    isProductBought = async (productId, customerId) => {
        const orders = await orderModel.find({
            customerId: customerId,
            payment_status: "paid",
            delivery_status: "delivered",
            "products._id": productId
        });

        return orders.length > 0;
    };

    // Thêm đánh giá sản phẩm
    add_review = async (req, res) => {
        const {productId, customerId, customer_name, review, rating, avatar} = req.body;
        try {
            const isBought = await this.isProductBought(productId, customerId);

            if (!isBought) {
                response(res, httpStatusCode.BadRequest, {
                    message_error_review: errorMessage.ADD_REVIEW_FAIL,
                });
            } else {
                const existingReview = await reviewModel.findOne({
                    productId, customerId,
                });
                if (existingReview) {
                    response(res, httpStatusCode.BadRequest, {
                        message_error_review: errorMessage.ALREADY_REVIEWED,
                    });
                } else {
                    const sellerOfProduct = await productModel.findById(productId);
                    const sellerId = sellerOfProduct.sellerId;
                    const product_name = sellerOfProduct.product_name;
                    const product_image = sellerOfProduct.images[0];
                    const new_review = await reviewModel.create({
                        productId: productId,
                        product_name: product_name,
                        product_image: product_image,
                        sellerId: sellerId,
                        customerId: customerId,
                        customer_name: customer_name,
                        avatar: avatar,
                        rating: rating,
                        review: review,
                    });

                    let rating_product = 0;

                    const reviews = await reviewModel.find({productId: productId});

                    for (let i = 0; i < reviews.length; i++) {
                        rating_product = rating_product + reviews[i].rating;
                    }

                    let update_product_rating = 0;

                    if (reviews.length !== 0) {
                        update_product_rating = (rating_product / reviews.length).toFixed(1);
                    }

                    await productModel.findByIdAndUpdate(productId, {
                        rating: update_product_rating,
                    });
                    response(res, httpStatusCode.Created, {
                        message: successMessage.ADD_REVIEW_SUCCESS, data: new_review,
                    });
                }
            }
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy review của khách hàng
    get_review = async (req, res) => {
        const {productId} = req.params;
        const {pageNumber} = req.query;
        const limit = 10;
        const skipPage = limit * (pageNumber - 1);

        try {
            const [getRating, getAll, reviews] = await Promise.all([reviewModel.aggregate([{
                $match: {
                    productId: {
                        $eq: new ObjectId(productId),
                    },
                },
            }, {
                $group: {
                    _id: "$rating", count: {
                        $sum: 1,
                    },
                },
            },]), reviewModel.find({productId}), reviewModel
                .find({productId})
                .skip(skipPage)
                .limit(limit)
                .sort({createdAt: -1}),]);

            const rating_review = [5, 4, 3, 2, 1].map((rating) => {
                const ratingData = getRating.find((r) => r._id === rating);
                return {
                    rating, sum: ratingData ? ratingData.count : 0,
                };
            });

            response(res, httpStatusCode.Ok, {
                rating_review, reviews, total_review: getAll.length,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy review trả về seller
    get_review_seller = async (req, res) => {
        const {page, parPage, searchValue} = req.query;
        const {id} = req;
        try {
            let skipPage = "";
            if (page && parPage) {
                skipPage = (parseInt(page) - 1) * parseInt(parPage);
            }
            if (searchValue && page && parPage) {
                const reviews = await reviewModel
                    .find({
                        sellerId: id, $text: {$search: searchValue},
                    })
                    .skip(skipPage)
                    .limit(parseInt(parPage));

                const totalReview = await reviewModel
                    .find({
                        sellerId: id, $text: {$search: searchValue},
                    })
                    .countDocuments();
                response(res, httpStatusCode.Ok, {
                    totalReview, reviews,
                });
            } else if (searchValue === "" && page && parPage) {
                const reviews = await reviewModel
                    .find({sellerId: id})
                    .skip(skipPage)
                    .limit(parseInt(parPage));

                const totalReview = await reviewModel
                    .find({sellerId: id})
                    .countDocuments();
                response(res, httpStatusCode.Ok, {
                    totalReview, reviews,
                });
            } else {
                const reviews = await reviewModel.find({sellerId: id});

                const totalReview = await reviewModel
                    .find({sellerId: id})
                    .countDocuments();
                response(res, httpStatusCode.Ok, {
                    totalReview, reviews,
                });
            }
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    get_shop_reviews_with_reply = async (req, res) => {
        const {shopId} = req.params; // shopId là sellerId
        try {
            const reviews = await reviewModel.aggregate([
                {
                    $match: {sellerId: shopId}, // Lọc các đánh giá thuộc cửa hàng
                },
                {
                    $lookup: {
                        from: "replyreviews", // Tên collection của replyReview
                        localField: "_id",    // Trường join trong collection review
                        foreignField: "reviewId", // Trường join trong collection replyReview
                        as: "reply",          // Tên field chứa kết quả join
                    },
                },
                {
                    $sort: {createdAt: -1}, // Sắp xếp theo thời gian tạo mới nhất
                },
            ]);

            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).json({message: "Lỗi server", error});
        }
    };

    // Lấy review theo id
    get_review_by_id = async (req, res) => {
        const {reviewId} = req.params;
        try {
            const review = await reviewModel.findById(reviewId);
            response(res, httpStatusCode.Ok, {
                review,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Seller trả lời review của khách hàng
    reply_review = async (req, res) => {
        const {reviewId, reply} = req.body;
        const {id} = req;
        try {
            const seller = await sellerModel.findById(id);
            await replyReviewModel.create({
                reviewId: reviewId,
                sellerId: id,
                seller_name: seller.name,
                seller_avatar: seller.image,
                shop_name: seller.shop_info.shop_name,
                reply: reply,
            });
            response(res, httpStatusCode.Created, {
                message: successMessage.REPLY_REVIEW_SUCCESS,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy reply review của seller trả về khách hàng
    get_reply_review = async (req, res) => {
        try {
            const sellerReply = await replyReviewModel.find();
            response(res, httpStatusCode.Ok, {
                sellerReply,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };
}

module.exports = new reviewController();

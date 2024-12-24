const {Schema, model} = require("mongoose");

const replyReviewSchema = new Schema({
    reviewId: {
        type: Schema.Types.ObjectId, require: true,
    }, sellerId: {
        type: Schema.Types.ObjectId, require: true,
    }, seller_name: {
        type: String, require: true,
    }, seller_avatar: {
        type: String, require: true,
    }, shop_name: {
        type: String, require: true,
    }, reply: {
        type: String, require: true,
    },
}, {timestamps: true});

module.exports = model("replyReview", replyReviewSchema);

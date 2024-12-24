const {Schema, model} = require("mongoose");

const wishlistSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId, required: true,
    }, productId: {
        type: Schema.Types.ObjectId, required: true,
    }, product_name: {
        type: String, required: true,
    }, brand_name: {
        type: String, required: true,
    }, price: {
        type: Number, required: true,
    }, quantity: {
        type: Number, required: true,
    }, discount: {
        type: Number, required: true,
    }, image: {
        type: String, required: true,
    }, slug: {
        type: String, required: true,
    }, rating: {
        type: Number, required: true,
    },
}, {timestamps: true});

module.exports = model("wishlist", wishlistSchema);

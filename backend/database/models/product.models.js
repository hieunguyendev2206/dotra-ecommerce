const {Schema, model} = require("mongoose");

const productSchema = new Schema({
    sellerId: {
        type: Schema.ObjectId, required: true,
    }, product_name: {
        type: String, required: true,
    }, brand_name: {
        type: String, required: true,
    }, category_name: {
        type: String, required: true,
    }, price: {
        type: Number, required: true,
    }, quantity: {
        type: Number, required: true,
    }, discount: {
        type: Number, required: true,
    }, description: {
        type: String, required: true,
    }, images: {
        type: Array, required: true,
    }, colors: [{
        name: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true
        }
    }],
    sizes: [{
        type: String,
        required: true
    }],
    slug: {
        type: String, required: true,
    }, rating: {
        type: Number, default: 0,
    }, shop_name: {
        type: String, required: true,
    },
}, {timestamps: true});

productSchema.index({
    product_name: "text", brand_name: "text", category_name: "text",
}, {
    weights: {
        product_name: 5, brand_name: 4, category_name: 3,
    },
});

module.exports = model("product", productSchema);

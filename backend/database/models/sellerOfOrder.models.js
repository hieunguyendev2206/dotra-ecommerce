const {Schema, model} = require("mongoose");

const sellerOfOrderSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId, require: true,
    }, sellerId: {
        type: Schema.Types.ObjectId, require: true,
    }, customerId: {
        type: Schema.Types.ObjectId, require: true,
    }, customer_name: {
        type: String, require: true,
    }, products: {
        type: Array, require: true,
    }, price: {
        type: Number, require: true,
    }, payment_status: {
        type: String, require: true,
    }, delivery_status: {
        type: String, require: true,
    }, changeStatusDate: {
        type: Date, default: null,
    }, shippingInfo: {
        type: String, require: true,
    },
}, {timestamps: true});

sellerOfOrderSchema.index({
    customer_name: "text",
});

module.exports = model("sellerOfOrder", sellerOfOrderSchema);

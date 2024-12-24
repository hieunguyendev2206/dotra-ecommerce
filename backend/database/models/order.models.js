const {Schema, model} = require("mongoose");

const orderSchema = new Schema({
    customerId: {
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
    }, delivery_address: {
        type: Object, require: true,
    }, changeStatusDate: {
        type: Date, default: null,
    },
}, {timestamps: true});

orderSchema.index({
    customer_name: "text",
});

module.exports = model("order", orderSchema);

const {Schema, model} = require("mongoose");

const cartSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId, required: true,
    }, productId: {
        type: Schema.Types.ObjectId, required: true,
    }, quantity: {
        type: Number, required: true,
    },
}, {timestamps: true});

module.exports = model("cart", cartSchema);

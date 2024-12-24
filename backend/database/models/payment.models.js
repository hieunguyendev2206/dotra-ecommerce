const {Schema, model} = require("mongoose");

const paymentSchema = new Schema({
    sellerId: {
        type: Schema.Types.ObjectId, required: true,
    }, accountId: {
        type: String, required: true,
    }, activeCode: {
        type: String, required: true,
    },
}, {timestamps: true});

module.exports = model("payment", paymentSchema);

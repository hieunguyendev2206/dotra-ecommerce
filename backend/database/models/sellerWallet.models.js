const {Schema, model} = require("mongoose");

const sellerWalletSchema = new Schema({
    sellerId: {
        type: Schema.Types.ObjectId, required: true,
    }, amount: {
        type: Number, required: true,
    },
}, {timestamps: true});

module.exports = model("sellerwallet", sellerWalletSchema);

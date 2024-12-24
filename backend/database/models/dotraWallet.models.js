const {Schema, model} = require("mongoose");

const dotraWalletSchema = new Schema({
    amount: {
        type: Number, required: true,
    },
}, {timestamps: true});

module.exports = model("dotrawallet", dotraWalletSchema);

const {Schema, model} = require("mongoose");

const withdrawalRequestSchema = new Schema({
    sellerId: {
        type: Schema.Types.ObjectId, required: true,
    }, amount: {
        type: Number, required: true,
    }, status: {
        type: String, default: "pending",
    },
}, {timestamps: true});

module.exports = model("withdrawalRequest", withdrawalRequestSchema);

const {Schema, model} = require("mongoose");

const messageSellerAndAdminSchema = new Schema({
    senderId: {
        type: String, require: true,
    }, senderName: {
        type: String, require: true,
    }, receiverId: {
        type: String, require: true,
    }, message: {
        type: String, default: "",
    }, file: {
        type: String, default: "",
    }, status: {
        type: String, default: "unsent",
    },
}, {timestamps: true});

module.exports = model("messageSellerAndAdmin", messageSellerAndAdminSchema);

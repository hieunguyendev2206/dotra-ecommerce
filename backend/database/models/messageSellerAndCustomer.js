const {Schema, model} = require("mongoose");

const messageSellerAndCustomerSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId, require: true,
    }, senderName: {
        type: String, require: true,
    }, receiverId: {
        type: Schema.Types.ObjectId, require: true,
    }, message: {
        type: String, default: "",
    }, file: {
        type: String, default: "",
    }, status: {
        type: String, default: "unsent",
    },
}, {timestamps: true});

module.exports = model("messageSellerAndCustomer", messageSellerAndCustomerSchema);

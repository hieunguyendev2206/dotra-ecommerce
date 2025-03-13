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
        type: String,
        enum: ['sent', 'delivered', 'seen'],
        default: 'sent'
    },
    isTyping: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

// Middleware để cập nhật trạng thái tin nhắn
messageSellerAndCustomerSchema.statics.updateMessageStatus = async function(messageId, status) {
    try {
        const result = await this.findByIdAndUpdate(
            messageId,
            { status: status },
            { new: true }
        );
        return result;
    } catch (error) {
        console.error('Error updating message status:', error);
        throw error;
    }
};

module.exports = model("messageSellerAndCustomer", messageSellerAndCustomerSchema);

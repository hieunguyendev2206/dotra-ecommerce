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
messageSellerAndAdminSchema.statics.updateMessageStatus = async function(messageId, status) {
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

module.exports = model("messageSellerAndAdmin", messageSellerAndAdminSchema);

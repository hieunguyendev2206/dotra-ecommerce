exports.get_customer_seller_message = async (req, res) => {
    const { customerId, sellerId } = req.params;
    try {
        const messages = await messageSellerAndCustomer.find({
            $or: [
                {
                    $and: [{
                        senderId: customerId,
                        receiverId: sellerId
                    }]
                },
                {
                    $and: [{
                        senderId: sellerId,
                        receiverId: customerId
                    }]
                }
            ]
        }).sort({ createdAt: 1 });
        
        // Cập nhật trạng thái tin nhắn thành seen khi người nhận xem tin nhắn
        const unreadMessages = messages.filter(msg => 
            msg.receiverId.toString() === req.id && 
            msg.status !== 'seen'
        );
        
        if (unreadMessages.length > 0) {
            await messageSellerAndCustomer.updateMany(
                { _id: { $in: unreadMessages.map(m => m._id) } },
                { $set: { status: 'seen' } }
            );
        }

        res.status(200).json({
            success: true,
            messages
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
} 
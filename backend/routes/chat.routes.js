const chatController = require("../controllers/chat.controllers");
const authMiddlewares = require("../middlewares/auth.middlewares");

const router = require("express").Router();

router.get("/get-customers-chat/:sellerId", authMiddlewares, chatController.get_customers_chat);
router.get("/get-customer-seller-messages/:customerId", authMiddlewares, chatController.get_customer_seller_messages);
router.get("/get-seller-messages", authMiddlewares, chatController.get_seller_messages);
router.get("/get-sellers-chat", authMiddlewares, chatController.get_sellers_chat);
router.get("/get-admin-messages/:receiverId", authMiddlewares, chatController.get_admin_messages);

router.post("/add-chat-friend", chatController.add_chat_friend);
router.post("/send-message", chatController.send_message);
router.post("/send-message-seller-customer", authMiddlewares, chatController.send_message_seller_customer);
router.post("/send-message-seller-admin", authMiddlewares, chatController.send_message_admin_and_seller);

module.exports = router;

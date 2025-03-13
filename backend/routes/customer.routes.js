const customerControllers = require("../controllers/customer.controllers");
const router = require("express").Router();
const authMiddlewares_customer = require("../middlewares/customer.middlewares");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/oauth/google", customerControllers.oauth_google);
router.get("/customer-logout", customerControllers.customer_logout);
router.get("/customer-profile", authMiddlewares_customer, customerControllers.get_customer_profile);

router.post("/customer-register", customerControllers.customer_register);
router.post("/verify-email-customer/:email_token", customerControllers.verify_email);
router.post("/customer-login", customerControllers.customer_login);
router.post("/upload-profile-image",authMiddlewares_customer, upload.single("image"), customerControllers.upload_profile_image);

router.put("/update-profile", authMiddlewares_customer, customerControllers.update_profile);

module.exports = router;

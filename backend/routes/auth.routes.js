const authController = require("../controllers/auth.controllers");
const authMiddlewares = require("../middlewares/auth.middlewares");
const router = require("express").Router();


router.get("/get-user-info", authMiddlewares, authController.get_user_info);
router.get("/logout", authMiddlewares, authController.logout);


router.post("/admin-login", authController.admin_login);
router.post("/seller-register", authController.seller_register);
router.post("/verify-email/:emailToken", authController.verify_email);
router.post("/seller-login", authController.seller_login);
router.post("/upload-profile-image", authMiddlewares, authController.upload_profile_image);
router.post("/add-profile-info", authMiddlewares, authController.add_profile_info);
router.post("/change-password", authMiddlewares, authController.change_password);
router.post("/forgot-password", authMiddlewares, authController.forgot_password);
router.post("/reset-password", authController.reset_password);

module.exports = router;

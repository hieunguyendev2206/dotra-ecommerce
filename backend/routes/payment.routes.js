const paymentControllers = require("../controllers/payment.controllers");
const authMiddlewares = require("../middlewares/auth.middlewares");

const router = require("express").Router();

router.get("/create-stripe-connect-account", authMiddlewares, paymentControllers.create_stripe_connect_account);
router.get("/admin-receive-withdrawal-request", authMiddlewares, paymentControllers.admin_receive_withdrawal_request);
router.get("/seller-request-revenue/:sellerId", authMiddlewares, paymentControllers.seller_request_revenue);
router.get("/vnpay-return", paymentControllers.handle_vnpay_return);

router.post("/confirm-withdrawal-request/:withdrawalRequestId", authMiddlewares, paymentControllers.confirm_withdrawal_request);
router.post("/create-checkout-session", paymentControllers.create_checkout_session);
router.post("/send-request-withdrawal", authMiddlewares, paymentControllers.send_request_withdrawal);
router.post("/create-vnpay-payment", paymentControllers.create_vnpay_payment);
router.post("/create-paypal-order", paymentControllers.create_paypal_order);
router.post("/capture-paypal-order", paymentControllers.capture_paypal_order);
router.post("/create-zalopay-payment", paymentControllers.create_zalopay_payment);
router.post("/capture-zalopay-order", paymentControllers.capture_zalopay_order);
router.post("/create-momo-payment", paymentControllers.create_momo_payment);
router.post("/momo-notify", paymentControllers.capture_momo_payment);



router.put("/activate-stripe-connect-account/:activeCode", authMiddlewares, paymentControllers.activate_stripe_connect_account);
router.put("/update-payment/:orderId", paymentControllers.update_payment);

module.exports = router;

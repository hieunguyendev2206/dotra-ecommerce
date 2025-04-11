const orderControllers = require("../controllers/order.controllers");

const router = require("express").Router();

router.get("/get-orders/:customerId", orderControllers.get_orders_to_customer);
router.get("/get-order-details/:orderId", orderControllers.get_order_details_to_customer);
router.get("/get-orders-to-admin", orderControllers.get_order_to_admin);
router.get("/get-order-details-to-admin/:orderId", orderControllers.get_order_details_to_admin);
router.get("/admin-query-orders", orderControllers.admin_query_orders);
router.get("/get-orders-to-seller/:sellerId", orderControllers.get_orders_to_seller);
router.get("/get-order-details-to-seller/:orderId", orderControllers.get_order_details_to_seller);
router.get("/seller-query-orders/:sellerId", orderControllers.seller_query_orders);
router.get("/check-purchase/:productId", orderControllers.check_purchase);

router.post("/place-order", orderControllers.place_order);

router.put("/admin-change-status-order", orderControllers.admin_change_status_order);
router.put("/seller-change-status-order", orderControllers.seller_change_status_order);

module.exports = router;

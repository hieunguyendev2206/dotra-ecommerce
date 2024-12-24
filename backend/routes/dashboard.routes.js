const dashboardControllers = require("../controllers/dashboard.controllers");
const authMiddlewares = require("../middlewares/auth.middlewares");

const router = require("express").Router();

router.get("/get-dashboard-data/:customerId", dashboardControllers.get_dashboard_data);
router.get("/get-admin-dashboard-data", authMiddlewares, dashboardControllers.get_admin_dashboard_data);
router.get("/get-seller-dashboard-data", authMiddlewares, dashboardControllers.get_seller_dashboard_data);
router.get("/get-data-on-chart", authMiddlewares, dashboardControllers.get_data_on_chart);
router.get("/get-seller-chart-data", authMiddlewares, dashboardControllers.get_seller_chart_data);

module.exports = router;

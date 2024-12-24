const couponsController = require("../controllers/coupons.controllers");
const authMiddlewares = require("../middlewares/auth.middlewares");

const router = require("express").Router();

router.get("/get-coupons", authMiddlewares, couponsController.get_coupons);
router.get("/get-coupon/:couponId", authMiddlewares, couponsController.get_coupon);

router.post("/add-coupons", authMiddlewares, couponsController.add_coupons);

router.put("/update-coupons", authMiddlewares, couponsController.update_coupons);

router.delete("/delete-coupons/:couponId", authMiddlewares, couponsController.delete_coupons);

module.exports = router;

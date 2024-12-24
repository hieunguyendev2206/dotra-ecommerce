const router = require("express").Router();
const cartControllers = require("../controllers/cart.controllers");

router.get("/get-cart/:customerId", cartControllers.get_cart);

router.post("/add-to-cart", cartControllers.add_to_cart);
router.post("/apply-coupons", cartControllers.apply_coupons);

router.put("/increase-quantity/:cartId", cartControllers.increase_quantity);
router.put("/decrease-quantity/:cartId", cartControllers.decrease_quantity);

router.delete("/delete-product-cart/:cartId", cartControllers.delete_product_cart);

module.exports = router;

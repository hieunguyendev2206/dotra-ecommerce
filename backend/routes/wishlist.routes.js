const wishlistControllers = require("../controllers/wishlist.controllers");
const router = require("express").Router();

router.get("/get-wishlist/:customerId", wishlistControllers.get_wishlist);

router.post("/add-to-wishlist", wishlistControllers.add_to_wishlist);

router.delete("/delete-wishlist/:wishlistId", wishlistControllers.delete_wishlist);

module.exports = router;

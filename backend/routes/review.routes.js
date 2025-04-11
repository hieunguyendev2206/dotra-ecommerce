const reviewControllers = require("../controllers/review.controllers");
const authMiddlewares = require("../middlewares/auth.middlewares");
const router = require("express").Router();

router.get("/get-review/:productId", reviewControllers.get_review);
router.get("/get-review-seller", authMiddlewares, reviewControllers.get_review_seller);
router.get("/get-review-by-id/:reviewId", reviewControllers.get_review_by_id);
router.get("/get-reply-review", reviewControllers.get_reply_review);
router.get("/shop/:shopId/reviews", reviewControllers.get_shop_reviews_with_reply);

router.post("/add-review", reviewControllers.add_review);
router.post("/reply-review", authMiddlewares, reviewControllers.reply_review);

module.exports = router;

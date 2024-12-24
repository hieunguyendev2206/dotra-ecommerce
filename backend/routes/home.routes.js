const homeControllers = require("../controllers/home.controllers");
const router = require("express").Router();

router.get("/get-categories", homeControllers.get_categories);
router.get("/get-feature-products", homeControllers.get_feature_products);
router.get("/query-products", homeControllers.query_products);
router.get("/get-product-details/by-slug/:slug", homeControllers.get_product_by_slug);
router.get("/get-product-details/:productId", homeControllers.get_product_details);
router.get("/search-products", homeControllers.search_product);

module.exports = router;

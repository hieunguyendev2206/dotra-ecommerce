const productControllers = require("../controllers/product.controllers");
const authMiddlewares = require("../middlewares/auth.middlewares");
const router = require("express").Router();

router.get("/get-products", authMiddlewares, productControllers.get_products);
router.get("/get-product/:productId", authMiddlewares, productControllers.get_product);
router.get("/shop/:shopId/products", productControllers.get_shop_products);


router.post("/add-product", authMiddlewares, productControllers.add_product);

router.put("/update-product", authMiddlewares, productControllers.update_product);
router.put("/update-product-image", authMiddlewares, productControllers.update_product_image);

router.delete("/delete-product/:productIdDelete", authMiddlewares, productControllers.delete_product);

module.exports = router;

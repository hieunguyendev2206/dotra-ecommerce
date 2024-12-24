const categoryControllers = require("../controllers/category.controllers");
const authMiddlewares = require("../middlewares/auth.middlewares");
const router = require("express").Router();

router.get("/get-categories", authMiddlewares, categoryControllers.get_categories);

router.post("/add-category", authMiddlewares, categoryControllers.add_category);

module.exports = router;

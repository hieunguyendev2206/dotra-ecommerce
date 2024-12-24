const express = require("express");
const blogController = require("../controllers/blog.controllers");

const router = express.Router();

router.post("/create", blogController.createBlog);
router.get("/", blogController.getBlogs);
router.get("/:blogId", blogController.getBlog);
router.get("/slug/:slug", blogController.getBlogBySlug);
router.put("/:blogId", blogController.updateBlog);
router.delete("/:blogId", blogController.deleteBlog);

module.exports = router;

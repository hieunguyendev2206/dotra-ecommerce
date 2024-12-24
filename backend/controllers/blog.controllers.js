const Blog = require("../database/models/blog.models");
const response = require("../utils/response");
const httpStatusCode = require("../config/httpStatusCode");

class BlogController {
    // Hàm chuyển đổi title thành slug
    createSlug(title) {
        return title
            .toLowerCase() // Chuyển thành chữ thường
            .replace(/[^a-z0-9]+/g, '-') // Thay thế các ký tự không phải chữ hoặc số bằng dấu '-'
            .replace(/(^-|-$)/g, ''); // Xóa dấu '-' ở đầu và cuối chuỗi
    }

    // Tạo bài viết
    async createBlog(req, res) {
        const { title, content, author } = req.body;
        const slug = this.createSlug(title);
        try {
            const newBlog = await Blog.create({ title, content, author, slug });
            response(res, httpStatusCode.Created, { message: "Bài viết đã được tạo thành công.", data: newBlog });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, { message: error.message });
        }
    }

    // Cập nhật bài viết
    async updateBlog(req, res) {
        const { blogId } = req.params;
        const { title, content } = req.body;
        const updatedFields = { content, updatedAt: new Date() };

        if (title) {
            updatedFields.title = title;
            updatedFields.slug = this.createSlug(title);
        }

        try {
            const updatedBlog = await Blog.findByIdAndUpdate(blogId, updatedFields, { new: true });
            response(res, httpStatusCode.Ok, { message: "Bài viết đã được cập nhật.", data: updatedBlog });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, { message: error.message });
        }
    }

    async getBlogs(req, res) {
        try {
            const blogs = await Blog.find().sort({ createdAt: -1 });
            response(res, httpStatusCode.Ok, { data: blogs });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, { message: error.message });
        }
    }

    async getBlogBySlug(req, res) {
        const { slug } = req.params;
        try {
            const blog = await Blog.findOne({ slug });
            if (!blog) {
                return response(res, httpStatusCode.NotFound, { message: "Không tìm thấy bài viết." });
            }
            response(res, httpStatusCode.Ok, { data: blog });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, { message: error.message });
        }
    }



    async getBlog(req, res) {
        const { blogId } = req.params;
        try {
            const blog = await Blog.findById(blogId);
            response(res, httpStatusCode.Ok, { data: blog });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, { message: error.message });
        }
    }

    async deleteBlog(req, res) {
        const { blogId } = req.params;
        try {
            await Blog.findByIdAndDelete(blogId);
            response(res, httpStatusCode.Ok, { message: "Bài viết đã được xóa." });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, { message: error.message });
        }
    }
}

module.exports = new BlogController();

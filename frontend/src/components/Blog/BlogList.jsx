// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../../store/reducers/blog.reducers";
import { Link } from "react-router-dom";
import Header from "../../layouts/Header/Header.jsx";
import Footer from "../../layouts/Footer/Footer.jsx";

const BlogList = () => {
    const dispatch = useDispatch();
    const { blogs, loading } = useSelector((state) => state.blog);

    useEffect(() => {
        dispatch(fetchBlogs());
    }, [dispatch]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Header/>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-center mb-8">Danh sách bài viết</h1>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <div
                            key={blog._id}
                            className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <Link to={`/blog/${blog.slug}`}>
                                <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                                    {blog.title}
                                </h2>
                            </Link>
                            <p className="text-sm text-gray-600 mt-2">
                                {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                            </p>
                            <p className="text-gray-800 mt-4 line-clamp-3">
                                {blog.content.substring(0, 100)}...
                            </p>
                            <Link
                                to={`/blog/${blog.slug}`}
                                className="text-blue-500 hover:underline mt-4 block"
                            >
                                Đọc thêm
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default BlogList;

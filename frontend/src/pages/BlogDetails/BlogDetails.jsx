import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchBlogBySlug } from "../../store/reducers/blog.reducers";

const BlogDetails = () => {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const { blogDetails } = useSelector((state) => state.blog);

    useEffect(() => {
        dispatch(fetchBlogBySlug(slug));
    }, [dispatch, slug]);

    if (!blogDetails) return <p>Loading...</p>;

    return (
        <div>
            <h1>{blogDetails.title}</h1>
            <p>{blogDetails.content}</p>
        </div>
    );
};

export default BlogDetails;

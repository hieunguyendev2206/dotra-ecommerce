import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../../utils/formate";
import RatingTemp from "../RatingTemp";
import Pagination from "../Pagination/Pagination";
import DOMPurify from "dompurify";

const Review = ({ reviews, totalReview }) => {
    const [pageNumber, setPageNumber] = useState(1);
    const [parPage] = useState(5);

    // Map phản hồi từ người bán dựa trên reviewId
    const sellerReplyMap = useMemo(() => {
        const map = {};
        reviews.forEach((review) => {
            if (review.reply.length > 0) {
                map[review._id] = review.reply[0];
            }
        });
        return map;
    }, [reviews]);

    return (
        <div className="mt-8">
            <h2 className="text-slate-600 font-bold text-lg mb-4">
                Nhận xét về sản phẩm ({totalReview})
            </h2>

            <div className="flex flex-col gap-8">
                {reviews.map((r) => (
                    <div key={r._id} className="flex flex-col gap-1 border-b pb-4">
                        {/* Thông tin đánh giá */}
                        <div className="flex justify-between items-center">
                            <div className="flex gap-1 text-base">
                                <RatingTemp ratingTemp={r.rating} />
                            </div>
                            <span className="text-sm text-gray-500">
                                {formatDate(r.createdAt)}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <img
                                className="w-[25px] h-[25px] rounded-full"
                                src={r.avatar}
                                alt="Avatar"
                            />
                            <span className="text-gray-600 text-sm font-medium">
                                {r.customer_name}
                            </span>
                        </div>
                        <p
                            className="text-slate-600 text-sm"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(r.review),
                            }}
                        />

                        {/* Phản hồi từ người bán */}
                        {sellerReplyMap[r._id] && (
                            <div className="ml-8 mt-3 bg-gray-100 p-4 rounded-md">
                                <div className="flex items-center space-x-2">
                                    <img
                                        className="w-[25px] h-[25px] rounded-full"
                                        src={sellerReplyMap[r._id].seller_avatar}
                                        alt="Seller Avatar"
                                    />
                                    <span className="text-blue-600 text-sm font-semibold">
                                        {sellerReplyMap[r._id].shop_name} (Người bán)
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    {sellerReplyMap[r._id].reply}
                                </p>
                                <span className="text-xs text-gray-400">
                                    {formatDate(sellerReplyMap[r._id].createdAt)}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalReview > parPage && (
                <div className="w-full flex justify-end mt-4">
                    <Pagination
                        currentPageNumber={pageNumber}
                        setCurrentPageNumber={setPageNumber}
                        totalItem={totalReview}
                        parPage={parPage}
                        showItem={Math.floor(totalReview / parPage)}
                    />
                </div>
            )}
        </div>
    );
};

export default Review;

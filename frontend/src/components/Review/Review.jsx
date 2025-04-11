/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {Link} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Ratings from "react-rating";
import icons from "../../assets/icons";
import Rating from "../Rating";
import DOMPurify from "dompurify";
import RatingTemp from "../RatingTemp";
import Pagination from "../Pagination/Pagination";
import TextEditor from "../TextEditor/TextEditor";
import {add_review, get_reply_review, get_review, message_clear,} from "../../store/reducers/rewiew.reducers";
import {toast} from "react-toastify";
import {formatDate} from "../../utils/formate";
import {get_product_details} from "../../store/reducers/home.reducers";

const Review = ({product}) => {
    const {BiSolidCheckShield, AiFillStar, CiStar} = icons;
    const [pageNumber, setPageNumber] = useState(1);
    const [parPage, setParPage] = useState(2);
    const [review, setReview] = useState("");
    const [ratingState, setRatingState] = useState("");
    const dispatch = useDispatch();
    const {userInfo} = useSelector((state) => state.customer);
    const {
        success_message,
        error_message,
        rating_review,
        reviews,
        sellerReply,
        total_review,
    } = useSelector((state) => state.review);

    const onChange = (event, value) => {
        setReview(value.getData());
    };

    const productId = product._id;

    const handleSubmitReview = (event) => {
        event.preventDefault();
        const data = {
            productId: productId,
            customerId: userInfo.id,
            customer_name: userInfo.name,
            review: review,
            rating: ratingState,
            avatar: userInfo.avatar,
        };
        dispatch(add_review(data));
    };

    useEffect(() => {
        if (success_message) {
            toast.success(success_message);
            dispatch(message_clear());
            dispatch(get_product_details(productId));
            setReview("");
            setRatingState("");
        }
        if (error_message) {
            toast.error(error_message);
            dispatch(message_clear());
        }
    }, [success_message, error_message, dispatch, productId]);

    useEffect(() => {
        if (productId) {
            dispatch(
                get_review({
                    productId: product._id,
                    pageNumber: pageNumber,
                })
            );
        }
    }, [product, pageNumber, productId, dispatch]);

    useEffect(() => {
        dispatch(get_reply_review());
    }, [dispatch]);

    const sellerReplyMap = useMemo(() => {
        const map = {};
        sellerReply.forEach((reply) => {
            map[reply.reviewId] = reply;
        });
        return map;
    }, [sellerReply]);

    return (
        <div className="mt-8 sm:mt-4">
            <div className="flex gap-10 md:flex-col sm:gap-6">
                <div className="flex flex-col gap-2 justify-start items-start py-4 sm:py-2">
                    <div>
                        <span className="text-2xl md:text-xl sm:text-lg font-semibold">{product.rating}</span>
                        <span className="text-xl md:text-lg sm:text-base font-semibold text-slate-600">/5</span>
                    </div>
                    <div className="flex text-md">
                        <Rating rating={product.rating}/>
                    </div>
                    <p className="text-sm text-green-600 font-semibold">
                        {total_review} đánh giá
                    </p>
                </div>
                <div className="flex gap-2 flex-col py-4 sm:py-2">
                    <div className="flex justify-start items-center gap-5 sm:gap-3">
                        <div className="text-md flex gap-1 w-[93px] sm:w-[80px]">
                            <RatingTemp ratingTemp={5}/>
                        </div>
                        <div className="w-[200px] md:w-[150px] sm:w-[120px] h-[10px] bg-slate-200 relative">
                            <div
                                style={{
                                    width: `${Math.floor(
                                        (100 * (rating_review[0]?.sum || 0)) / total_review
                                    )}%`,
                                }}
                                className="h-full bg-[#EDBB0E]"
                            ></div>
                        </div>
                        <p className="text-sm text-slate-600 w-[20%] sm:w-[15%] sm:text-xs">
                            {rating_review[0]?.sum}
                        </p>
                    </div>
                    <div className="flex justify-start items-center gap-5 sm:gap-3">
                        <div className="text-md flex gap-1 w-[93px] sm:w-[80px]">
                            <RatingTemp ratingTemp={4}/>
                        </div>
                        <div className="w-[200px] md:w-[150px] sm:w-[120px] h-[10px] bg-slate-200 relative">
                            <div
                                style={{
                                    width: `${Math.floor(
                                        (100 * (rating_review[1]?.sum || 0)) / total_review
                                    )}%`,
                                }}
                                className="h-full bg-[#EDBB0E]"
                            ></div>
                        </div>
                        <p className="text-sm text-slate-600 w-[20%] sm:w-[15%] sm:text-xs">
                            {rating_review[1]?.sum}
                        </p>
                    </div>
                    <div className="flex justify-start items-center gap-5 sm:gap-3">
                        <div className="text-md flex gap-1 w-[93px] sm:w-[80px]">
                            <RatingTemp ratingTemp={3}/>
                        </div>
                        <div className="w-[200px] md:w-[150px] sm:w-[120px] h-[10px] bg-slate-200 relative">
                            <div
                                style={{
                                    width: `${Math.floor(
                                        (100 * (rating_review[2]?.sum || 0)) / total_review
                                    )}%`,
                                }}
                                className="h-full bg-[#EDBB0E]"
                            ></div>
                        </div>
                        <p className="text-sm text-slate-600 w-[20%] sm:w-[15%] sm:text-xs">
                            {rating_review[2]?.sum}
                        </p>
                    </div>
                    <div className="flex justify-start items-center gap-5 sm:gap-3">
                        <div className="text-md flex gap-1 w-[93px] sm:w-[80px]">
                            <RatingTemp ratingTemp={2}/>
                        </div>
                        <div className="w-[200px] md:w-[150px] sm:w-[120px] h-[10px] bg-slate-200 relative">
                            <div
                                style={{
                                    width: `${Math.floor(
                                        (100 * (rating_review[3]?.sum || 0)) / total_review
                                    )}%`,
                                }}
                                className="h-full bg-[#EDBB0E]"
                            ></div>
                        </div>
                        <p className="text-sm text-slate-600 w-[20%] sm:w-[15%] sm:text-xs">
                            {rating_review[3]?.sum}
                        </p>
                    </div>
                    <div className="flex justify-start items-center gap-5 sm:gap-3">
                        <div className="text-md flex gap-1 w-[93px] sm:w-[80px]">
                            <RatingTemp ratingTemp={1}/>
                        </div>
                        <div className="w-[200px] md:w-[150px] sm:w-[120px] h-[10px] bg-slate-200 relative">
                            <div
                                style={{
                                    width: `${Math.floor(
                                        (100 * (rating_review[4]?.sum || 0)) / total_review
                                    )}%`,
                                }}
                                className="h-full bg-[#EDBB0E]"
                            ></div>
                        </div>
                        <p className="text-sm text-slate-600 w-[20%] sm:w-[15%] sm:text-xs">
                            {rating_review[4]?.sum}
                        </p>
                    </div>
                </div>
            </div>
            <h2 className="text-slate-600 font-bold mt-4 text-lg md:text-base sm:text-sm">
                Nhận xét về sản phẩm ({total_review})
            </h2>
            <div className="flex flex-col gap-8 sm:gap-6 pb-10 pt-4 sm:pt-3">
                {reviews.map((r) => (
                    <div key={r._id} className="flex flex-col gap-1 border-b pb-4 sm:pb-3">
                        <div className="flex justify-between items-center flex-wrap">
                            <div className="flex gap-1 text-base">
                                <RatingTemp ratingTemp={r.rating}/>
                            </div>
                            <span className="text-sm text-gray-500">{formatDate(r.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-2 flex-wrap">
                            <img
                                className="w-[25px] h-[25px] rounded-full"
                                src={r.avatar}
                                alt=""
                            />
                            <span className="text-gray-600 text-sm font-medium">
                                {r.customer_name}
                            </span>
                            <div className="flex items-center">
                                <BiSolidCheckShield className="text-green-500" size={18}/>
                                <span className="text-green-500 text-sm ml-1">Đã mua hàng</span>
                            </div>
                        </div>
                        <p className="flex text-slate-600 text-sm mt-1 flex-wrap">
                            <span className="text-gray-500 mr-1">Bình luận:</span>
                            <div
                                className="text-sm sm:text-xs break-words w-full sm:mt-1"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(r.review),
                                }}
                            />
                        </p>
                        {sellerReplyMap[r._id] && (
                            <div className="flex flex-col gap-1 ml-6 sm:ml-4 mt-3 bg-gray-50 p-3 sm:p-2 rounded-md">
                                <div className="flex justify-between items-center space-x-2 flex-wrap">
                                    <div className="flex space-x-2 items-center">
                                        <img
                                            className="w-[25px] h-[25px] rounded-full"
                                            src={sellerReplyMap[r._id].seller_avatar}
                                            alt=""
                                        />
                                        <span className="text-gray-600 text-sm font-medium">
                                          Shop {sellerReplyMap[r._id].shop_name}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-500">{formatDate(sellerReplyMap[r._id].createdAt)}</span>
                                </div>
                                <p className="flex text-slate-600 text-sm mt-1 flex-wrap">
                                    <span className="text-gray-500 mr-1">Trả lời:</span>
                                    <div
                                        className="text-sm sm:text-xs break-words w-full sm:mt-1"
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(sellerReplyMap[r._id].reply),
                                        }}
                                    />
                                </p>
                            </div>
                        )}
                    </div>
                ))}
                {total_review > parPage && (
                    <div className="w-full flex justify-end mt-4 bottom-4 right-4">
                        <Pagination
                            currentPageNumber={pageNumber}
                            setCurrentPageNumber={setPageNumber}
                            totalItem={total_review}
                            parPage={parPage}
                            showItem={Math.floor(total_review / parPage)}
                        />
                    </div>
                )}
            </div>
            <div>
                {userInfo ? (
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-1 items-center flex-wrap">
                            <span className="font-semibold text-sm">Đánh giá sản phẩm: </span>
                            <Ratings
                                onChange={(e) => setRatingState(e)}
                                initialRating={ratingState}
                                emptySymbol={
                                    <span className="text-slate-600 text-2xl sm:text-xl">
                                        <CiStar/>
                                    </span>
                                }
                                fullSymbol={
                                    <span className="text-[#EDBB0E] text-2xl sm:text-xl">
                                        <AiFillStar/>
                                    </span>
                                }
                            />
                        </div>
                        <form onSubmit={handleSubmitReview}>
                            <TextEditor value={review} onChange={onChange}/>
                            <div className="mt-4 mb-4">
                                <button
                                    type="submit"
                                    className="py-2 px-5 bg-red-500 text-white rounded-md text-sm"
                                >
                                    Gửi đánh giá
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="pb-6">
                        <Link
                            className="py-2 px-4 bg-red-500 text-white rounded-md text-sm"
                            to="/login"
                        >
                            Đăng nhập để đánh giá
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Review;

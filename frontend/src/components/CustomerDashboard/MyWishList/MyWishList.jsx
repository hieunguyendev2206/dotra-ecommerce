/* eslint-disable no-unused-vars */
import {Link} from "react-router-dom";
import {formateCurrency} from "../../../utils/formate";
import {useDispatch, useSelector} from "react-redux";
import Rating from "../../Rating";
import {useEffect} from "react";
import {delete_wishlist, get_wishlist, message_clear_delete_wishlist,} from "../../../store/reducers/wishlist.reducers";
import icons from "../../../assets/icons";
import {toast} from "react-toastify";

const MyWishList = () => {
    const {IoMdClose} = icons;
    const dispatch = useDispatch();
    const {
        wishlist,
        delete_wishlist_success_message,
        delete_wishlist_error_message,
    } = useSelector((state) => state.wishlist);
    const {userInfo} = useSelector((state) => state.customer);

    useEffect(() => {
        if (userInfo) {
            dispatch(get_wishlist(userInfo.id));
        }
    }, [dispatch, userInfo]);

    const handleDeleteWishlist = (wishlistId, event) => {
        event.preventDefault();
        dispatch(delete_wishlist(wishlistId));
    };

    useEffect(() => {
        if (delete_wishlist_success_message) {
            toast.success(delete_wishlist_success_message);
            dispatch(message_clear_delete_wishlist());
        }
        if (delete_wishlist_error_message) {
            toast.error(delete_wishlist_error_message);
            dispatch(message_clear_delete_wishlist());
        }
    }, [delete_wishlist_success_message, delete_wishlist_error_message, dispatch]);

    return (
        <div className="w-full grid grid-cols-5 md-lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5">
            {wishlist.map((w) => (
                <Link
                    to={`/home/product-details/${w.slug}`}
                    key={w._id}
                    className="group border-2 transition-all bg-white duration-500 hover:shadow-md hover:-mt-3 rounded-lg"
                >
                    <div className="relative overflow-hidden">
                        {w.discount ? (
                            <div
                                className="flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2">
                                - {w.discount}%
                            </div>
                        ) : (
                            ""
                        )}
                        <div
                            onClick={(event) => handleDeleteWishlist(w._id, event)}
                            className="flex justify-center items-center cursor-pointer absolute text-white w-[25px] h-[25px] rounded-full bg-gray-600 font-semibold text-xs right-2 -top-7 group-hover:top-2 transition-all duration-200"
                        >
                            <IoMdClose size={18}/>
                        </div>
                        <img
                            className="w-full h-full object-contain rounded-t-md"
                            style={{aspectRatio: "1 / 1", objectPosition: "center"}}
                            src={w.image}
                            alt=""
                        />
                    </div>
                    <div className="py-3 text-slate-600 px-2 text-sm">
                        <h2 className="font-bold text-blue-500">{w.brand_name}.</h2>
                        <h2 className="line-clamp-2">{w.product_name}</h2>
                        <div className="flex justify-start items-center gap-2 m-[2px]">
                            {w.discount > 0 ? (
                                <>
                                    <span className="font-bold line-through">
                                        {formateCurrency(w.price)}
                                    </span>
                                    <span className="text-base font-bold text-red-500">
                                        {formateCurrency(w.price - (w.price * w.discount) / 100)}
                                    </span>
                                </>
                            ) : (
                                <span className="text-base font-bold text-red-500">
                                    {formateCurrency(w.price)}
                                </span>
                            )}
                        </div>

                        <div className="flex justify-center items-center">
                            <Rating rating={w.rating}/>
                            <h2 className="font-medium text-green-600 ml-10">
                                Số lượng: {w.quantity}
                            </h2>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default MyWishList;

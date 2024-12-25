/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {Link} from "react-router-dom";
import {formateCurrency} from "../../utils/formate";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {add_to_cart, message_clear} from "../../store/reducers/cart.reducers";
import {toast} from "react-toastify";
import icons from "../../assets/icons";
import Rating from "../Rating";
import {add_to_wishlist, message_clear_add_wishlist,} from "../../store/reducers/wishlist.reducers";

const FeatureProduct = ({products}) => {
    const {AiFillHeart, FaCartShopping, FaEye} = icons;
    const dispatch = useDispatch();
    const {userInfo} = useSelector((state) => state.customer);
    const {success_message, error_message} = useSelector((state) => state.cart);
    const {add_wishlist_success_message, add_wishlist_error_message} =
        useSelector((state) => state.wishlist);

    const handleAddToCart = (productId) => {
        if (userInfo) {
            dispatch(
                add_to_cart({
                    customerId: userInfo.id,
                    productId: productId,
                    quantity: 1,
                })
            );
        } else {
            toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
        }
    };

    const handleAddToWishlist = (product) => {
        if (userInfo) {
            dispatch(
                add_to_wishlist({
                    customerId: userInfo.id,
                    productId: product._id,
                    product_name: product.product_name,
                    brand_name: product.brand_name,
                    price: product.price,
                    quantity: product.quantity,
                    discount: product.discount,
                    image: product.images[0],
                    slug: product.slug,
                    rating: product.rating,
                })
            );
        } else {
            toast.error("Bạn cần đăng nhập để thêm sản phẩm vào danh sách yêu thích");
        }
    };

    useEffect(() => {
        if (success_message) {
            toast.success(success_message);
            dispatch(message_clear());
        }
        if (error_message) {
            toast.error(error_message);
            dispatch(message_clear());
        }
    }, [success_message, error_message, dispatch]);

    useEffect(() => {
        if (add_wishlist_success_message) {
            toast.success(add_wishlist_success_message);
            dispatch(message_clear_add_wishlist());
        }
        if (add_wishlist_error_message) {
            toast.error(add_wishlist_error_message);
            dispatch(message_clear_add_wishlist());
        }
    }, [add_wishlist_success_message, add_wishlist_error_message, dispatch]);

    return (
        <div className="w-[85%] flex flex-wrap mx-auto">
            <div className="w-full">
                <div
                    className="text-center flex justify-center items-center flex-col text-2xl uppercase text-slate-600 font-mono relative pb-[45px]">
                    <h2>Sản Phẩm Nổi Bật</h2>
                    <div className="w-[100px] h-[2px] bg-red-500 mt-4"></div>
                </div>
            </div>
            <div className="w-full grid grid-cols-5 md-lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5">
                {products.map((p) => (
                    <div
                        key={p._id}
                        className="border-2 group transition-all duration-500 hover:shadow-md hover:-mt-3 rounded-lg"
                    >
                        <div className="relative overflow-hidden">
                            {p.discount ? (
                                <div
                                    className="flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs right-2 top-2">
                                    - {p.discount}%
                                </div>
                            ) : (
                                ""
                            )}
                            <img
                                className="w-full h-full object-contain rounded-t-md p-2"
                                style={{aspectRatio: "1 / 1", objectPosition: "center"}}
                                src={p.images[0]}
                                alt=""
                            />
                            <ul className="flex transition-all duration-700 -bottom-10 justify-center items-center gap-2 absolute w-full group-hover:bottom-3">
                                <li
                                    onClick={() => handleAddToWishlist(p)}
                                    className="w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-red-500 hover:text-white hover:rotate-[720deg] transition-all"
                                >
                                    <AiFillHeart/>
                                </li>
                                <Link
                                    to={`/home/product-details/${p.slug}`}
                                    className="w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-red-500 hover:text-white hover:rotate-[720deg] transition-all"
                                >
                                    <FaEye/>
                                </Link>
                                <li
                                    onClick={() => handleAddToCart(p._id)}
                                    className="w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-red-500 hover:text-white hover:rotate-[720deg] transition-all"
                                >
                                    <FaCartShopping/>
                                </li>
                            </ul>
                        </div>
                        <div className="py-3 text-slate-600 px-2 text-sm">
                            <h2 className="font-bold text-blue-500">{p.brand_name}.</h2>
                            <h2 className="line-clamp-2">{p.product_name}</h2>
                            <div className="flex justify-start items-center gap-2 m-[2px]">
                                {p.discount > 0 ? (
                                    <>
                                        <span className="font-bold line-through">
                                            {formateCurrency(p.price)}
                                        </span>
                                        <span className="text-base font-bold text-red-500">
                                            {formateCurrency(p.price - (p.price * p.discount) / 100)}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-base font-bold">
                                        {formateCurrency(p.price)}
                                    </span>
                                )}
                            </div>
                            <div className="flex justify-center items-center">
                                <Rating rating={p.rating}/>
                                <h2 className="font-medium text-green-600 ml-10">
                                    Số lượng: {p.quantity}
                                </h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeatureProduct;

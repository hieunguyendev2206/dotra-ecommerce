/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {Link} from "react-router-dom";
import {formateCurrency} from "../../utils/formate";
import {useDispatch, useSelector} from "react-redux";
import {add_to_cart, message_clear} from "../../store/reducers/cart.reducers";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import Rating from "../Rating";
import icons from "../../assets/icons";
import {add_to_wishlist, message_clear_add_wishlist,} from "../../store/reducers/wishlist.reducers";

const ShopProduct = ({styles, products}) => {
    const {AiFillHeart, FaCartShopping, FaEye} = icons;
    const dispatch = useDispatch();
    const {userInfo} = useSelector((state) => state.customer);
    const {success_message, error_message} = useSelector((state) => state.cart);
    const {add_wishlist_success_message, add_wishlist_error_message} =
        useSelector((state) => state.wishlist);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng")
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
            toast.error("Bạn cần đăng nhập để thêm sản phẩm yêu thích")
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
        <div
            className={`w-full grid ${
                styles === "grid"
                    ? "grid-cols-4 md-lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1"
                    : "grid-cols-1 md-lg:grid-cols-2 md:grid-cols-2"
            } gap-3`}
        >
            {products.map((p) => (
                <div
                    key={p._id}
                    className={`flex transition-all duration-1000 hover:shadow-md hover:-translate-y-3 border-2 ${
                        styles === "grid"
                            ? "flex-col justify-start items-start"
                            : "justify-start items-center md-lg:flex-col md-lg:justify-start md-lg:items-start"
                    } w-full gap-4 bg-white p-1 rounded-md`}
                >
                    <div
                        className={
                            styles === "grid"
                                ? "w-full relative group h-[180px] md:h-[270px] xs:h-[170px] overflow-hidden"
                                : "md-lg:w-full relative group h-[210px] md:h-[270px] overflow-hidden"
                        }
                    >
                        <img
                            className="w-full h-full object-contain rounded-t-md"
                            style={{aspectRatio: "1 / 1", objectPosition: "center"}}
                            src={p.images[0] || "https://via.placeholder.com/300"}
                            alt={p.product_name}
                            loading="lazy"
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
                        <h2 className="font-bold text-blue-500 text-sm md:text-base">{p.brand_name}.</h2>
                        <h2 className="line-clamp-2 text-sm md:text-base">{p.product_name}</h2>
                        <div className="flex justify-start items-center gap-2 m-[2px]">
                            <span className="font-bold line-through text-xs md:text-sm">
                                {formateCurrency(p.price)}
                            </span>
                            <span className="text-sm md:text-base font-bold text-red-500">
                                {formateCurrency(p.price - (p.price * p.discount) / 100)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex-1">
                                <Rating rating={p.rating}/>
                            </div>
                            <h2 className={`font-medium text-xs md:text-sm ${
                                p.quantity === 0
                                    ? "text-red-500"
                                    : p.quantity < 10
                                        ? "text-orange-500"
                                        : "text-green-600"
                            }`}>
                                {p.quantity === 0
                                    ? "Đã bán hết"
                                    : isMobile
                                        ? (p.quantity < 10 ? "Sắp hết" : "Còn hàng")
                                        : `Số lượng: ${p.quantity} ${p.quantity < 10 ? ' (Sắp hết)' : ' '}`}
                            </h2>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ShopProduct;

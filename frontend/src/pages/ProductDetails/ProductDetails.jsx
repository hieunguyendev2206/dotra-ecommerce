/* eslint-disable no-unused-vars */
import {useEffect, useState} from "react";
import {Pagination} from "swiper/modules";
import {Link, useParams} from "react-router-dom";
import {Swiper, SwiperSlide} from "swiper/react";
import {useDispatch, useSelector} from "react-redux";
import {get_product_details_by_slug} from "../../store/reducers/home.reducers";
import {formateCurrency} from "../../utils/formate";
import DOMPurify from "dompurify";
import Carousel from "react-multi-carousel";
import Rating from "../../components/Rating";
import Footer from "../../layouts/Footer";
import Header from "../../layouts/Header";
import icons from "../../assets/icons";
import "swiper/css";
import "swiper/css/pagination";
import path from "../../constants/path";
import Review from "../../components/Review";
import {add_to_cart, message_clear} from "../../store/reducers/cart.reducers";
import {add_to_wishlist, message_clear_add_wishlist,} from "../../store/reducers/wishlist.reducers";
import {toast} from "react-toastify";
import {add_review} from "../../store/reducers/rewiew.reducers.js";
import {FaEye} from "react-icons/fa";
import {FaCartShopping} from "react-icons/fa6";
import {ClipLoader} from "react-spinners";

const ProductDetails = () => {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const {
        MdOutlineKeyboardArrowRight, AiFillHeart, FaFacebook, GrInstagram, BsTwitter, BsGithub,
    } = icons;
    const {productId} = useParams();
    const [state, setState] = useState("reviews");
    const {userInfo} = useSelector((state) => state.customer);
    const {orders} = useSelector((state) => state.order);
    const [reviewContent, setReviewContent] = useState("");

    const {product_details, related_products, more_products} = useSelector((state) => state.home);
    const {success_message, error_message} = useSelector((state) => state.cart);
    const {add_wishlist_success_message, add_wishlist_error_message} = useSelector((state) => state.wishlist);

    const {total_review} = useSelector((state) => state.review);

    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState("");
    const [buyCount, setBuyCount] = useState(1);

    useEffect(() => {
        if (slug) {
            setLoading(true); // SỬA: Bắt đầu trạng thái loading
            dispatch(get_product_details_by_slug(slug))
                .unwrap()
                .then(() => setLoading(false)) // SỬA: Dừng loading khi thành công
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [dispatch, slug]);



    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        console.log("Product details from Redux:", product_details);
    }, [product_details]);


    // useEffect(() => {
    //     if (productId) {
    //         dispatch(get_product_details(productId));
    //     }
    // }, [dispatch, productId]);

    const hasPurchasedProduct = () => {
        if (orders && orders.length > 0) {
            return orders.some(order => order.products.some(product => product.productId === productId));
        }
        return false;
    };

    const handleReviewSubmit = () => {
        if (!userInfo) {
            toast.error("Bạn cần đăng nhập để gửi đánh giá.");
            return;
        }

        if (!hasPurchasedProduct()) {
            toast.error("Bạn cần mua sản phẩm này trước khi đánh giá.");
            return;
        }

        // Nếu đã mua cho phép gửi đánh giá
        dispatch(add_review({
            customerId: userInfo.id,
            productId: productId,
            reviewContent: reviewContent
        }));

        setReviewContent("");
    };

    const inc_quantity = () => {
        if (buyCount < product_details?.quantity) {
            setBuyCount(buyCount + 1);
        } else {
            toast.error("Số lượng sản phẩm không đủ");
        }
    };

    const dec_quantity = () => {
        if (buyCount > 1) {
            setBuyCount(buyCount - 1);
        } else {
            toast.error("Số lượng sản phẩm không hợp lệ");
        }
    };

    const handleAddToCart = (productId) => {
        if (userInfo) {
            if (!productId) {
                toast.error("Thông tin sản phẩm không hợp lệ.");
                return;
            }
            dispatch(add_to_cart({
                customerId: userInfo.id, productId: productId, quantity: buyCount,
            }));
        } else {
            toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
        }
    };


    const handleBuyProduct = (productId) => {
        if (userInfo) {
            dispatch(add_to_cart({
                customerId: userInfo.id, productId: productId, quantity: buyCount,
            }));
        } else {
            toast.error("Bạn cần đăng nhập để mua sản phẩm")
        }
    };

    const handleAddToWishlist = (product) => {
        if (userInfo) {
            if (!product?._id) {
                toast.error("Thông tin sản phẩm không hợp lệ.");
                return;
            }
            dispatch(add_to_wishlist({
                customerId: userInfo.id,
                productId: product._id,
                product_name: product.product_name,
                brand_name: product.brand_name,
                price: product.price,
                quantity: product.quantity,
                discount: product.discount,
                image: product.images?.[0],
                slug: product.slug,
                rating: product.rating,
            }));
        } else {
            toast.error("Bạn cần đăng nhập để thêm sản yêu thích");
        }
    };


    // eslint-disable-next-line react-hooks/rules-of-hooks
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

    // eslint-disable-next-line react-hooks/rules-of-hooks
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

    // if (loading) {
    //     return (
    //         <div className="flex items-center justify-center h-screen">
    //             <ClipLoader size={50} color={"#FF4500"} loading={loading} />
    //             <p className="ml-4 text-xl font-semibold text-orange-500">Đang tải thông tin sản phẩm...</p>
    //         </div>
    //     );
    // }

    if (!product_details || Object.keys(product_details).length === 0) {
        return <div>Không tìm thấy thông tin sản phẩm.</div>;
    }

    const responsive = {
        superLargeDesktop: {
            breakpoint: {max: 4000, min: 3000}, items: 5,
        }, desktop: {
            breakpoint: {max: 3000, min: 1024}, items: 4,
        }, tablet: {
            breakpoint: {max: 1024, min: 464}, items: 4,
        }, mdtablet: {
            breakpoint: {max: 991, min: 464}, items: 4,
        }, mobile: {
            breakpoint: {max: 768, min: 0}, items: 3,
        }, smmobile: {
            breakpoint: {max: 640, min: 0}, items: 2,
        }, xsmobile: {
            breakpoint: {max: 440, min: 0}, items: 1,
        },
    };

    return (
        <div className="bg-white">
            <Header/>
            <div
                className='bg-[url("/src/assets/banners/5.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
                <div className="absolute left-0 top-0 w-full h-full bg-[#2422228a]">
                    <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto">
                        <div className="flex flex-col justify-center gap-1 items-center h-full w-full text-white">
                            <h2 className="text-3xl font-bold">Dotra.</h2>
                            <div className="flex justify-center items-center gap-2 text-2xl w-full">
                                <Link to={path.home}>Trang chủ</Link>
                                <span className="pt-2">
                                    <MdOutlineKeyboardArrowRight/>
                                </span>
                                <span>Chi tiết sản phẩm</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-100 py-5 mb-5">
                <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto">
                    <div className="flex justify-start items-center text-md text-slate-600 w-full">
                        <Link to={path.home}>Trang chủ</Link>
                        <span className="pt-1"><MdOutlineKeyboardArrowRight/></span>
                        <Link to="/">{product_details.category_name}</Link>
                        <span className="pt-1">
                            <MdOutlineKeyboardArrowRight/>
                        </span>
                        <span>{product_details.product_name}</span>
                    </div>
                </div>
            </div>
            <section>
                <div className="w-[70%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto pb-16">
                    <div className="grid grid-cols-2 md-lg:grid-cols-1 gap-8">
                        <div>
                            <div className="p-5 border h-[450px] w-full">
                                <img
                                    className="h-[400px] w-[400px]"
                                    src={image ? image : product_details.images?.[0]}
                                    alt="Hình ảnh chi tiết sản phẩm"
                                />
                            </div>
                            <div className="py-3 w-full">
                                {product_details.images && (
                                    <Carousel
                                        autoPlay={true}
                                        infinite={true}
                                        responsive={responsive}
                                        transitionDuration={500}
                                    >
                                        {product_details.images.map((img, index) => {
                                            return (
                                                <div key={index} onClick={() => setImage(img)}>
                                                    <img
                                                        className="w-full h-[200px] object-contain rounded-t-md"
                                                        style={{aspectRatio: "1 / 1", objectPosition: "center"}}
                                                        src={img}
                                                        alt="Hình ảnh chi tiết sản phẩm"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </Carousel>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-5">
                            <div className="text-lg font-bold">
                                <h2>{product_details.product_name}</h2>
                            </div>
                            <div className="flex justify-start items-center gap-4">
                                <div className="flex">
                                    <Rating rating={product_details.rating}/>
                                </div>
                                <span className="text-green-500">
                                    ({total_review} đánh giá)
                                </span>
                            </div>
                            <span className="text-blue-500 font-semibold">
                                Thương hiệu: {product_details.brand_name}
                            </span>
                            <div className="font-medium flex gap-3">
                                {product_details.discount ? (
                                    <>
                                        <span>Giá bán: </span>
                                        <h2 className="line-through">
                                            {formateCurrency(product_details.price)}
                                        </h2>
                                        <h2 className="text-lg text-red-500 font-medium">
                                            {formateCurrency(product_details.price - (product_details.price * product_details.discount) / 100)}
                                        </h2>
                                        <span className="text-red-500">
                                            (Giảm {product_details.discount}%)
                                        </span>
                                    </>
                                    ) : (
                                        <>
                                            <span>Giá bán: </span>
                                            <h2 className="text-lg text-red-500 font-medium">
                                                {formateCurrency(product_details.price)}
                                            </h2>
                                        </>
                                    )
                                }
                            </div>
                            <div className="flex gap-3 pb-10 border-b">
                                {product_details.quantity ? (<>
                                    <div
                                        className="flex bg-slate-200 h-[45px] rounded-md justify-center items-center">
                                        <div
                                            onClick={dec_quantity}
                                            className="px-5 cursor-pointer text-3xl"
                                        >
                                            -
                                        </div>
                                        <div className="px-5 text-base">{buyCount}</div>
                                        <div
                                            onClick={inc_quantity}
                                            className="px-5 cursor-pointer text-2xl"
                                        >
                                            +
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => handleAddToCart(product_details._id)}
                                            className="px-6 py-3 h-[45px] rounded-md cursor-pointer hover:shadow-lg text-xs hover:shadow-purple-500/40 bg-red-500 text-white"
                                        >
                                            Thêm vào giỏ hàng
                                        </button>
                                    </div>
                                </>) : ("")}
                                <div
                                    onClick={() => handleAddToWishlist(product_details)}
                                    className="h-[45px] w-[45px] rounded-md flex justify-center items-center cursor-pointer hover:shadow-lg hover:shadow-red-500/40 bg-red-500 text-white"
                                >
                                    <AiFillHeart/>
                                </div>
                            </div>
                            <div className="flex py-5 gap-5">
                                <div className="w-[150px] text-black font-bold flex flex-col gap-5">
                                    <span>Số lượng: </span>
                                    <span>Chia sẻ: </span>
                                </div>
                                <div className="flex flex-col gap-5">
                                      <span
                                          className={`text-${product_details.quantity ? "green" : "red"}-500 font-semibold`}
                                      >
                                        {product_details.quantity ? `(${product_details.quantity}) sản phẩm` : "Hết hàng"}
                                      </span>
                                    <ul className="flex justify-start items-center gap-3">
                                        <li>
                                            <a
                                                className="w-[38px] h-[38px] hover:text-white flex justify-center items-center bg-indigo-500 rounded-full text-white"
                                                href="#"
                                            >
                                                <FaFacebook/>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="w-[38px] h-[38px] hover:text-white flex justify-center items-center bg-[#E1306C] rounded-full text-white"
                                                href="#"
                                            >
                                                <GrInstagram/>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="w-[38px] h-[38px] hover:text-white flex justify-center items-center bg-[#1D9BF0] rounded-full text-white"
                                                href="#"
                                            >
                                                <BsTwitter/>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="w-[38px] h-[38px] hover:text-white flex justify-center items-center bg-black rounded-full text-white"
                                                href="#"
                                            >
                                                <BsGithub/>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex gap-3 text-sm">
                                {product_details.quantity ? (
                                    <button
                                        onClick={() => handleBuyProduct(product_details._id)}
                                        className="px-5 py-3 h-[45px] rounded-md cursor-pointer hover:shadow-lg hover:shadow-red-500/40 bg-red-500 text-white">
                                        Mua ngay
                                    </button>) : ("")}
                                <Link
                                    to={`/dashboard/chat/${product_details.sellerId}`}
                                    className="px-6 py-3 h-[45px] rounded-md cursor-pointer hover:shadow-lg hover:shadow-green-500/40 bg-green-500 text-white block"
                                >
                                    Chat với người bán
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto pb-16">
                    <div className="flex flex-wrap">
                        <div className="w-[72%] md-lg:w-full">
                            <div className="pr-4 md-lg:pr-0">
                                <div className="grid grid-cols-2">
                                    <button
                                        onClick={() => setState("reviews")}
                                        className={`py-1 hover:text-white px-5 hover:bg-green-500 hover: transition-transform ${state === "reviews" ? "bg-red-500 text-white" : "bg-slate-200 text-slate-700"} rounded-l-md`}
                                    >
                                        Đánh giá của khách hàng
                                    </button>
                                    <button
                                        onClick={() => setState("description")}
                                        className={`py-2 px-5 hover:text-white hover:bg-green-500 ${state === "description" ? "bg-red-500 text-white" : "bg-slate-200 text-slate-700"} rounded-r-md`}
                                    >
                                        Mô tả sản phẩm
                                    </button>
                                </div>
                                <div>
                                    {state === "reviews" ? (
                                        <Review product={product_details}/>) : (
                                        <p className="py-5 text-slate-600">
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: DOMPurify.sanitize(product_details.description),
                                                }}
                                            />
                                        </p>)}
                                </div>
                            </div>
                        </div>
                        <div className="w-[28%] md-lg:w-full">
                            <div className="pl-4 md-lg:pl-0">
                                <div className="px-3 py-2 sm:px-2 sm:py-3 text-white text-center rounded-md bg-red-500">
                                    <Link to={`/seller-store/${product_details.sellerId}`} className="text-white">
                                        <h2>{product_details.shop_name}</h2>
                                    </Link>
                                </div>
                                <div className="flex flex-col justify-center items-center border gap-5 mt-3 p-3">
                                    {more_products.map((w) => {
                                        return (<Link
                                            to={`/home/product-details/${w.slug}`}
                                            key={w._id}
                                            className=" w-[85%] group cursor-pointer border-2 transition-all bg-white duration-500 hover:shadow-md hover:-mt-3 rounded-lg"
                                        >
                                            <div className="relative overflow-hidden">
                                                {w.discount ? (<div
                                                    className="flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs right-2 top-2">
                                                    - {w.discount}%
                                                </div>) : ("")}

                                                <img
                                                    className="w-full h-full object-contain rounded-t-md p-2"
                                                    style={{aspectRatio: "1 / 1", objectPosition: "center"}}
                                                    src={w.images[0]}
                                                    alt=""
                                                />
                                            </div>
                                            <div className="py-3 text-slate-600 px-2 text-sm">
                                                <h2 className="font-bold text-blue-500">
                                                    {w.brand_name}.
                                                </h2>
                                                <h2 className="line-clamp-2">{w.product_name}</h2>
                                                <div className="flex justify-start items-center gap-2 m-[2px]">
                                                    <span className="font-bold line-through">
                                                        {formateCurrency(w.price)}
                                                    </span>
                                                    <span className="text-base font-bold text-red-500">
                                                        {formateCurrency(w.price - (w.price * w.discount) / 100)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-center items-center">
                                                    <Rating rating={w.rating}/>
                                                    <h2 className="font-medium text-green-600 ml-10">
                                                        Số lượng: {w.quantity}
                                                    </h2>
                                                </div>
                                            </div>
                                        </Link>);
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto">
                    <h2 className="text-2xl py-8 text-slate-600">Sản phẩm tương tự</h2>
                    <div>
                        <Swiper
                            slidesPerView="auto"
                            breakpoints={{
                                1280: {
                                    slidesPerView: 5,
                                }, 565: {
                                    slidesPerView: 2,
                                },
                            }}
                            spaceBetween={25}
                            loop={true}
                            pagination={{
                                clickable: true, el: ".custom_bullet",
                            }}
                            modules={[Pagination]}
                            className="mySwiper"
                        >
                            {related_products.map((p, i) => {
                                return (<SwiperSlide key={i}>
                                    <div
                                        key={p._id}
                                        className="border-2 group transition-all duration-500 hover:shadow-md hover:-mt-3 rounded-lg"
                                    >
                                        <div className="relative overflow-hidden">
                                            {p.discount ? (<div
                                                className="flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs right-2 top-2">
                                                - {p.discount}%
                                            </div>) : ("")}
                                            <img
                                                className="w-full h-full object-contain rounded-t-md"
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
                                            <h2 className="font-bold text-blue-500">
                                                {p.brand_name}.
                                            </h2>
                                            <h2 className="line-clamp-2">{p.product_name}</h2>
                                            <div className="flex justify-start items-center gap-2 m-[2px]">
                                                <span className="font-bold line-through">
                                                    {formateCurrency(p.price)}
                                                </span>
                                                <span className="text-base font-bold text-red-500">
                                                    {formateCurrency(p.price - (p.price * p.discount) / 100)}
                                                </span>
                                            </div>
                                            <div className="flex justify-center items-center">
                                                <Rating rating={p.rating}/>
                                                <h2 className="font-medium text-green-600 ml-10">
                                                    Số lượng: {p.quantity}
                                                </h2>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>);
                            })}
                        </Swiper>
                    </div>
                    <div className="w-full flex justify-center items-center py-10">
                        <div className="custom_bullet justify-center gap-3 !w-auto"></div>
                    </div>
                </div>
            </section>
            <Footer/>
        </div>
    );
};

export default ProductDetails;

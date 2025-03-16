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
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (slug) {
            setLoading(true); 
            dispatch(get_product_details_by_slug(slug))
                .unwrap()
                .then(() => setLoading(false)) 
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
        if (quantity < product_details?.quantity) {
            setQuantity(quantity + 1);
        } else {
            toast.error(`Chỉ còn ${product_details?.quantity} sản phẩm trong kho`);
        }
    };

    const dec_quantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddToCart = () => {
        if (!selectedColor) {
            toast.error('Vui lòng chọn màu sắc sản phẩm');
            return;
        }
        if (!selectedSize) {
            toast.error('Vui lòng chọn kích thước sản phẩm');
            return;
        }

        if (!userInfo) {
            toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
            return;
        }

        if (quantity > product_details.quantity) {
            toast.error(`Chỉ còn ${product_details.quantity} sản phẩm trong kho`);
            return;
        }

        dispatch(add_to_cart({
            customerId: userInfo.id,
            productId: product_details._id,
            quantity,
            color: selectedColor,
            size: selectedSize
        }));
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
                                    className="w-full h-[400px] object-contain rounded-t-md"
                                    style={{aspectRatio: "1 / 1", objectPosition: "center"}}
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
                            <div className="font-medium flex flex-wrap gap-3 items-center">
                                <span>Giá bán: </span>
                                {product_details.discount ? (
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="line-through text-gray-500">
                                            {formateCurrency(product_details.price)}
                                        </h2>
                                        <h2 className="text-lg text-red-500 font-medium">
                                            {formateCurrency(product_details.price - (product_details.price * product_details.discount) / 100)}
                                        </h2>
                                        <span className="text-red-500">
                                            (Giảm {product_details.discount}%)
                                        </span>
                                    </div>
                                ) : (
                                        <h2 className="text-lg text-red-500 font-medium">
                                            {formateCurrency(product_details.price)}
                                        </h2>
                                )}
                            </div>
                            <div className="flex flex-col gap-6 mt-5">
                                {product_details.colors && product_details.colors.length > 0 && (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <span className="text-black font-bold min-w-[100px]">Màu sắc:</span>
                                            {selectedColor && (
                                                <span className="text-sm text-gray-600">
                                                    Đã chọn: {selectedColor.name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-3 items-center flex-wrap">
                                            {product_details.colors.map((color, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-110 relative ${
                                                        selectedColor === color 
                                                            ? 'ring-2 ring-offset-2 ring-red-500' 
                                                            : 'ring-1 ring-gray-300'
                                                    }`}
                                                    style={{ 
                                                        backgroundColor: color.code,
                                                        border: color.code === '#FFFFFF' ? '1px solid #e5e7eb' : 'none'
                                                    }}
                                                >
                                                    {selectedColor === color && (
                                                        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                                                            {color.name}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {product_details.sizes && product_details.sizes.length > 0 && (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <span className="text-black font-bold min-w-[100px]">Kích thước:</span>
                                            {selectedSize && (
                                                <span className="text-sm text-gray-600">
                                                    Đã chọn: {selectedSize}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-2 sm:gap-3 items-center flex-wrap">
                                            {product_details.sizes.map((size, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`min-w-[40px] sm:min-w-[48px] h-10 sm:h-12 flex items-center justify-center px-2 sm:px-3 cursor-pointer rounded-lg transition-all duration-300 ${
                                                        selectedSize === size
                                                            ? 'bg-red-500 text-white font-medium'
                                                            : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {size}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-5 mt-6">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-black font-bold min-w-[80px] sm:min-w-[100px]">Số lượng:</span>
                                        {product_details.quantity ? (
                                            <div className="flex bg-gray-50 h-[40px] sm:h-[45px] rounded-lg justify-center items-center">
                                                <div
                                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                                    className="w-10 sm:w-12 h-full flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-l-lg text-xl font-medium"
                                        >
                                            -
                                        </div>
                                                <div className="w-10 sm:w-12 h-full flex items-center justify-center border-l border-r border-gray-200 font-medium">
                                                    {quantity}
                                                </div>
                                        <div
                                                    onClick={() => setQuantity(prev => prev + 1)}
                                                    className="w-10 sm:w-12 h-full flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-r-lg text-xl font-medium"
                                        >
                                            +
                                        </div>
                                            </div>
                                        ) : (
                                            <span className="text-red-500 font-medium">Hết hàng</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-black font-bold">Còn lại:</span>
                                        <span className={`font-semibold ${
                                            product_details.quantity === 0 
                                                ? 'text-red-500' 
                                                : product_details.quantity < 10 
                                                    ? 'text-orange-500' 
                                                    : 'text-green-500'
                                        }`}>
                                            {product_details.quantity === 0 
                                                ? "Hết hàng" 
                                                : `${product_details.quantity} sản phẩm${
                                                    product_details.quantity < 10 ? " (Sắp hết hàng)" : ""
                                                }`
                                            }
                                        </span>
                                    </div>
                                </div>

                                {product_details.quantity > 0 ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleAddToCart}
                                            className="flex-[8] h-[45px] sm:h-[50px] px-4 sm:px-6 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            <FaCartShopping size={18} />
                                            Thêm vào giỏ hàng
                                        </button>
                                        <div
                                            onClick={() => handleAddToWishlist(product_details)}
                                            className="flex-[2] h-[45px] sm:h-[50px] rounded-lg flex justify-center items-center cursor-pointer hover:bg-red-50 border border-red-500 text-red-500 transition-all duration-300"
                                        >
                                            <AiFillHeart size={22} />
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        disabled
                                        className="w-full h-[45px] sm:h-[50px] px-4 sm:px-6 rounded-lg bg-gray-400 text-white font-medium cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        Sản phẩm đã hết hàng
                                    </button>
                                )}

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 pt-3 border-t">
                                    <Link
                                        to={`/dashboard/chat/${product_details.sellerId}`}
                                        className="w-full sm:w-auto h-[45px] px-4 sm:px-6 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        Chat với người bán
                                    </Link>
                                    <div className="flex items-center gap-3">
                                        <span className="text-black font-bold whitespace-nowrap">Chia sẻ:</span>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href="#"
                                                className="w-[35px] h-[35px] sm:w-[38px] sm:h-[38px] flex justify-center items-center bg-indigo-500 rounded-full text-white hover:bg-indigo-600 transition-all duration-300"
                                            >
                                                <FaFacebook size={18} />
                                            </a>
                                            <a
                                                href="#"
                                                className="w-[35px] h-[35px] sm:w-[38px] sm:h-[38px] flex justify-center items-center bg-[#E1306C] rounded-full text-white hover:bg-[#c11d5b] transition-all duration-300"
                                            >
                                                <GrInstagram size={18} />
                                            </a>
                                            <a
                                                href="#"
                                                className="w-[35px] h-[35px] sm:w-[38px] sm:h-[38px] flex justify-center items-center bg-[#1D9BF0] rounded-full text-white hover:bg-[#1a8cd8] transition-all duration-300"
                                            >
                                                <BsTwitter size={18} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
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
                                        onClick={() => setState("description")}
                                        className={`py-2 px-5 hover:text-white hover:bg-green-500 hover:transition-transform ${state === "description" ? "bg-red-500 text-white" : "bg-slate-200 text-slate-700"} rounded-r-md`}
                                    >
                                        Mô tả sản phẩm
                                    </button>

                                    <button
                                        onClick={() => setState("reviews")}
                                        className={`py-1 hover:text-white px-5 hover:bg-green-500 hover ${state === "reviews" ? "bg-red-500 text-white" : "bg-slate-200 text-slate-700"} rounded-l-md`}
                                    >
                                        Đánh giá của khách hàng
                                    </button>
                                    
                                </div>
                                <div>
                                    {state === "description" ? (
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
                                                    <div className="ml-10">
                                                        <span className={`text-sm ${w.quantity === 0 ? 'text-red-500' : 'text-green-600'}`}>
                                                            {w.quantity === 0 ? 'Đã bán hết' : `Số lượng: ${w.quantity} ${w.quantity < 10 ? ' (Sắp hết)' : ''}`}
                                                        </span>
                                                    </div>
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
                                    <div className="border-2 cursor-pointer group transition-all duration-500 hover:shadow-md hover:-mt-3 rounded-lg">
                                        <Link
                                            to={`/home/product-details/${p.slug}`}
                                            key={p._id}
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
                                                    <div className="ml-10">
                                                        <span className={`text-sm ${p.quantity === 0 ? 'text-red-500' : 'text-green-600'}`}>
                                                            {p.quantity === 0 ? 'Đã bán hết' : `Số lượng: ${p.quantity} ${p.quantity < 10 ? ' (Sắp hết)' : ''}`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
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

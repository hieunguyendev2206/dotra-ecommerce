/* eslint-disable no-unused-vars */
import {useEffect, useState} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import DOMPurify from "dompurify";
import {motion} from "framer-motion";
import {Helmet} from "react-helmet-async";

// Components
import Rating from "../../components/Rating";
import Review from "../../components/Review";
import Footer from "../../layouts/Footer";
import Header from "../../layouts/Header";

// Redux Actions
import {get_product_details_by_slug} from "../../store/reducers/home.reducers";
import {add_to_cart, message_clear} from "../../store/reducers/cart.reducers";
import {add_to_wishlist, message_clear_add_wishlist} from "../../store/reducers/wishlist.reducers";
import {add_review, get_review} from "../../store/reducers/rewiew.reducers.js";

// Swiper & Carousel
import {Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import Carousel from "react-multi-carousel";
import "swiper/css";
import "swiper/css/pagination";

// Utilities
import {formateCurrency} from "../../utils/formate";
import path from "../../constants/path";
import icons from "../../assets/icons";

// Icons
import {FaCartShopping, FaWhatsapp} from "react-icons/fa6";
import {ClipLoader} from "react-spinners";

const ProductDetails = () => {
    const {slug, productId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Destructure icons
    const {
        MdOutlineKeyboardArrowRight, AiFillHeart, FaFacebook, GrInstagram, BsTwitter, BsGithub,
    } = icons;

    // UI States
    const [state, setState] = useState("description");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    // Product States
    const [image, setImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [buyCount, setBuyCount] = useState(1);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);

    // Review States
    const [reviewContent, setReviewContent] = useState("");

    // Redux Selectors
    const {userInfo} = useSelector((state) => state.customer);
    const {orders} = useSelector((state) => state.order);
    const {product_details, related_products, more_products} = useSelector((state) => state.home);
    const {success_message, error_message} = useSelector((state) => state.cart);
    const {add_wishlist_success_message, add_wishlist_error_message} = useSelector((state) => state.wishlist);
    const {total_review} = useSelector((state) => state.review);

    // Thêm state để hiển thị modal đăng nhập
    const [openLoginModal, setOpenLoginModal] = useState(false);

    // Responsive settings for carousel
    const responsive = {
        superLargeDesktop: {
            breakpoint: {max: 4000, min: 3000}, items: 5,
        },
        desktop: {
            breakpoint: {max: 3000, min: 1024}, items: 4,
        },
        tablet: {
            breakpoint: {max: 1024, min: 464}, items: 4,
        },
        mdtablet: {
            breakpoint: {max: 991, min: 464}, items: 4,
        },
        mobile: {
            breakpoint: {max: 768, min: 0}, items: 3,
        },
        smmobile: {
            breakpoint: {max: 640, min: 0}, items: 2,
        },
        xsmobile: {
            breakpoint: {max: 440, min: 0}, items: 1,
        },
    };

    useEffect(() => {
        if (slug) {
            setLoading(true);
            setError(null);
            dispatch(get_product_details_by_slug(slug))
                .unwrap()
                .then(() => {
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setError(err.message || 'Có lỗi xảy ra khi tải thông tin sản phẩm');
                    setLoading(false);
                });
        }
    }, [dispatch, slug]);

    useEffect(() => {
        if (product_details?.images && product_details.images.length > 0) {
            setImage(product_details.images[0]);
        }
        
        // Tự động lấy dữ liệu đánh giá khi có thông tin sản phẩm
        if (product_details?._id) {
            dispatch(get_review({
                productId: product_details._id,
                pageNumber: 1
            }));
        }
    }, [product_details, dispatch]);

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

    const hasPurchasedProduct = () => {
        if (orders && orders.length > 0) {
            return orders.some(order => order.products.some(product => product.productId === productId));
        }
        return false;
    };

    const handleReviewSubmit = () => {
        if (!userInfo) {
            // Thay vì hiển thị toast, mở modal đăng nhập
            if (typeof window !== 'undefined') {
                // Gọi hàm showLoginModal từ Header component
                window.dispatchEvent(new CustomEvent('showLoginModal'));
            } else {
                toast.error("Bạn cần đăng nhập để gửi đánh giá.");
            }
            return;
        }

        if (!hasPurchasedProduct()) {
            toast.error("Bạn cần mua sản phẩm này trước khi đánh giá.");
            return;
        }

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
                customerId: userInfo.id,
                productId: productId,
                quantity: buyCount,
            }));
        } else {
            toast.error("Bạn cần đăng nhập để mua sản phẩm")
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
            toast.error("Bạn cần đăng nhập để thêm yêu thích");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <ClipLoader color="#ef4444" size={50}/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Có lỗi xảy ra</h2>
                    <p className="text-gray-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    if (!product_details || Object.keys(product_details).length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Không tìm thấy sản phẩm</h2>
                    <p className="text-gray-600">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                    <Link
                        to="/"
                        className="mt-4 inline-block px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Về trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white">
            <Helmet>
                <title>{product_details?.product_name || 'Chi tiết sản phẩm'} - Dotra</title>
                <meta name="description"
                      content={product_details?.description?.substring(0, 160) || 'Chi tiết sản phẩm trên Dotra'}/>

                {/* Facebook Open Graph / Social Media Meta Tags */}
                <meta property="og:type" content="product"/>
                <meta property="og:title" content={product_details?.product_name || 'Chi tiết sản phẩm'}/>
                <meta property="og:description"
                      content={product_details?.description?.substring(0, 160) || 'Chi tiết sản phẩm trên Dotra'}/>
                <meta property="og:image" content={product_details?.images?.[0] || ''}/>
                <meta property="og:url" content={window.location.href}/>

                {/* Twitter Card Meta Tags */}
                <meta name="twitter:card" content="summary_large_image"/>
                <meta name="twitter:title" content={product_details?.product_name || 'Chi tiết sản phẩm'}/>
                <meta name="twitter:description"
                      content={product_details?.description?.substring(0, 160) || 'Chi tiết sản phẩm trên Dotra'}/>
                <meta name="twitter:image" content={product_details?.images?.[0] || ''}/>
            </Helmet>
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
                <div className="w-[85%] md:w-[90%] sm:w-[95%] h-full mx-auto pb-8 sm:pb-6">
                    <div className="grid grid-cols-2 md-lg:grid-cols-1 gap-8 md:gap-6 sm:gap-4">
                        <div>
                            <div className="p-5 sm:p-3 border h-[450px] md:h-[400px] sm:h-[350px] w-full">
                                <img
                                    className="w-full h-full object-contain rounded-t-md"
                                    style={{aspectRatio: "1 / 1", objectPosition: "center"}}
                                    src={image ? image : product_details.images?.[0]}
                                    alt="Hình ảnh chi tiết sản phẩm"
                                />
                            </div>
                            <div className="py-3 w-full sm:py-2">
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
                                                        className="w-full h-[200px] md:h-[150px] sm:h-[120px] object-contain rounded-t-md"
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
                        <div className="flex flex-col gap-4 sm:gap-3 mt-1 sm:mt-0">
                            <div className="text-lg font-bold">
                                <div className="flex justify-between items-start">
                                    <h2 className="text-2xl md:text-xl sm:text-lg font-bold text-slate-600">
                                        {product_details.product_name}
                                    </h2>
                                </div>
                            </div>
                            <div className="flex justify-start items-center gap-4">
                                <div className="flex">
                                    <Rating rating={product_details.rating} reviews={total_review} />
                                </div>
                            </div>
                            <span className="text-blue-500 font-semibold">
                                Thương hiệu: {product_details.brand_name}
                            </span>
                            <div className="font-medium flex flex-wrap gap-2 items-center">
                                <span>Giá bán: </span>
                                {product_details.discount ? (
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="line-through text-gray-500">
                                            {formateCurrency(product_details.price)}
                                        </h2>
                                        <h2 className="text-lg sm:text-base text-red-500 font-medium">
                                            {formateCurrency(product_details.price - (product_details.price * product_details.discount) / 100)}
                                        </h2>
                                        <span className="text-red-500">
                                            (Giảm {product_details.discount}%)
                                        </span>
                                    </div>
                                ) : (
                                    <h2 className="text-lg sm:text-base text-red-500 font-medium">
                                        {formateCurrency(product_details.price)}
                                    </h2>
                                )}
                            </div>
                            <div className="flex flex-col gap-5 sm:gap-4 mt-3 sm:mt-2">
                                {product_details.colors && product_details.colors.length > 0 && (
                                    <div className="flex flex-col gap-3 sm:gap-2">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-1">
                                            <span className="text-black font-bold min-w-[100px] sm:min-w-[80px]">Màu sắc:</span>
                                            {selectedColor && (
                                                <span className="text-sm text-gray-600">
                                                    Đã chọn: {selectedColor.name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-3 sm:gap-2 items-center flex-wrap">
                                            {product_details.colors.map((color, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`w-10 h-10 sm:w-9 sm:h-9 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-110 relative ${
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
                                                        <span
                                                            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                                                            {color.name}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {product_details.sizes && product_details.sizes.length > 0 && (
                                    <div className="flex flex-col gap-3 sm:gap-2">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-1">
                                            <span className="text-black font-bold min-w-[100px] sm:min-w-[80px]">Kích thước:</span>
                                            {selectedSize && (
                                                <span className="text-sm text-gray-600">
                                                    Đã chọn: {selectedSize}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-2 items-center flex-wrap">
                                            {product_details.sizes.map((size, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`min-w-[40px] sm:min-w-[36px] h-10 sm:h-9 flex items-center justify-center px-2 cursor-pointer rounded-lg transition-all duration-300 ${
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
                            <div className="flex flex-col gap-4 sm:gap-3 mt-4 sm:mt-2">
                                <div className="flex flex-col sm:flex-col gap-4 sm:gap-3">
                                    <div className="flex items-center gap-3 sm:gap-2">
                                        <span className="text-black font-bold min-w-[80px]">Số lượng:</span>
                                        {product_details.quantity ? (
                                            <div className="flex bg-gray-50 h-[40px] sm:h-[35px] rounded-lg justify-center items-center">
                                                <div
                                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                                    className="w-10 sm:w-9 h-full flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-l-lg text-xl font-medium"
                                                >
                                                    -
                                                </div>
                                                <div className="w-10 sm:w-9 h-full flex items-center justify-center border-l border-r border-gray-200 font-medium">
                                                    {quantity}
                                                </div>
                                                <div
                                                    onClick={() => setQuantity(prev => prev + 1)}
                                                    className="w-10 sm:w-9 h-full flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-r-lg text-xl font-medium"
                                                >
                                                    +
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-red-500 font-medium">Hết hàng</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-black font-bold min-w-[80px]">Còn lại:</span>
                                        <span className={`font-semibold text-sm ${
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
                                            className="flex-[8] h-[45px] sm:h-[40px] px-4 sm:px-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            <FaCartShopping size={16}/>
                                            <span className="sm:text-sm">Thêm vào giỏ hàng</span>
                                        </button>
                                        <div
                                            onClick={() => handleAddToWishlist(product_details)}
                                            className="flex-[2] h-[45px] sm:h-[40px] rounded-lg flex justify-center items-center cursor-pointer hover:bg-red-50 border border-red-500 text-red-500 transition-all duration-300"
                                        >
                                            <AiFillHeart size={20}/>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        disabled
                                        className="w-full h-[45px] sm:h-[40px] px-4 sm:px-3 rounded-lg bg-gray-400 text-white font-medium cursor-not-allowed flex items-center justify-center gap-2 sm:text-sm"
                                    >
                                        Sản phẩm đã hết hàng
                                    </button>
                                )}

                                <div className="flex flex-col sm:flex-col items-center sm:items-start justify-between gap-4 sm:gap-3 pt-3 border-t">
                                    <Link
                                        to={`/dashboard/chat/${product_details.sellerId}`}
                                        className="w-full sm:w-full h-[45px] sm:h-[40px] px-4 sm:px-3 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-2 sm:text-sm"
                                    >
                                        Liên hệ người bán
                                    </Link>
                                    <div className="flex items-center gap-3 w-full justify-between sm:justify-start">
                                        <span className="text-black font-bold whitespace-nowrap sm:text-sm">Chia sẻ:</span>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + window.location.pathname)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-[35px] h-[35px] sm:w-[32px] sm:h-[32px] flex justify-center items-center bg-indigo-500 rounded-full text-white hover:bg-indigo-600 transition-all duration-300"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    window.open(
                                                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + window.location.pathname)}`,
                                                        'facebook-share-dialog',
                                                        'width=626,height=436'
                                                    );
                                                }}
                                            >
                                                <FaFacebook size={16}/>
                                            </a>
                                            <a
                                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin + window.location.pathname)}&text=${encodeURIComponent(product_details.product_name)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-[35px] h-[35px] sm:w-[32px] sm:h-[32px] flex justify-center items-center bg-[#1D9BF0] rounded-full text-white hover:bg-[#1a8cd8] transition-all duration-300"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    window.open(
                                                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin + window.location.pathname)}&text=${encodeURIComponent(product_details.product_name)}`,
                                                        'twitter-share-dialog',
                                                        'width=626,height=436'
                                                    );
                                                }}
                                            >
                                                <BsTwitter size={16}/>
                                            </a>
                                            <a
                                                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(product_details.product_name + ' ' + window.location.origin + window.location.pathname)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-[35px] h-[35px] sm:w-[32px] sm:h-[32px] flex justify-center items-center bg-[#25D366] rounded-full text-white hover:bg-[#22c55e] transition-all duration-300"
                                            >
                                                <FaWhatsapp size={16}/>
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
                <div className="w-[85%] md:w-[90%] sm:w-[95%] h-full mx-auto pb-10 sm:pb-6">
                    <div className="flex flex-wrap">
                        <div className="w-[72%] md-lg:w-full">
                            <div className="pr-4 md-lg:pr-0">
                                {/* Improved Tab UI */}
                                <div className="mb-6 sm:mb-4 border-b border-gray-200 overflow-x-auto">
                                    <div className="flex whitespace-nowrap">
                                        <button
                                            onClick={() => setState("description")}
                                            className={`py-3 sm:py-2 px-6 sm:px-4 font-medium transition-all duration-300 text-sm sm:text-xs ${
                                                state === "description"
                                                    ? "text-red-500 border-b-2 border-red-500"
                                                    : "text-gray-500 hover:text-red-500"
                                            }`}
                                        >
                                            Mô tả sản phẩm
                                        </button>
                                        <button
                                            onClick={() => setState("reviews")}
                                            className={`py-3 sm:py-2 px-6 sm:px-4 font-medium transition-all duration-300 text-sm sm:text-xs ${
                                                state === "reviews"
                                                    ? "text-red-500 border-b-2 border-red-500"
                                                    : "text-gray-500 hover:text-red-500"
                                            }`}
                                        >
                                            Đánh giá của khách hàng ({total_review})
                                        </button>
                                    </div>
                                </div>

                                {/* Tab Content with Fixed Logic and Animation */}
                                <div className="min-h-[300px] sm:min-h-[200px]">
                                    {state === "description" && (
                                        <motion.div
                                            initial={{opacity: 0, y: 10}}
                                            animate={{opacity: 1, y: 0}}
                                            transition={{duration: 0.3}}
                                            className="prose prose-sm max-w-none text-gray-600 sm:text-sm"
                                        >
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: DOMPurify.sanitize(product_details.description),
                                                }}
                                            />
                                        </motion.div>
                                    )}

                                    {state === "reviews" && (
                                        <motion.div
                                            initial={{opacity: 0, y: 10}}
                                            animate={{opacity: 1, y: 0}}
                                            transition={{duration: 0.3}}
                                        >
                                            <div className="space-y-4 sm:space-y-3">
                                                {product_details?.reviews?.length === 0 ? (
                                                    <p className="text-gray-500 italic sm:text-sm py-4">Chưa có đánh giá nào cho sản phẩm này.</p>
                                                ) : null}
                                                
                                                <Review product={product_details} userInfo={userInfo} />
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="w-[28%] md-lg:w-full md-lg:mt-8">
                            <div className="pl-4 md-lg:pl-0">
                                <div className="px-3 py-2 sm:px-2 sm:py-3 text-white text-center rounded-md bg-red-500">
                                    <Link to={`/seller-store/${product_details.sellerId}`} className="text-white">
                                        <h2 className="sm:text-sm">{product_details.shop_name}</h2>
                                    </Link>
                                </div>
                                <div className="flex flex-col justify-center items-center border gap-5 sm:gap-3 mt-3 p-3 sm:p-2">
                                    {more_products.map((w) => {
                                        return (<Link
                                            to={`/home/product-details/${w.slug}`}
                                            key={w._id}
                                            className="w-full sm:w-full group cursor-pointer border-2 transition-all bg-white duration-500 hover:shadow-md hover:-mt-3 rounded-lg"
                                        >
                                            <div className="relative overflow-hidden">
                                                {w.discount ? (<div
                                                    className="flex justify-center items-center absolute text-white w-[38px] h-[38px] sm:w-[32px] sm:h-[32px] rounded-full bg-red-500 font-semibold text-xs right-2 top-2">
                                                    - {w.discount}%
                                                </div>) : ("")}

                                                <img
                                                    className="w-full h-full object-contain rounded-t-md p-2"
                                                    style={{aspectRatio: "1 / 1", objectPosition: "center"}}
                                                    src={w.images[0]}
                                                    alt=""
                                                />
                                            </div>
                                            <div className="py-3 sm:py-2 text-slate-600 px-2 text-sm sm:text-xs">
                                                <h2 className="font-bold text-blue-500">
                                                    {w.brand_name}.
                                                </h2>
                                                <h2 className="line-clamp-2">{w.product_name}</h2>
                                                <div className="flex justify-start items-center gap-2 m-[2px]">
                                                <span className="font-bold line-through">
                                                    {formateCurrency(w.price)}
                                                </span>
                                                    <span className="text-base sm:text-sm font-bold text-red-500">
                                                    {formateCurrency(w.price - (w.price * w.discount) / 100)}
                                                </span>
                                                </div>
                                                <div className="flex flex-col sm:flex-col gap-1">
                                                    <div className="flex">
                                                        <Rating rating={w.rating} />
                                                    </div>
                                                    <div>
                                                        <span className={`text-xs ${w.quantity === 0 ? 'text-red-500' : 'text-green-600'}`}>
                                                            {w.quantity === 0 ? 'Đã bán hết' : `Số lượng: ${w.quantity} ${w.quantity < 10 ? ' (Sắp hết)' : ''}`}
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
            <section className="mb-10">
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
                                        className="border-2 cursor-pointer group transition-all duration-500 hover:shadow-md hover:-mt-3 rounded-lg">
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
                                                    <Rating rating={p.rating} />
                                                    <div className="ml-10">
                                                        <span
                                                            className={`text-sm ${p.quantity === 0 ? 'text-red-500' : 'text-green-600'}`}>
                                                            {p.quantity === 0 ? 'Đã bán hết' : `Số lượng: ${p.quantity} ${p.quantity < 10 ? ' (Sắp hết)' : ''}`}
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

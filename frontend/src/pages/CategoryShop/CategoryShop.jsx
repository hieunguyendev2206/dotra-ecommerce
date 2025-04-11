/* eslint-disable no-unused-vars */
import {useEffect, useState} from "react";
import {createSearchParams, Link, useNavigate, useSearchParams,} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {query_products} from "../../store/reducers/home.reducers";
import {Button} from "flowbite-react";
import Footer from "../../layouts/Footer";
import Header from "../../layouts/Header";
import icons from "../../assets/icons";
import Product from "../../components/Product";
import ShopProduct from "../../components/ShopProduct/ShopProduct";
import Pagination from "../../components/Pagination/Pagination";
import Lottie from "react-lottie";
import animationData from "../../assets/img/searchNotFound.json";

const CategoryShop = () => {
    const {
        MdOutlineKeyboardArrowRight,
        AiFillStar,
        CiStar,
        BsFillGridFill,
        FaThList,
    } = icons;
    const [queryParams, setQueryParams] = useSearchParams();
    const category = queryParams.get("category");
    const [filter, setFilter] = useState(true);
    const [rating, setRating] = useState("");
    const [sortPrice, setSortPrice] = useState("");
    const [styles, setStyles] = useState("grid");
    const [pageNumber, setPageNumber] = useState(1);
    const [parPage, setParPage] = useState(16);
    const [priceFrom, setPriceFrom] = useState("");
    const [priceTo, setPriceTo] = useState("");
    const [searchParams, setSearchParams] = useState({
        category: category || "",
        page_number: 1,
        par_page: 16
    });
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {products, latest_products, totalProducts} = useSelector(
        (state) => state.home
    );

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            if (!category) return;

            setIsLoading(true);
            try {
                await dispatch(query_products({
                    ...searchParams,
                    category: category,
                    page_number: pageNumber,
                    par_page: parPage,
                })).unwrap();
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [category, pageNumber, parPage]);

    useEffect(() => {
        if (category) {
            setSearchParams(prev => ({
                ...prev,
                category: category,
                page_number: pageNumber,
                par_page: parPage,
            }));
        }
    }, [category, pageNumber, parPage]);

    const handlePriceFromChange = (event) => {
        setPriceFrom(event.target.value);
    };

    const handlePriceToChange = (event) => {
        setPriceTo(event.target.value);
    };

    const handleSubmitFilterPrice = (event) => {
        event.preventDefault();
        navigate({
            pathname: "/products",
            search: createSearchParams({
                ...searchParams,
                price_from: priceFrom,
                price_to: priceTo,
            }).toString(),
        });
        setSearchParams({
            ...searchParams,
            price_from: priceFrom,
            price_to: priceTo,
        });
    };

    const onClickRating = (value) => {
        setRating(value);
        navigate({
            pathname: "/products",
            search: createSearchParams({
                ...searchParams,
                rating: value,
            }).toString(),
        });
        setSearchParams({
            ...searchParams,
            rating: value,
        });
    };

    const handleSortPrice = (event) => {
        const newSortPrice = event.target.value;
        setSortPrice(newSortPrice);
        navigate({
            pathname: "/products",
            search: createSearchParams({
                ...searchParams,
                sort_price: newSortPrice,
            }).toString(),
        });
        setSearchParams({
            ...searchParams,
            sort_price: newSortPrice,
        });
    };

    const resetFilter = () => {
        setRating("");
        setSortPrice("");
        setPageNumber(1);
        setParPage(16);
        setPriceFrom("");
        setPriceTo("");
        setSearchParams({
            category: category,
            page_number: 1,
            par_page: 16,
        });
        navigate(`/products?category=${category}`);
    };

    return (
        <div className="bg-white">
            <Header/>
            <section
                className='bg-[url("/src/assets/banners/2.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
                <div className="absolute left-0 top-0 w-full h-full bg-[#2422228a]">
                    <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto">
                        <div className="flex flex-col justify-center gap-1 items-center h-full w-full text-white">
                            <h2 className="text-3xl font-bold">Dotra.</h2>
                            <div className="flex justify-center items-center gap-2 text-2xl w-full">
                                <Link to="/">Trang chủ</Link>
                                <span className="pt-1">
                                  <MdOutlineKeyboardArrowRight/>
                                </span>
                                <span>Cửa hàng</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-16">
                <div className="w-[85%] md:w-[90%%] sm:w-[90%] lg:w-[90%] h-full mx-auto">
                    <div className={`md:block hidden ${!filter ? "mb-6" : "mb-0"}`}>
                        <button
                            onClick={() => setFilter(!filter)}
                            className="text-center w-full py-2 px-3 bg-red-500 text-white rounded-md"
                        >
                            Lọc sản phẩm
                        </button>
                    </div>
                    <div className="w-full flex flex-wrap">
                        <div
                            className={`w-3/12 md-lg:w-4/12 md:w-full pr-8 ${
                                filter
                                    ? "md:h-0 md:overflow-hidden md:mb-6"
                                    : "md:h-auto md:overflow-auto md:mb-0"
                            }`}
                        >
                            <div className="py-2 flex flex-col gap-4">
                                <form onSubmit={handleSubmitFilterPrice}>
                                    <h2 className="font-mono text-lg font-bold text-red-600">
                                        Lọc theo khoảng giá
                                    </h2>
                                    <div className="flex justify-start items-center py-2">
                                        <input
                                            value={priceFrom}
                                            onChange={handlePriceFromChange}
                                            type="number"
                                            className="w-[150px] h-9"
                                            placeholder="Từ..."
                                        />
                                        <span className="mx-2">-</span>
                                        <input
                                            value={priceTo}
                                            onChange={handlePriceToChange}
                                            type="number"
                                            className="w-[150px] h-9"
                                            placeholder="Đến..."
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-[100px] mt-2"
                                        color="failure"
                                    >
                                        Áp dụng
                                    </Button>
                                </form>
                            </div>
                            <div className="py-2 flex flex-col gap-4">
                                <h2 className="font-mono text-lg font-bold text-red-600">
                                    Đánh giá
                                </h2>
                                <div className="flex flex-col gap-3">
                                    <div
                                        onClick={() => onClickRating(5)}
                                        className="text-orange-500 flex justify-start items-start gap-1 text-lg cursor-pointer"
                                    >
                                        <span>
                                            <AiFillStar/>
                                        </span>
                                        <span>
                                            <AiFillStar/>
                                        </span>
                                        <span>
                                            <AiFillStar/>
                                        </span>
                                        <span>
                                            <AiFillStar/>
                                        </span>
                                        <span>
                                            <AiFillStar/>
                                        </span>
                                    </div>
                                    <div
                                        onClick={() => onClickRating(4)}
                                        className="text-orange-500 flex justify-start items-start gap-1 text-lg cursor-pointer"
                                    >
                                        <span>
                                          <AiFillStar/>
                                        </span>
                                        <span>
                                          <AiFillStar/>
                                        </span>
                                        <span>
                                          <AiFillStar/>
                                        </span>
                                        <span>
                                          <AiFillStar/>
                                        </span>
                                        <span>
                                          <CiStar/>
                                        </span>
                                    </div>
                                    <div
                                        onClick={() => onClickRating(3)}
                                        className="text-orange-500 flex justify-start items-start gap-1 text-lg cursor-pointer"
                                    >
                                        <span>
                                          <AiFillStar/>
                                        </span>
                                        <span>
                                          <AiFillStar/>
                                        </span>
                                        <span>
                                          <AiFillStar/>
                                        </span>
                                        <span>
                                          <CiStar/>
                                        </span>
                                        <span>
                                          <CiStar/>
                                        </span>
                                    </div>
                                    <div
                                        onClick={() => onClickRating(2)}
                                        className="text-orange-500 flex justify-start items-start gap-1 text-lg cursor-pointer"
                                    >
                                        <span>
                                          <AiFillStar/>
                                        </span>
                                        <span>
                                          <AiFillStar/>
                                        </span>
                                        <span>
                                          <CiStar/>
                                        </span>
                                        <span>
                                          <CiStar/>
                                        </span>
                                        <span>
                                          <CiStar/>
                                        </span>
                                    </div>
                                    <div
                                        onClick={() => onClickRating(1)}
                                        className="text-orange-500 flex justify-start items-start gap-1 text-lg cursor-pointer"
                                    >
                                        <span>
                                          <AiFillStar/>
                                        </span>
                                        <span>
                                          <CiStar/>
                                        </span>
                                        <span>
                                          <CiStar/>
                                        </span>
                                        <span>
                                          <CiStar/>
                                        </span>
                                        <span>
                                          <CiStar/>
                                        </span>
                                    </div>
                                    <div
                                        onClick={() => onClickRating(0)}
                                        className="text-orange-500 flex justify-start items-start gap-1 text-lg cursor-pointer"
                                    >
                                        <span>
                                          <CiStar/>
                                        </span>
                                        <span>
                                          <CiStar/>
                                        </span>
                                        <span>
                                          <CiStar/>
                                        </span>
                                        <span>
                                          <CiStar/>
                                        </span>
                                        <span>
                                          <CiStar/>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => resetFilter()}
                                className="text-center w-full py-2 px-3 bg-red-500 text-white mt-2 rounded-md"
                            >
                                Xóa tất cả
                            </button>
                            <div className="py-5 flex flex-col gap-4 md:hidden">
                                <Product products={latest_products} title="Sản phẩm mới nhất"/>
                            </div>
                        </div>
                        <div className="w-9/12 md-lg:w-8/12 md:w-full pl-8 md-lg:pl-0">
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex justify-start items-center gap-4">
                                        <div className="flex justify-center items-start gap-4 md-lg:hidden">
                                            <div
                                                onClick={() => setStyles("grid")}
                                                className={`p-2 ${
                                                    styles === "grid" && "bg-slate-300"
                                                } text-red-600 hover:bg-slate-300 cursor-pointer rounded-sm`}
                                            >
                                                <BsFillGridFill/>
                                            </div>
                                            <div
                                                onClick={() => setStyles("list")}
                                                className={`p-2 ${
                                                    styles === "list" && "bg-slate-300"
                                                } text-red-600 hover:bg-slate-300 cursor-pointer rounded-sm`}
                                            >
                                                <FaThList/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="pb-8">
                                    {isLoading ? (
                                        <div className="flex justify-center items-center h-64">
                                            <div
                                                className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                                        </div>
                                    ) : products.length === 0 ? (
                                        <div
                                            className="w-full min-h-[400px] flex flex-col items-center justify-center py-8">
                                            <Lottie options={defaultOptions} width={200} height={200}/>
                                            <p className="text-center text-lg text-gray-600 mt-4">
                                                Không có sản phẩm nào trong danh mục {category}
                                            </p>
                                        </div>
                                    ) : (
                                        <ShopProduct styles={styles} products={products}/>
                                    )}
                                </div>
                                {totalProducts > parPage && (
                                    <div className="w-full flex justify-end mt-4 bottom-4 right-4">
                                        <Pagination
                                            currentPageNumber={pageNumber}
                                            setCurrentPageNumber={setPageNumber}
                                            totalItem={totalProducts}
                                            parPage={parPage}
                                            showItem={Math.floor(totalProducts / parPage)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer/>
        </div>
    );
};

export default CategoryShop;

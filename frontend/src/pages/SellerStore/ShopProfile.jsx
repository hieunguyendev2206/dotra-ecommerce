import React, { useEffect, useState } from "react";
import Banner from "../../components/Banner/Banner.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Tabs } from "antd";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BsFillGridFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import { get_shop_info, get_shop_products } from "../../store/reducers/shop.reducers";
import ShopProduct from "../../components/SellerStore/ProductList";
import Pagination from "../../components/Pagination/Pagination";
import Header from "../../layouts/Header/Header";
import Footer from "../../layouts/Footer/Footer";

const ShopProfile = () => {
    const { sellerId } = useParams();
    const dispatch = useDispatch();

    const { shopInfo } = useSelector((state) => state.shop);
    const { products, totalProducts } = useSelector((state) => state.shop);

    const [styles, setStyles] = useState("grid");
    const [priceFrom, setPriceFrom] = useState("");
    const [priceTo, setPriceTo] = useState("");
    const [rating, setRating] = useState("");
    const [sortPrice, setSortPrice] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const parPage = 8;

    const [queryParams, setQueryParams] = useState({
        seller_id: sellerId,
        page_number: pageNumber,
        par_page: parPage,
    });

    useEffect(() => {
        dispatch(get_shop_info(sellerId));
        dispatch(get_shop_products(sellerId));
    }, [dispatch, queryParams]);

    const handlePriceFilter = (e) => {
        e.preventDefault();
        setQueryParams({ ...queryParams, price_from: priceFrom, price_to: priceTo });
    };

    const handleSortPrice = (e) => {
        const value = e.target.value;
        setSortPrice(value);
        setQueryParams({ ...queryParams, sort_price: value });
    };

    const onClickRating = (value) => {
        setRating(value);
        setQueryParams({ ...queryParams, rating: value });
    };

    const resetFilter = () => {
        setPriceFrom("");
        setPriceTo("");
        setRating("");
        setSortPrice("");
        setQueryParams({
            seller_id: sellerId,
            page_number: 1,
            par_page: parPage,
        });
    };

    return (
        <>
            <Header />
            <div className="bg-gray-50 py-6">
                <div className="container mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Header Seller */}
                    <div className="relative h-[200px] bg-blue-700 text-white p-6 flex flex-col sm:flex-row items-center">
                        <img
                            className="w-24 h-24 rounded-full border-4 border-white sm:mr-6"
                            src={shopInfo?.image || "https://via.placeholder.com/150"}
                            alt="Shop Avatar"
                        />
                        <div className="text-center sm:text-left mt-4 sm:mt-0">
                            <h1 className="text-xl sm:text-2xl font-semibold">
                                {shopInfo?.shop_info?.shop_name || "Tên cửa hàng"}
                            </h1>
                            <p>⭐ {shopInfo?.rating || "0"} / 5 | Người theo dõi: 1.7k+</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="p-6">
                        <Tabs defaultActiveKey="1" centered>
                            {/* Tổng quan */}
                            <Tabs.TabPane tab="Cửa hàng" key="1">
                                <h2 className="text-center text-lg sm:text-2xl font-bold">Mã giảm giá</h2>
                                <div className="flex flex-wrap justify-center gap-4 mt-4">
                                    {[5, 10, 20].map((value) => (
                                        <div key={value} className="p-4 bg-purple-100 rounded-md shadow w-32 text-center">
                                            <h4 className="text-purple-600 font-bold">{value}K</h4>
                                            <p className="text-xs mt-1">Cho đơn từ {value * 40}K</p>
                                        </div>
                                    ))}
                                </div>
                                <Banner />
                            </Tabs.TabPane>

                            {/* Tất cả sản phẩm */}
                            <Tabs.TabPane tab="Tất cả sản phẩm" key="2">
                                <div className="flex flex-col sm:flex-row">
                                    {/* Bộ lọc */}
                                    <div className="sm:w-3/12 w-full sm:pr-8">
                                        <form onSubmit={handlePriceFilter}>
                                            <h3 className="font-bold mb-2">Lọc theo giá</h3>
                                            <input
                                                type="number"
                                                placeholder="Từ"
                                                value={priceFrom}
                                                onChange={(e) => setPriceFrom(e.target.value)}
                                                className="w-full border p-2 mb-2 rounded-md"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Đến"
                                                value={priceTo}
                                                onChange={(e) => setPriceTo(e.target.value)}
                                                className="w-full border p-2 mb-2 rounded-md"
                                            />
                                            <button
                                                type="submit"
                                                className="w-full bg-blue-500 text-white py-2 rounded-md"
                                            >
                                                Áp dụng
                                            </button>
                                        </form>

                                        <h3 className="font-bold mt-4 mb-2">Lọc theo đánh giá</h3>
                                        {[5, 4, 3, 2, 1].map((value) => (
                                            <div
                                                key={value}
                                                className="flex text-yellow-500 cursor-pointer mb-1"
                                                onClick={() => onClickRating(value)}
                                            >
                                                {[...Array(value)].map((_, i) => (
                                                    <AiFillStar key={i} />
                                                ))}
                                                {[...Array(5 - value)].map((_, i) => (
                                                    <AiOutlineStar key={i} />
                                                ))}
                                            </div>
                                        ))}
                                        <button
                                            onClick={resetFilter}
                                            className="mt-4 bg-red-500 text-white w-full py-2 rounded-md"
                                        >
                                            Xóa tất cả
                                        </button>
                                    </div>

                                    {/* Danh sách sản phẩm */}
                                    <div className="sm:w-9/12 w-full">
                                        <div className="flex justify-between mb-4">
                                            <select
                                                onChange={handleSortPrice}
                                                className="border p-2 rounded-md"
                                                value={sortPrice}
                                            >
                                                <option value="">Sắp xếp</option>
                                                <option value="low-to-high">Giá: Thấp - Cao</option>
                                                <option value="high-to-low">Giá: Cao - Thấp</option>
                                            </select>
                                            <div className="flex gap-2">
                                                <BsFillGridFill
                                                    className={`cursor-pointer ${styles === "grid" && "text-blue-500"}`}
                                                    onClick={() => setStyles("grid")}
                                                />
                                                <FaThList
                                                    className={`cursor-pointer ${styles === "list" && "text-blue-500"}`}
                                                    onClick={() => setStyles("list")}
                                                />
                                            </div>
                                        </div>
                                        <ShopProduct styles={styles} products={products} />
                                        <Pagination
                                            currentPageNumber={pageNumber}
                                            setCurrentPageNumber={setPageNumber}
                                            totalItem={totalProducts}
                                            parPage={parPage}
                                        />
                                    </div>
                                </div>
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ShopProfile;

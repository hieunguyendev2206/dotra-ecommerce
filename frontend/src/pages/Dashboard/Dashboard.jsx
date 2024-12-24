/* eslint-disable no-unused-vars */
import {useState} from "react";
import icons from "../../assets/icons";
import {useDispatch} from "react-redux";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";

const Dashboard = () => {
    const {FaList, BsHeart, BsChat, RxDashboard, TfiLock, FiShoppingCart} = icons;
    const [filterShow, setFilterShow] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {pathname} = useLocation();

    return (<div className="bg-white">
            <Header/>
            <div className="bg-slate-200 mt-5">
                <div className="w-[90%] mx-auto pt-5 md-lg:block hidden">
                    <div>
                        <button
                            onClick={() => setFilterShow(!filterShow)}
                            className="text-center py-3 px-3 bg-red-500 text-white rounded-md"
                        >
                            <FaList/>
                        </button>
                    </div>
                </div>
                <div className="h-full mx-auto">
                    <div className="py-8 flex md-lg:w-[90%] mx-auto relative">
                        <div
                            className={`rounded-md z-50 md-lg:absolute ${filterShow ? "-left-4" : "-left-[360px]"} w-[270px] ml-4 bg-white`}
                        >
                            <ul className=" text-slate-600 p-4">
                                <li>
                                    <Link
                                        to="/dashboard"
                                        className={`flex justify-start items-center ${pathname === "/dashboard" ? "text-red-700 font-semibold" : "text-gray-700"} gap-2 p-5`}
                                    >
                                        <span>
                                          <RxDashboard size={20}/>
                                        </span>
                                        <span className="block">Bảng điều khiển</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/dashboard/my-orders"
                                        className={`flex justify-start items-center ${pathname === "/dashboard/my-orders" ? "text-red-700 font-semibold" : "text-gray-700"} gap-2 p-5`}
                                    >
                                        <span>
                                          <FiShoppingCart size={20}/>
                                        </span>
                                        <span className="block">Đơn hàng của tôi</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/dashboard/my-wishlist"
                                        className={`flex justify-start items-center ${pathname === "/dashboard/my-wishlist" ? "text-red-700 font-semibold" : "text-gray-700"} gap-2 p-5`}
                                    >
                                        <span>
                                          <BsHeart size={20}/>
                                        </span>
                                        <span className="block">Danh sách yêu thích</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/dashboard/chat"
                                        className={`flex justify-start items-center ${pathname === "/dashboard/chat" ? "text-red-700 font-semibold" : "text-gray-700"} gap-2 p-5`}
                                    >
                                        <span>
                                          <BsChat size={20}/>
                                        </span>
                                        <span className="block">Liên hệ</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/dashboard/profile"
                                        className={`flex justify-start items-center ${pathname === "/dashboard/profile" ? "text-red-700 font-semibold" : "text-gray-700"} gap-2 p-5`}
                                    >
                                        <span>
                                            <TfiLock size={20}/>
                                        </span>
                                        <span>Hồ sơ cá nhân</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="w-[calc(100%-270px)] md-lg:w-full">
                            <div className="mx-4 md-lg:mx-0">
                                <Outlet/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>);
};

export default Dashboard;

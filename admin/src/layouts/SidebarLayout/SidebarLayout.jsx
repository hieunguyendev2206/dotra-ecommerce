/* eslint-disable react/prop-types */
import {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../store/reducers/auth.reducers";
import getNavbars from "../../navigation/index";
import icons from "../../assets/icons";

const SidebarLayout = ({showSidebar, setShowSidebar}) => {
    const [allNavbar, setAllNavbar] = useState([]);
    const {pathname} = useLocation();
    const {role} = useSelector((state) => state.auth);
    const {LuLogOut} = icons;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const navbars = getNavbars(role);
        setAllNavbar(navbars);
    }, [role]);

    return (<div>
        <div
            onClick={() => setShowSidebar(false)}
            className={`fixed duration-200 ${!showSidebar ? "invisible" : "visible"} w-screen h-screen bg-[#22292f80] top-0 left-0 z-50`}
        ></div>
        <div
            className={`w-[260px] fixed z-50 top-0 h-screen shadow-[0_0_15px_0_rgb(34_41_47_/_5%)] bg-[#dae1e7] md:bg-white transition-all ${showSidebar ? "left-0" : "-left-[260px] lg:left-0"}`}
        >
            <div className="h-[70px] flex justify-center items-center">
                <Link to="/" className="w-[180px] h-[50px]">
                    <img
                        src="/src/assets/logo/logo.png"
                        alt="logo"
                        className="w-full h-full"
                    />
                </Link>
            </div>
            <div className="px-[16px] mt-5 ">
                <ul>
                    {allNavbar.map((n, i) => (<li key={i} className="mb-6">
                        <Link
                            to={n.path}
                            className={`${pathname === n.path ? "bg-slate-600 shadow-indigo-500/30 text-white text-base duration-500 rounded-xl mt-2" : "text-gray-700 font-normal duration-200"} px-[12px] py-[9px] rounded-sm flex justify-start items-center gap-[12px] hover:pl-6 transition-all w-full mb-1`}
                        >
                            <span>{n.icon}</span>
                            <span>{n.title}</span>
                        </Link>
                    </li>))}
                    <li>
                        <button
                            onClick={() => dispatch(logout({navigate, role}))}
                            className="text-white font-normal duration-200 px-[19px] py-[9px] bg-gray-700 rounded-md flex justify-start items-center gap-[12px] hover:pl-6 transition-all"
                        >
                            <span>
                                <LuLogOut size={20}/>
                            </span>
                            <span>Đăng Xuất</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>);
};

export default SidebarLayout;

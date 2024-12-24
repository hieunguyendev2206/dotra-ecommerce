/* eslint-disable react/prop-types */
import {useDispatch, useSelector} from "react-redux";
import icons from "../../assets/icons";
import {Link, useNavigate} from "react-router-dom";
import {logout} from "../../store/reducers/auth.reducers";

const HeaderLayout = ({showSidebar, setShowSidebar}) => {
    const {FaList, FaRegUser, LuLogOut} = icons;
    const {role, user_info} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    return (<div className="fixed top-0 left-0 w-full z-40">
        <div
            className="ml-0 top-0 lg:ml-[260px] bg-white  h-[65px] flex justify-between lg:justify-end items-center text-gray-700 px-5 transition-all">
            <div
                onClick={() => setShowSidebar(!showSidebar)}
                className={`flex justify-start lg:hidden rounded-sm cursor-pointer ${showSidebar ? `hidden` : ``}`}
            >
                <FaList size={28} color="black"/>
            </div>
            <div className="flex justify-center items-center gap-8 relative">
                <div className="flex justify-center items-center">
                    <div className="flex flex-col mr-5">
                        <h2 className="text-sm font-bold">{user_info.name}</h2>
                        <span className="text-[14px] font-normal"><b>Vai trò: </b>{user_info.role}</span>
                    </div>
                    <div className="flex justify-center items-center gap-3">
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0}>
                                <img
                                    src={user_info?.image}
                                    alt="picture"
                                    className="w-[45px] h[45px] rounded-full overflow-hidden object-cover"
                                />
                            </div>
                            <ul
                                tabIndex={0}
                                className="dropdown-content z-[1] menu p-2 shadow bg-white rounded-box w-52"
                            >
                                <li>
                                    <Link to="/">
                                        <FaRegUser size={17} className="mr-2"/>
                                        <span>Thông tin cá nhân</span>
                                    </Link>
                                </li>
                                <li>
                                    <div onClick={() => dispatch(logout({navigate, role}))}>
                                        <LuLogOut size={17} className="mr-2"/>
                                        <span>Đăng xuất</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>);
};

export default HeaderLayout;

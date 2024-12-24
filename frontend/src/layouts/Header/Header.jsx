/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Modal} from "flowbite-react";
import {useDispatch, useSelector} from "react-redux";
import {get_categories} from "../../store/reducers/home.reducers";
import {
    customer_login,
    customer_logout,
    customer_register,
    message_clear,
} from "../../store/reducers/customer.reducers";
import {get_cart} from "../../store/reducers/cart.reducers";
import PropagateLoader from "react-spinners/PropagateLoader";
import {toast} from "react-toastify";
import icons from "../../assets/icons";
import path from "../../constants/path";
import {get_wishlist} from "../../store/reducers/wishlist.reducers";
import {FaSearch} from "react-icons/fa";


const getOauthGoogleUrl = () => {
    const {VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_AUTHORIZED_REDIRECT_URI} =
        import.meta.env;
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const params = {
        client_id: VITE_GOOGLE_CLIENT_ID,
        redirect_uri: VITE_GOOGLE_AUTHORIZED_REDIRECT_URI,
        response_type: "code",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
        prompt: "consent",
    };
    const queryParams = new URLSearchParams(params).toString();
    return `${rootUrl}?${queryParams}`;
};

const googleLogin = getOauthGoogleUrl();

const Header = () => {
    const {
        AiOutlineMail,
        AiFillHeart,
        FaFacebook,
        GrInstagram,
        BsTwitter,
        BsGithub,
        MdOutlineKeyboardArrowDown,
        FaUser,
        FaRegUser,
        FaLock,
        FaList,
        FaCartShopping,
        IoIosCall,
        FcGoogle,
        FiLock,
        AiOutlineEye,
        AiOutlineEyeInvisible,
        RxAvatar,
        LuLogOut,
    } = icons;

    const user = false;
    const [showSideBar, setShowSideBar] = useState(true);
    const [categoryShow, setCategoryShow] = useState(true);
    const [visible, setVisible] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [category, setCategory] = useState("");
    const [stateLogin, setStateLogin] = useState({
        email: "",
        password: "",
    });
    const [stateRegister, setStateRegister] = useState({
        name: "",
        email: "",
        password: "",
        avatar: "",
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {categories} = useSelector((state) => state.home);
    const {loading, success_message, error_message, userInfo} = useSelector(
        (state) => state.customer
    );
    const {cart_product_count} = useSelector((state) => state.cart);
    const {total_wishlist} = useSelector((state) => state.wishlist);

    useEffect(() => {
        dispatch(get_categories());
    }, [dispatch]);

    const {pathname} = useLocation();

    const [openModalLogin, setOpenModalLogin] = useState(false);
    const [openModalRegister, setOpenModalRegister] = useState(false);

    const [searchResults, setSearchResults] = useState([]); // Kết quả tìm kiếm
    const [showResults, setShowResults] = useState(false); // Ẩn/hiện kết quả tìm kiếm

    // Hàm gọi API khi thay đổi từ khóa tìm kiếm
    const handleSearch = async (value) => {
        setSearchValue(value);

        if (!value.trim()) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        try {
            let response;
            [response] = await Promise.all([api.get("/home/search-products", {params: {searchValue: value}})]);
            setSearchResults(response.data);
            setShowResults(true);
        } catch (error) {
            console.error("Lỗi tìm kiếm sản phẩm:", error);
        }
    };

    // Chuyển hướng đến trang tìm kiếm chi tiết
    const handleOnClickSearch = () => {
        navigate(`/products/search?category=${category}&searchValue=${searchValue}`);
        setShowResults(false);
    };

    function onCloseModalLogin() {
        setOpenModalLogin(false);
    }

    function onCloseModalRegister() {
        setOpenModalRegister(false);
    }

    // const handleOnClickSearch = () => {
    //     navigate(
    //         `/products/search?category=${category}&searchValue=${searchValue}`
    //     );
    // };

    const handleFileInput = (event) => {
        const file = event.target.files[0]; // Lấy tệp đầu tiên từ danh sách đã chọn
        if (file) {
            setAvatarFile(file); // Lưu tệp đã chọn vào trạng thái 'avatar'
            setStateRegister({
                ...stateRegister,
                [event.target.name]: event.target.files[0],
            });
        }
    };

    const handleInputRegister = (event) => {
        const formData = event.target.name;
        setStateRegister({
            ...stateRegister,
            [formData]: event.target.value,
        });
    };

    const handleSubmitRegister = (event) => {
        event.preventDefault();

        // Kiểm tra các trường dữ liệu trước khi gửi
        if (!stateRegister.password || stateRegister.password.trim() === "") {
            toast.error("Mật khẩu không được để trống.");
            return;
        }

        const formData = new FormData();
        formData.append("name", stateRegister.name);
        formData.append("email", stateRegister.email);
        formData.append("password", stateRegister.password); // Thêm mật khẩu vào FormData
        formData.append("avatar", avatarFile || ""); // Nếu không có avatar, gửi chuỗi rỗng

        // Kiểm tra dữ liệu trước khi dispatch
        console.log("FormData:", [...formData.entries()]);

        dispatch(customer_register(formData))
            .unwrap()
            .then(() => {
                toast.success("Đăng ký thành công!");
                setOpenModalRegister(false);
            })
            .catch((error) => {
                toast.error(error || "Đăng ký thất bại. Vui lòng thử lại.");
            });
    };

    const handleInputLogin = (event) => {
        const formData = event.target.name;
        setStateLogin({
            ...stateLogin,
            [formData]: event.target.value,
        });
    };

    const handleSubmitLogin = (event) => {
        event.preventDefault();
        dispatch(customer_login(stateLogin));
    };

    useEffect(() => {
        if (success_message) {
            toast.success(success_message);
            dispatch(message_clear());
            setOpenModalRegister(false);
            setStateRegister({
                name: "",
                email: "",
                password: "",
                avatar: "",
            });
            setOpenModalLogin(false);
            setStateLogin({
                email: "",
                password: "",
            });
        }
        if (error_message) {
            toast.error(error_message);
            dispatch(message_clear());
        }
    }, [success_message, error_message, dispatch]);

    const handleLogout = () => {
        dispatch(customer_logout());
        navigate("/");
        window.location.reload();
    };

    const redirectCartPage = () => {
        if (userInfo) {
            navigate("/cart");
        } else {
            toast.error("Bạn cần đăng nhập để xem giỏ hàng");
        }
    };

    useEffect(() => {
        if (userInfo) {
            dispatch(get_cart(userInfo.id));
            dispatch(get_wishlist(userInfo.id));
        }
    }, [dispatch, userInfo]);

    const redirectWishlistPage = () => {
        if (userInfo) {
            navigate("/dashboard/my-wishlist");
        } else {
            toast.error("Bạn cần đăng nhập để xem danh sách yêu thích");
        }
    };

    return (
        <div className="w-full bg-white">
            <div className="header-top bg-[#eeeeee] md-lg:hidden">
                <div className="w-[85%] lg:w-[90%] mx-auto">
                    <div className="flex w-full justify-between items-center h-[50px] text-slate-500">
                        <ul className="flex justify-start items-center gap-8">
                            <li className="flex relative justify-center items-center gap-2 text-sm after:absolute after:h-[18px] after:w-[1px] after:bg-[#afafaf] after:-right-[16px]">
                              <span>
                                <AiOutlineMail size={20}/>
                              </span>
                                <span className="font-medium">autofeedback003@gmail.com</span>
                            </li>
                            <span className="font-medium">Welcome to Dotra.</span>
                        </ul>
                        <div>
                            <div className="flex justify-center items-center gap-10">
                                <div className="flex justify-center items-center gap-4">
                                    <a href="https://www.facebook.com/hieunguyen2003t/">
                                        <FaFacebook color="blue"/>
                                    </a>
                                    <a href="https://www.instagram.com/azzuki__">
                                        <GrInstagram className="text-pink-700"/>
                                    </a>
                                    <a href="https://twitter.com/">
                                        <BsTwitter className="text-blue-400"/>
                                    </a>
                                    <a href="https://github.com/hieunguyendev2206">
                                        <BsGithub color="black"/>
                                    </a>
                                </div>
                                <div
                                    className="flex relative justify-center items-center gap-2 text-sm after:absolute after:h-[18px] after:w-[1px] after:bg-[#afafaf] after:-right-[4px]"></div>
                                {userInfo ? (
                                    <div className="dropdown dropdown-end">
                                        <div
                                            tabIndex={0}
                                            className="flex cursor-pointer justify-center items-center gap-2 text-sm "
                                            to="/dashboard"
                                        >
                                          <span>
                                            <img
                                                src={userInfo.avatar}
                                                alt="avatar"
                                                className="rounded-full w-8 h-8"
                                            />
                                          </span>
                                            <span className="font-medium mt-1">{userInfo.name}</span>
                                        </div>
                                        <ul tabIndex={0}
                                            className="dropdown-content z-[1] menu p-2 shadow bg-white rounded-box w-52"
                                        >
                                            <li>
                                                <Link to="/dashboard">
                                                    <FaRegUser size={17} className="mr-2"/>
                                                    <span>Thông tin cá nhân</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <div onClick={handleLogout}>
                                                    <LuLogOut size={17} className="mr-2"/>
                                                    <span>Đăng xuất</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                ) : (
                                    <>
                                        <div className="cursor-pointer text-sm">
                                            <div
                                                onClick={() => setOpenModalLogin(true)}
                                                className="flex justify-center items-center gap-2"
                                            >
                                                  <span>
                                                    <FaLock/>
                                                  </span>
                                                  <span className="font-medium mt-1">ĐĂNG NHẬP</span>
                                            </div>
                                            <Modal
                                                show={openModalLogin}
                                                size="xl"
                                                onClose={onCloseModalLogin}
                                                popup
                                            >
                                                <Modal.Header/>
                                                <Modal.Body>
                                                    <div className="space-y-5">
                                                        <div className="flex justify-center">
                                                            <img
                                                                className=" w-[180px] h-[50px]"
                                                                src="/src/assets/logo/logo.png"
                                                                alt=""
                                                            />
                                                        </div>
                                                        <h3 className="flex justify-center text-xl font-bold text-gray-900 dark:text-white">
                                                            ĐĂNG NHẬP
                                                        </h3>
                                                        <form onSubmit={handleSubmitLogin}>
                                                            <div className="">
                                                                <label htmlFor="email" className="font-light">
                                                                    Email
                                                                </label>
                                                                <div
                                                                    className="flex overflow-hidden items-center mt-2 w-full rounded-lg border border-gray-400 transition-all focus-within:shadow-lg focus-within:border-orange-500">
                                                                    <div
                                                                        className="flex justify-center items-center pl-6">
                                                                        <AiOutlineMail
                                                                            className="w-6 h-6 pointer-events-none"/>
                                                                    </div>
                                                                    <input
                                                                        type="text"
                                                                        name="email"
                                                                        onChange={handleInputLogin}
                                                                        value={stateLogin.email}
                                                                        placeholder="Nhập địa chỉ email"
                                                                        className="px-4 py-3 w-full focus:outline-none font-light border-0 focus:ring-0"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="pt-4">
                                                                <label
                                                                    htmlFor="password"
                                                                    className="font-light"
                                                                >
                                                                    Mật khẩu
                                                                </label>
                                                                <div
                                                                    className="flex mt-2 w-full rounded-lg border border-gray-400 transition-all focus-within:shadow-lg focus-within:border-orange-500">
                                                                    <div
                                                                        className="flex justify-center items-center pl-6">
                                                                        <FiLock
                                                                            className="w-6 h-6 pointer-events-none"/>
                                                                    </div>
                                                                    <input
                                                                        type={visible ? "text" : "password"}
                                                                        name="password"
                                                                        onChange={handleInputLogin}
                                                                        value={stateLogin.password}
                                                                        placeholder="Nhập mật khẩu"
                                                                        className="relative px-4 py-3 w-full focus:outline-none font-light border-0 focus:ring-0"
                                                                        required
                                                                    />
                                                                    {visible ? (
                                                                        <AiOutlineEye
                                                                            className="mt-[10px] mr-3 cursor-pointer"
                                                                            size={30}
                                                                            onClick={() => setVisible(false)}
                                                                        />
                                                                    ) : (
                                                                        <AiOutlineEyeInvisible
                                                                            className="mt-[10px] mr-3 cursor-pointer"
                                                                            size={30}
                                                                            onClick={() => setVisible(true)}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between items-center pt-4">
                                                                <div className="flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        name="remember"
                                                                        id="remember"
                                                                        className="w-5 h-5 text-orange-500 bg-white rounded border border-gray-400 focus:outline-none focus:ring-orange-500"
                                                                    />
                                                                    <label
                                                                        htmlFor="remember"
                                                                        className="pl-4 font-light text-gray-900"
                                                                    >
                                                                        Remember me
                                                                    </label>
                                                                </div>
                                                                <a
                                                                    href="#"
                                                                    className="text-teal-500 hover:text-teal-600"
                                                                >
                                                                    Quên mật khẩu
                                                                </a>
                                                            </div>
                                                            <div className="pt-5">
                                                                <button
                                                                    type="submit"
                                                                    className="py-3 px-8 w-full text-white bg-orange-500 rounded-lg shadow-lg hover:bg-orange-600 focus:ring-4 focus:ring-red-100 focus:outline-none"
                                                                >
                                                                    {loading ? (
                                                                        <PropagateLoader
                                                                            color="white"
                                                                            size={10}
                                                                            className="mb-3"
                                                                        />
                                                                    ) : (
                                                                        "Đăng nhập"
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </form>
                                                        <div className="flex">
                                                          <span className="font-light text-center text-gray-500">
                                                            Bạn chưa có tài khoản? {""}
                                                          </span>
                                                            <div
                                                                onClick={() => setOpenModalRegister(true)}
                                                                className="font-normal text-teal-500 hover:text-teal-600 cursor-pointer">
                                                                Tạo tài khoản
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="flex gap-y-4 gap-x-6 justify-center items-center whitespace-nowrap">
                                                            <Link
                                                                to={googleLogin}
                                                                className="flex items-center justify-center flex-1 py-3 px-2 rounded-lg bg-white border border-gray-400 whitespace-nowrap hover:bg-gray-50 focus:outline-none focus:ring-gray-100 focus:ring-4"
                                                            >
                                                                <FcGoogle className="w-6 h-6"/>
                                                                <span className="pl-3 font-medium text-gray-900">
                                                                  Đăng nhập bằng Google
                                                                </span>
                                                            </Link>
                                                            <button
                                                                className="flex items-center justify-center flex-1 py-3 px-2 rounded-lg bg-blue-500 whitespace-nowrap hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-gray-100">
                                                                <FaFacebook color="white" className="w-6 h-6"/>
                                                                <span className="pl-3 font-medium text-white">
                                                                  Đăng nhập bằng Facebook
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </Modal.Body>
                                            </Modal>
                                        </div>

                                        <div className="cursor-pointer gap-2 text-sm">
                                            <div
                                                onClick={() => setOpenModalRegister(true)}
                                                className="flex justify-center items-center gap-2"
                                            >
                                                <span>
                                                  <FaLock/>
                                                </span>
                                                <span className="font-medium mt-1">ĐĂNG KÝ</span>
                                            </div>
                                            <Modal
                                                show={openModalRegister}
                                                size="xl"
                                                onClose={onCloseModalRegister}
                                                popup
                                            >
                                                <Modal.Header/>
                                                <Modal.Body>
                                                    <div className="space-y-5">
                                                        <div className="flex justify-center">
                                                            <img
                                                                className=" w-[180px] h-[50px]"
                                                                src="/src/assets/logo/logo.png"
                                                                alt=""
                                                            />
                                                        </div>
                                                        <h3 className="flex justify-center text-xl font-bold text-gray-900 dark:text-white">
                                                            ĐĂNG KÝ
                                                        </h3>
                                                        <form onSubmit={handleSubmitRegister}>
                                                            <div>
                                                                <label htmlFor="name" className="font-light">
                                                                    Họ và tên
                                                                </label>
                                                                <div
                                                                    className="flex overflow-hidden items-center mt-2 w-full rounded-lg border border-gray-400 transition-all focus-within:shadow-lg focus-within:border-orange-500">
                                                                    <div
                                                                        className="flex justify-center items-center pl-6">
                                                                        <FaRegUser
                                                                            className="w-6 h-6 pointer-events-none"/>
                                                                    </div>
                                                                    <input
                                                                        type="text"
                                                                        name="name"
                                                                        onChange={handleInputRegister}
                                                                        value={stateRegister.name}
                                                                        placeholder="Nhập họ và tên"
                                                                        className="px-4 py-3 w-full focus:outline-none font-light border-0 focus:ring-0"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="">
                                                                <label htmlFor="email" className="font-light">
                                                                    Email
                                                                </label>
                                                                <div
                                                                    className="flex overflow-hidden items-center mt-2 w-full rounded-lg border border-gray-400 transition-all focus-within:shadow-lg focus-within:border-orange-500">
                                                                    <div
                                                                        className="flex justify-center items-center pl-6">
                                                                        <AiOutlineMail
                                                                            className="w-6 h-6 pointer-events-none"/>
                                                                    </div>
                                                                    <input
                                                                        type="text"
                                                                        name="email"
                                                                        onChange={handleInputRegister}
                                                                        value={stateRegister.email}
                                                                        placeholder="Nhập địa chỉ email"
                                                                        className="px-4 py-3 w-full focus:outline-none font-light border-0 focus:ring-0"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="pt-4">
                                                                <label
                                                                    htmlFor="password"
                                                                    className="font-light"
                                                                >
                                                                    Mật khẩu
                                                                </label>
                                                                <div
                                                                    className="flex mt-2 w-full rounded-lg border border-gray-400 transition-all focus-within:shadow-lg focus-within:border-orange-500">
                                                                    <div
                                                                        className="flex justify-center items-center pl-6">
                                                                        <FiLock
                                                                            className="w-6 h-6 pointer-events-none"/>
                                                                    </div>
                                                                    <input
                                                                        type={visible ? "text" : "password"}
                                                                        name="password"
                                                                        onChange={handleInputRegister}
                                                                        value={stateRegister.password}
                                                                        placeholder="Nhập mật khẩu"
                                                                        className="relative px-4 py-3 w-full focus:outline-none font-light border-0 focus:ring-0"
                                                                        required
                                                                    />
                                                                    {visible ? (
                                                                        <AiOutlineEye
                                                                            className="mt-[10px] mr-3 cursor-pointer"
                                                                            size={30}
                                                                            onClick={() => setVisible(false)}
                                                                        />
                                                                    ) : (
                                                                        <AiOutlineEyeInvisible
                                                                            className="mt-[10px] mr-3 cursor-pointer"
                                                                            size={30}
                                                                            onClick={() => setVisible(true)}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="pt-4">
                                                                <label htmlFor="avatar" className="block">
                                                                    Avatar
                                                                </label>
                                                                <div className="mt-2 flex items-center">
                                                                  <span
                                                                      className=" w-10 h-10 rounded-full overflow-hidden">
                                                                    {avatarFile ? (
                                                                        <img
                                                                            src={URL.createObjectURL(avatarFile)}
                                                                            alt="avatar"
                                                                            className="h-full w-full object-cover rounded-full"
                                                                        />
                                                                    ) : (
                                                                        <RxAvatar
                                                                            color="gray"
                                                                            className="w-10 h-10"
                                                                        />
                                                                    )}
                                                                  </span>
                                                                    <label
                                                                        htmlFor="file-input"
                                                                        className="ml-5 flex items-center justify-center px-4 py-2 border border-orange-600 rounded-md shadow-sm text-sm font-medium text-orange-500 bg-white hover:bg-orange-500 hover:text-white"
                                                                    >
                                                                        <span>Tải ảnh lên</span>
                                                                        <input
                                                                            type="file"
                                                                            name="avatar"
                                                                            id="file-input"
                                                                            accept=".jpg,.jpeg,.png,.jpg"
                                                                            onChange={handleFileInput}
                                                                            className="sr-only"
                                                                        />
                                                                    </label>
                                                                </div>
                                                            </div>

                                                            <div className="pt-5">
                                                                <button
                                                                    type="submit"
                                                                    className="py-3 px-8 w-full text-white bg-orange-500 rounded-lg shadow-lg hover:bg-orange-600 focus:ring-4 focus:ring-red-100 focus:outline-none"
                                                                >
                                                                    {loading ? (
                                                                        <PropagateLoader
                                                                            color="white"
                                                                            size={10}
                                                                            className="mb-3"
                                                                        />
                                                                    ) : (
                                                                        "Đăng ký"
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </form>

                                                        <div
                                                            className="flex gap-y-4 gap-x-6 justify-center items-center whitespace-nowrap">
                                                            <Link
                                                                to={googleLogin}
                                                                className="flex items-center justify-center flex-1 py-3 px-2 rounded-lg bg-white border border-gray-400 whitespace-nowrap hover:bg-gray-50 focus:outline-none focus:ring-gray-100 focus:ring-4"
                                                            >
                                                                <FcGoogle className="w-6 h-6"/>
                                                                <span className="pl-3 font-medium text-gray-900">
                                                                  Đăng nhập bằng Google
                                                                </span>
                                                            </Link>
                                                            <button
                                                                className="flex items-center justify-center flex-1 py-3 px-2 rounded-lg bg-blue-500 whitespace-nowrap hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-gray-100">
                                                                <FaFacebook color="white" className="w-6 h-6"/>
                                                                <span className="pl-3 font-medium text-white">
                                                                  Đăng nhập bằng Facebook
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </Modal.Body>
                                            </Modal>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-white">
                <div className="w-[85%] lg:w-[90%] mx-auto">
                    <div className="h-[80px] md-lg:h-[100px] flex justify-between items-center flex-wrap">
                        <div className="md-lg:w-full w-3/12 md-lg:pt-4">
                            <div className="flex justify-between items-center">
                                <Link to="/" className="w-[180px] h-[50px]">
                                    <img
                                        src="/src/assets/logo/logo.png"
                                        alt="logo"
                                        className="w-full h-full"
                                    />
                                </Link>
                                <div
                                    onClick={() => setShowSideBar(false)}
                                    className="justify-center items-center w-[30px] h-[30px] bg-white text-slate-600 border border-slate-600 rounded-sm cursor-pointer lg:hidden md-lg:flex xl:hidden hidden"
                                >
                                  <span>
                                    <FaList/>
                                  </span>
                                </div>
                            </div>
                        </div>
                        <div className="md-lg:w-full w-9/12">
                            <div className="flex justify-between md-lg:justify-center items-center flex-wrap pl-8">
                                <ul className="flex justify-start items-start gap-8 text-sm font-semibold uppercase md-lg:hidden">
                                    <li>
                                        <Link
                                            to={path.home}
                                            className={`p-2 block ${
                                                pathname === "/" ? "text-red-500" : "text-slate-600"
                                            }`}
                                        >
                                            Trang chủ
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to={path.shop}
                                            className={`p-2 block ${
                                                pathname === "/shop" ? "text-blue-500" : "text-slate-600"
                                            }`}
                                        >
                                            Cửa hàng
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className={`p-2 block ${
                                                pathname === "/blog"
                                                    ? "text-[#33cc33]"
                                                    : "text-slate-600"
                                            }`}
                                         to="/blog">
                                            Blog
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className={`p-2 block ${
                                                pathname === "/contact"
                                                    ? "text-[#33cc33]"
                                                    : "text-slate-600"
                                            }`}
                                        >
                                            Liên hệ
                                        </Link>
                                    </li>
                                </ul>
                                <div className="flex md-lg:hidden justify-center items-center gap-5">
                                    <div className="flex justify-center gap-5">
                                        <div
                                            onClick={redirectWishlistPage}
                                            className="relative flex justify-center items-center cursor-pointer w-[40px] h-[40px] rounded-full bg-gray-300"
                                        >
                                          <span>
                                            <AiFillHeart size={20} className="text-red-500"/>
                                          </span>
                                            <div
                                                className="w-[20px] h-[20px] absolute bg-green-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px]">
                                                {total_wishlist}
                                            </div>
                                        </div>
                                        <div
                                            onClick={redirectCartPage}
                                            className="relative flex justify-center items-center cursor-pointer w-[40px] h-[40px] rounded-full bg-gray-300"
                                        >
                                          <span>
                                            <FaCartShopping size={20} className="text-red-500"/>
                                          </span>
                                            {cart_product_count !== 0 ? (
                                                <div
                                                    className="w-[20px] h-[20px] absolute bg-green-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px]">
                                                    {cart_product_count}
                                                </div>
                                            ) : (
                                                <div
                                                    className="w-[20px] h-[20px] absolute bg-green-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px]">
                                                    0
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden md-lg:block">
                <div
                    onClick={() => setShowSideBar(true)}
                    className={`fixed duration-200 transition-all ${
                        showSideBar ? "invisible" : "visible"
                    } hidden md-lg:block w-screen h-screen bg-[rgba(0,0,0,0.5)] top-0 left-0 z-20`}
                ></div>
                <div
                    className={`w-[300px] z-[9999] transition-all duration-200 fixed ${
                        showSideBar ? "-left-[300px]" : "left-0"
                    } top-0 overflow-y-auto bg-white h-screen py-6 px-8`}
                >
                    <div className="flex justify-start flex-col gap-6">
                        <Link to="/" className="w-[180px] h-[50px]">
                            <img
                                src="/src/assets/logo/logo.png"
                                alt="logo"
                                className="w-full h-full"
                            />
                        </Link>
                        {/* Hiển thị thông tin người dùng */}
                        <div className="flex justify-start items-center gap-4">
                            {userInfo ? (
                                <div className="flex items-center gap-3">
                                    <img
                                        src={userInfo.avatar || "/src/assets/img/default-avatar.png"}
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <h2 className="text-sm font-semibold text-slate-700">{userInfo.name}</h2>
                                        <Link to="/dashboard" className="text-xs text-blue-500 hover:underline">
                                            Xem thông tin cá nhân
                                        </Link>
                                        <div className="mt-2">
                                            <button
                                                onClick={handleLogout}
                                                className="text-red-500 text-xs hover:underline"
                                            >
                                                Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div
                                        onClick={() => {
                                            setShowSideBar(true);
                                            setOpenModalLogin(true);
                                        }}
                                        className="flex items-center gap-2 text-sm cursor-pointer text-blue-500 hover:underline"
                                    >
                                        <FaLock/>
                                        <span>Đăng nhập</span>
                                    </div>

                                    <div
                                        onClick={() => {
                                            setShowSideBar(true);
                                            setOpenModalRegister(true);
                                        }}
                                        className="flex items-center gap-2 text-sm cursor-pointer text-green-500 hover:underline"
                                    >
                                        <FaRegUser/>
                                        <span>Đăng ký</span>
                                    </div>

                                </>
                            )}
                        </div>
                        <ul className="flex flex-col justify-start items-start gap-8 text-md font-semibold uppercase">
                            <li>
                                <Link
                                    className={`py-2 block ${
                                        pathname === "/" ? "text-red-500" : "text-slate-600"
                                    }`}
                                 to="/">
                                Trang chủ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className={`py-2 block ${
                                        pathname === "/shop" ? "text-red-500" : "text-slate-600"
                                    }`}
                                    to="/shop"
                                >
                                    Cửa hàng
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className={`py-2 block ${
                                        pathname === "/blog" ? "text-[#33cc33]" : "text-slate-600"
                                    }`}
                                    to="/blog"
                                >
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className={`py-2 block ${
                                        pathname === "/contact" ? "text-[#33cc33]" : "text-slate-600"
                                    }`}
                                >
                                    Liên hệ
                                </Link>
                            </li>
                        </ul>
                        <div className="flex justify-start items-center gap-4">
                            <a href="https://www.facebook.com/hieunguyen2003t/">
                                <FaFacebook/>
                            </a>
                            <a href="https://www.instagram.com/azzuki__">
                                <GrInstagram/>
                            </a>
                            <a href="https://twitter.com/">
                                <BsTwitter/>
                            </a>
                            <a href="https://github.com/hieunguyendev2206">
                                <BsGithub/>
                            </a>
                        </div>
                        <div className="w-full flex justify-end md-lg:justify-start gap-3 items-center">
                            <div
                                className="w-[48px] h-[48px] rounded-full flex bg-[#f5f5f5] justify-center items-center">
                                <span>
                                    <IoIosCall/>
                                </span>
                            </div>
                            <div className="flex justify-end flex-col gap-1">
                                <h2 className="text-sm font-medium text-slate-700">
                                    0939061835
                                </h2>
                                <span className="text-xs">Hỗ trợ 24/7</span>
                            </div>
                        </div>
                        <ul className="flex flex-col justify-start items-start gap-3 text-[#1c1c1c]">
                            <li className="flex justify-start items-center gap-2  text-sm">
                                <span>
                                    <AiOutlineMail/>
                                </span>
                                <span className="font-medium">hieunguyendev2206@gmail.com</span>
                            </li>
                            <span className="text-sm font-medium">Welcome to SnapDeal</span>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="w-[85%] lg:w-[90%] mx-auto">
                <div className="flex w-full flex-wrap md-lg:gap-8">
                    <div className="w-3/12 md-lg:w-full">
                        <div className="bg-white relative">
                            <div
                                onClick={() => setCategoryShow(!categoryShow)}
                                className="h-[50px] bg-red-500 text-white flex justify-center md-lg:justify-between md-lg:px-6 items-center gap-3 font-bold text-md cursor-pointer rounded-md"
                            >
                                <div className="flex justify-center items-center gap-3">
                                    <span>
                                      <FaList/>
                                    </span>
                                    <span className="font-normal">Danh Mục Sản Phẩm</span>
                                </div>
                                <span className="pt-1">
                                  <MdOutlineKeyboardArrowDown size={20}/>
                                </span>
                            </div>
                            <div
                                className={`${
                                    categoryShow ? "max-h-0" : "max-h-[1000px]"
                                } overflow-hidden transition-all md-lg:relative duration-500 absolute z-[99999] bg-white w-full`}
                            >
                                <ul className="py-2 text-slate-600 font-medium h-full overflow-auto">
                                    {categories.map((c) => {
                                        return (
                                            <Link
                                                to={`/products?category=${c.category_name}`}
                                                key={c._id}
                                                className="flex justify-start items-center gap-2 px-[24px] py-[6px]"
                                            >
                                                <img
                                                    src={c.image}
                                                    className="w-[40px] h-[40px] overflow-hidden"
                                                    alt={c.name}
                                                />
                                                <span className="text-sm block">{c.category_name}</span>
                                            </Link>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="w-9/12 pl-8 md-lg:pl-0 md-lg:w-full">
                        <div className="flex flex-wrap w-full justify-between items-center md-lg:gap-6">
                            <div className="w-8/12 md-lg:w-full">
                                <div className="flex relative">
                                    <select
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-[180px] text-slate-600 bg-transparent p-[13px] h-full border-y border-red-600 outline-0 rounded-l-md"
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories.map((c) => (
                                            <option key={c._id} value={c.category_name}>
                                                {c.category_name}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        value={searchValue}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="w-full relative bg-transparent text-slate-500 border-red-600 outline-0 p-[15.5px] h-full rounded-r-md"
                                        placeholder="Tìm kiếm sản phẩm..."
                                    />
                                    <button
                                        onClick={handleOnClickSearch}
                                        className="bg-red-500 right-0 absolute px-6 h-full text-white flex items-center rounded-r-md"
                                    >
                                        <FaSearch/>
                                    </button>
                                    {showResults && (
                                        <div
                                            className="absolute top-full left-0 w-full bg-white border border-gray-200 shadow-lg z-10 max-h-[300px] overflow-y-auto">
                                            {searchResults.length > 0 ? (
                                                searchResults.map((product) => (
                                                    <div
                                                        key={product._id}
                                                        className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-4"
                                                        onClick={() => {
                                                            navigate(`/products/${product._id}`);
                                                            setShowResults(false);
                                                        }}
                                                    >
                                                        <img src={product.image} alt={product.product_name}
                                                             className="w-10 h-10 object-cover"/>
                                                        <span>{product.product_name}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-3 text-gray-500">Không tìm thấy sản phẩm nào</div>
                                            )}
                                        </div>
                                    )}
                                </div>

                            </div>
                            <div className="w-4/12 block md-lg:hidden pl-2 md-lg:w-full md-lg:pl-0">
                                <div className="w-full flex justify-end md-lg:justify-start gap-3 items-center">
                                    <div
                                        className="w-[48px] h-[48px] rounded-full flex bg-[#f5f5f5] justify-center items-center">
                                      <span>
                                        <IoIosCall/>
                                      </span>
                                    </div>
                                    <div className="flex justify-end flex-col gap-1">
                                        <h2 className="text-md font-medium text-slate-700">
                                            0939061835
                                        </h2>
                                        <span className="text-sm">Hỗ trợ 24/7</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;

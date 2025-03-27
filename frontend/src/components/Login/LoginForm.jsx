import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { customer_login, message_clear } from "../../store/reducers/customer.reducers";
import { toast } from "react-toastify";
import PropagateLoader from "react-spinners/PropagateLoader";
import Logo from "../../assets/logo/logo.png";
import icons from "../../assets/icons";

const LoginForm = ({ onClose }) => {
    const {
        AiOutlineMail,
        FiLock,
        AiOutlineEye,
        AiOutlineEyeInvisible,
        FcGoogle,
        FaFacebook,
    } = icons;

    const [visible, setVisible] = useState(false);
    const [stateLogin, setStateLogin] = useState({
        email: "",
        password: "",
    });

    const dispatch = useDispatch();
    const { loading, success_message, error_message } = useSelector(
        (state) => state.customer
    );

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

    const getOauthGoogleUrl = () => {
        const { VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_AUTHORIZED_REDIRECT_URI } =
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

    return (
        <div className="space-y-5">
            <div className="flex justify-center">
                <img className="w-[180px] h-[50px]" src={Logo} alt="" />
            </div>
            <h3 className="flex justify-center text-xl font-bold text-gray-900 dark:text-white">
                ĐĂNG NHẬP
            </h3>
            <form onSubmit={handleSubmitLogin}>
                <div className="">
                    <label htmlFor="email" className="font-light">
                        Email
                    </label>
                    <div className="flex overflow-hidden items-center mt-2 w-full rounded-lg border border-gray-400 transition-all focus-within:shadow-lg focus-within:border-orange-500">
                        <div className="flex justify-center items-center pl-6">
                            <AiOutlineMail className="w-6 h-6 pointer-events-none" />
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
                    <label htmlFor="password" className="font-light">
                        Mật khẩu
                    </label>
                    <div className="flex mt-2 w-full rounded-lg border border-gray-400 transition-all focus-within:shadow-lg focus-within:border-orange-500">
                        <div className="flex justify-center items-center pl-6">
                            <FiLock className="w-6 h-6 pointer-events-none" />
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
                        <label htmlFor="remember" className="pl-4 font-light text-gray-900">
                            Remember me
                        </label>
                    </div>
                    <a href="#" className="text-teal-500 hover:text-teal-600">
                        Quên mật khẩu
                    </a>
                </div>
                <div className="pt-5">
                    <button
                        type="submit"
                        className="py-3 px-8 w-full text-white bg-orange-500 rounded-lg shadow-lg hover:bg-orange-600 focus:ring-4 focus:ring-red-100 focus:outline-none"
                    >
                        {loading ? (
                            <PropagateLoader color="white" size={10} className="mb-3" />
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
                    onClick={() => {
                        onClose();
                        // Thêm logic để mở form đăng ký ở đây
                    }}
                    className="font-normal text-teal-500 hover:text-teal-600 cursor-pointer"
                >
                    Tạo tài khoản
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                    to={googleLogin}
                    className="flex items-center justify-center w-full sm:w-auto py-3 px-4 rounded-lg bg-white border border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-gray-100 focus:ring-4 transition-all duration-200"
                >
                    <FcGoogle className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="pl-2 sm:pl-3 text-sm sm:text-base font-medium text-gray-900">
                        Google
                    </span>
                </Link>
                <button className="flex items-center justify-center w-full sm:w-auto py-3 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-200">
                    <FaFacebook color="white" className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="pl-2 sm:pl-3 text-sm sm:text-base font-medium text-white">
                        Facebook
                    </span>
                </button>
            </div>
        </div>
    );
};

export default LoginForm; 
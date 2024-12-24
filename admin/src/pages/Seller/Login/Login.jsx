/* eslint-disable react/no-unknown-property */
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {message_clear, seller_login} from "../../../store/reducers/auth.reducers";
import PropagateLoader from "react-spinners/PropagateLoader";
import icons from "../../../assets/icons";
import path from "../../../constants/path";
import {toast} from "react-toastify";

const Login = () => {
    const {
        FcGoogle,
        FaFacebook,
        AiOutlineMail,
        FiLock,
        AiOutlineEye,
        AiOutlineEyeInvisible,
    } = icons;
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {loading, success_message, error_message} = useSelector(
        (state) => state.auth
    );
    const [state, setState] = useState({
        email: "",
        password: "",
    });

    const handleInput = (event) => {
        const formData = event.target.name;
        setState({
            ...state,
            [formData]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(seller_login(state));
    };

    useEffect(() => {
        if (success_message) {
            toast.success(success_message);
            dispatch(message_clear());
            navigate(path.home);
        }
        if (error_message) {
            toast.error(error_message);
            dispatch(message_clear());
        }
    }, [success_message, error_message, dispatch, navigate]);

    return (
        <div className="flex flex-col lg:flex-row justify-center lg:justify-between min-h-screen font-sans bg-white">
            <div className="hidden lg:block lg:w-1/2 bg-center bg-cover bg-hero-pattern"></div>
            <div className="flex-1 mx-auto max-w-full p-4 sm:max-w-md lg:max-w-2xl">
                <div className="flex flex-col px-4 sm:px-8 lg:px-14 xl:px-24">
                    <svg viewBox="0 0 132 34" fill="none" xmlns="http://www.w3.org/2000/svg"
                         className="self-center w-32 md:self-end">
                        <path
                            d="M42.324 7.4H51.228C53.356 7.4 55.232 7.81067 56.856 8.632C58.4987 9.43467 59.768 10.5733 60.664 12.048C61.5787 13.5227 62.036 15.24 62.036 17.2C62.036 19.16 61.5787 20.8773 60.664 22.352C59.768 23.8267 58.4987 24.9747 56.856 25.796C55.232 26.5987 53.356 27 51.228 27H42.324V7.4ZM51.004 23.276C52.964 23.276 54.5227 22.7347 55.68 21.652C56.856 20.5507 57.444 19.0667 57.444 17.2C57.444 15.3333 56.856 13.8587 55.68 12.776C54.5227 11.6747 52.964 11.124 51.004 11.124H46.86V23.276H51.004ZM72.3168 27.224C70.7301 27.224 69.3021 26.8973 68.0328 26.244C66.7821 25.572 65.8021 24.648 65.0928 23.472C64.3835 22.296 64.0288 20.9613 64.0288 19.468C64.0288 17.9747 64.3835 16.64 65.0928 15.464C65.8021 14.288 66.7821 13.3733 68.0328 12.72C69.3021 12.048 70.7301 11.712 72.3168 11.712C73.9035 11.712 75.3221 12.048 76.5728 12.72C77.8235 13.3733 78.8035 14.288 79.5128 15.464C80.2221 16.64 80.5768 17.9747 80.5768 19.468C80.5768 20.9613 80.2221 22.296 79.5128 23.472C78.8035 24.648 77.8235 25.572 76.5728 26.244C75.3221 26.8973 73.9035 27.224 72.3168 27.224ZM72.3168 23.64C73.4368 23.64 74.3515 23.2667 75.0608 22.52C75.7888 21.7547 76.1528 20.7373 76.1528 19.468C76.1528 18.1987 75.7888 17.1907 75.0608 16.444C74.3515 15.6787 73.4368 15.296 72.3168 15.296C71.1968 15.296 70.2728 15.6787 69.5448 16.444C68.8168 17.1907 68.4528 18.1987 68.4528 19.468C68.4528 20.7373 68.8168 21.7547 69.5448 22.52C70.2728 23.2667 71.1968 23.64 72.3168 23.64ZM92.5685 26.272C92.1391 26.5893 91.6071 26.832 90.9725 27C90.3565 27.1493 89.7125 27.224 89.0405 27.224C87.2298 27.224 85.8391 26.7667 84.8685 25.852C83.8978 24.9373 83.4125 23.5933 83.4125 21.82V8.604H87.7805V12.272H91.5045V15.632H87.7805V21.764C87.7805 22.3987 87.9391 22.8933 88.2565 23.248C88.5738 23.584 89.0311 23.752 89.6285 23.752C90.3005 23.752 90.8978 23.5653 91.4205 23.192L92.5685 26.272ZM99.2075 13.924C99.7302 13.196 100.43 12.6453 101.308 12.272C102.204 11.8987 103.23 11.712 104.388 11.712V15.744C103.902 15.7067 103.576 15.688 103.408 15.688C102.157 15.688 101.177 16.0427 100.468 16.752C99.7582 17.4427 99.4035 18.488 99.4035 19.888V27H95.0355V11.936H99.2075V13.924ZM122.136 11.936V27H117.964V25.264C116.881 26.5707 115.313 27.224 113.26 27.224C111.841 27.224 110.553 26.9067 109.396 26.272C108.257 25.6373 107.361 24.732 106.708 23.556C106.055 22.38 105.728 21.0173 105.728 19.468C105.728 17.9187 106.055 16.556 106.708 15.38C107.361 14.204 108.257 13.2987 109.396 12.664C110.553 12.0293 111.841 11.712 113.26 11.712C115.183 11.712 116.685 12.3187 117.768 13.532V11.936H122.136ZM114.016 23.64C115.117 23.64 116.032 23.2667 116.76 22.52C117.488 21.7547 117.852 20.7373 117.852 19.468C117.852 18.1987 117.488 17.1907 116.76 16.444C116.032 15.6787 115.117 15.296 114.016 15.296C112.896 15.296 111.972 15.6787 111.244 16.444C110.516 17.1907 110.152 18.1987 110.152 19.468C110.152 20.7373 110.516 21.7547 111.244 22.52C111.972 23.2667 112.896 23.64 114.016 23.64Z"
                            fill="#303030"/>
                        <path
                            d="M127.832 27.224C127.067 27.224 126.423 26.9627 125.9 26.44C125.377 25.9173 125.116 25.264 125.116 24.48C125.116 23.6773 125.377 23.0333 125.9 22.548C126.423 22.044 127.067 21.792 127.832 21.792C128.597 21.792 129.241 22.044 129.764 22.548C130.287 23.0333 130.548 23.6773 130.548 24.48C130.548 25.264 130.287 25.9173 129.764 26.44C129.241 26.9627 128.597 27.224 127.832 27.224Z"
                            fill="#F4694C"/>
                        <path fillRule="evenodd" clipRule="evenodd"
                              d="M7.96885 30.5542C8.57462 30.962 9.36932 30.8197 9.93511 30.3581C11.5884 29.009 13.6997 28.2 16 28.2C18.3003 28.2 20.4116 29.009 22.0649 30.3581C22.6307 30.8197 23.4254 30.962 24.0312 30.5542C27.8728 27.9682 30.4 23.5792 30.4 18.6C30.4 10.6471 23.9529 4.20001 16 4.20001C8.04711 4.20001 1.60001 10.6471 1.60001 18.6C1.60001 23.5792 4.12718 27.9682 7.96885 30.5542ZM21.5426 13.8C24.0059 18.0667 20.9267 23.4 16 23.4C11.0733 23.4 7.99408 18.0667 10.4574 13.8L16 4.20001L21.5426 13.8Z"
                              fill="#40B2B7"/>
                    </svg>
                    <div className="pt-5 pb-3">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-wide leading-loose whitespace-nowrap text-center">
                            Xin chào, Chào mừng trở lại!
                        </h1>
                        <div
                            className="flex flex-col sm:flex-row gap-y-4 gap-x-6 justify-center items-center pt-5 whitespace-nowrap">
                            <button
                                className="flex items-center justify-center w-full sm:w-auto py-3 px-2 rounded-lg bg-white border border-gray-400 whitespace-nowrap hover:bg-gray-50 focus:outline-none focus:ring-gray-100 focus:ring-4">
                                <FcGoogle className="w-6 h-6"/>
                                <span className="pl-3 font-medium text-gray-900">
                                  Đăng nhập bằng Google
                                </span>
                            </button>
                            <button
                                className="flex items-center justify-center w-full sm:w-auto py-3 px-2 rounded-lg bg-blue-500 whitespace-nowrap hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-gray-100">
                                <FaFacebook color="white" className="w-6 h-6"/>
                                <span className="pl-3 font-medium text-white">
                                  Đăng nhập bằng Facebook
                                </span>
                            </button>
                        </div>
                        <div className="flex justify-between items-center pt-6">
                            <hr className="w-full border-gray-400"/>
                            <span className="px-4 font-light tracking-wider text-gray-500">
                              hoặc
                            </span>
                            <hr className="w-full border-gray-400"/>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="pt-6">
                                <label htmlFor="email" className="font-light">
                                    Email
                                </label>
                                <div
                                    className="flex overflow-hidden items-center mt-2 w-full rounded-lg border border-gray-400 transition-all focus-within:shadow-lg focus-within:border-orange-500">
                                    <div className="flex justify-center items-center pl-6">
                                        <AiOutlineMail className="w-6 h-6 pointer-events-none"/>
                                    </div>
                                    <input
                                        type="text"
                                        name="email"
                                        onChange={handleInput}
                                        value={state.email}
                                        placeholder="Nhập địa chỉ email"
                                        className="px-4 py-3 w-full focus:outline-none font-light border-0 focus:ring-0"
                                    />
                                </div>
                            </div>
                            <div className="pt-4">
                                <label htmlFor="password" className="font-light">
                                    Mật khẩu
                                </label>
                                <div
                                    className="flex mt-2 w-full rounded-lg border border-gray-400 transition-all focus-within:shadow-lg focus-within:border-orange-500">
                                    <div className="flex justify-center items-center pl-6">
                                        <FiLock className="w-6 h-6 pointer-events-none"/>
                                    </div>
                                    <input
                                        type={visible ? "text" : "password"}
                                        name="password"
                                        onChange={handleInput}
                                        value={state.password}
                                        placeholder="Nhập mật khẩu"
                                        className="relative px-4 py-3 w-full focus:outline-none font-light border-0 focus:ring-0"
                                        required
                                    />
                                    {visible ? (
                                        <AiOutlineEye
                                            className="mt-4 mr-3 cursor-pointer"
                                            size={35}
                                            onClick={() => setVisible(false)}
                                        />
                                    ) : (
                                        <AiOutlineEyeInvisible
                                            className="mt-4 mr-3 cursor-pointer"
                                            size={35}
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
                                        Ghi nhớ mật khẩu
                                    </label>
                                </div>
                                <a href="#" className="text-teal-500 hover:text-teal-600">
                                    Quên mật khẩu
                                </a>
                            </div>
                            <div className="pt-8">
                                <button
                                    type="submit"
                                    className="py-4 px-8 w-full text-white bg-orange-500 rounded-lg shadow-lg hover:bg-orange-600 focus:ring-4 focus:ring-red-100 focus:outline-none"
                                >
                                    {loading ? (
                                        <PropagateLoader color="white" size={10} className="mb-3"/>
                                    ) : (
                                        "Đăng nhập"
                                    )}
                                </button>
                            </div>
                        </form>
                        <div className="pt-4 flex">
                            <div className="font-light text-center text-gray-500">
                                Bạn chưa có tài khoản?{" "}
                                <Link
                                    to={path.seller_register}
                                    className="font-normal text-teal-500 hover:text-teal-600"
                                >
                                    Tạo tài khoản
                                </Link>
                            </div>
                        </div>
                        <div className="pt-4 flex">
                            <div className="font-light text-center text-gray-500">
                                Bạn là admin?{" "}
                                <Link
                                    to={path.admin_login}
                                    className="font-normal text-teal-500 hover:text-teal-600 uppercase"
                                >
                                    Đăng nhập Admin
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

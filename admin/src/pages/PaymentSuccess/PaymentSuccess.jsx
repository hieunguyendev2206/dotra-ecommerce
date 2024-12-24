/* eslint-disable no-unused-vars */
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {activate_stripe_connect_account, message_clear,} from "../../store/reducers/payment.reducers";
import {useEffect} from "react";
import {get_user_info} from "../../store/reducers/auth.reducers";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {success_message, error_message} = useSelector(
        (state) => state.payment
    );
    const queryParams = new URLSearchParams(window.location.search);
    const activeCode = queryParams.get("activeCode");

    useEffect(() => {
        if (activeCode) {
            dispatch(activate_stripe_connect_account(activeCode));
        }
    }, [activeCode, dispatch]);

    const redirectToHome = () => {
        dispatch(message_clear());
        navigate("/seller/dashboard/profile");
        dispatch(get_user_info());
    };

    return (
        <div className="bg-gray-100 h-screen w-screen flex justify-center items-center">
            <div className="bg-white p-6 md:mx-auto">
                {error_message ? (
                    <>
                        <div className="flex justify-center items-center">
                            <img
                                src="/src/assets/img/payment_error.jpg"
                                alt=""
                                className="w-[340px] h-[280px]"
                            />
                        </div>
                        <svg
                            fill="#ff0000"
                            viewBox="-1.7 0 20.4 20.4"
                            xmlns="http://www.w3.org/2000/svg"
                            className="cf-icon-svg w-20 h-20 mx-auto my-6"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth={0}/>
                            <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z"/>
                            </g>
                        </svg>
                        <div className="text-center">
                            <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                                Tạo tài khoản thanh toán thất bại
                            </h3>
                            <p className="text-gray-600 my-2">
                                Vui lòng cung cấp đầy đủ thông tin để tạo tài khoản thanh toán
                            </p>
                            <p> Chúc bạn một ngày tuyệt vời! </p>
                            <div className="py-10 text-center">
                                <button
                                    onClick={redirectToHome}
                                    className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg"
                                >
                                    Quay lại
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    success_message && (
                        <>
                            <div className="flex justify-center items-center">
                                <img
                                    src="/src/assets/img/payment_success.png"
                                    alt=""
                                    className="w-[340px] h-[280px]"
                                />
                            </div>
                            <svg
                                viewBox="0 0 24 24"
                                className="text-green-600 w-16 h-16 mx-auto my-6"
                            >
                                <path
                                    fill="currentColor"
                                    d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
                                />
                            </svg>
                            <div className="text-center">
                                <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                                    Tạo tài khoản thanh toán thành công
                                </h3>
                                <p className="text-gray-600 my-2">
                                    Cảm ơn bạn đã hoàn tất quá trình đăng ký tài khoản thanh toán
                                </p>
                                <p> Chúc bạn một ngày tuyệt vời! </p>
                                <div className="py-10 text-center">
                                    <button
                                        onClick={redirectToHome}
                                        className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg"
                                    >
                                        Quay lại
                                    </button>
                                </div>
                            </div>
                        </>
                    )
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;

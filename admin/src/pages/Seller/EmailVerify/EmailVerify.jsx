import {useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {message_clear, verify_email,} from "../../../store/reducers/auth.reducers";
import {toast} from "react-toastify";
import path from "../../../constants/path";

const EmailVerify = () => {
    const {emailToken} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {success_message, error_message} = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(verify_email(emailToken));
    }, []);

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

    const redirect = () => {
        navigate(path.seller_login);
    };

    return (
        <div className="bg-gray-100 h-screen w-screen flex justify-center items-center">
            <div className="bg-white p-6 md:mx-auto">
                <div className="flex justify-center items-center">
                    <img
                        src="/src/assets/img/verify_email_success.jpg"
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
                        Xác thực Email thành công
                    </h3>
                    <p className="text-gray-600 my-2">
                        Cảm ơn bạn đã hoàn tất quá trình đăng ký tài khoản
                    </p>
                    <p> Chúc bạn một ngày tuyệt vời! </p>
                    <div className="py-10 text-center">
                        <button
                            onClick={redirect}
                            className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg"
                        >
                            Đăng nhập ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerify;

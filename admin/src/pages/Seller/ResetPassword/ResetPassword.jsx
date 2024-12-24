/* eslint-disable no-unused-vars */
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import path from "../../../constants/path";
import {message_clear, reset_password,} from "../../../store/reducers/auth.reducers";
import {Card} from "flowbite-react";
import icons from "../../../assets/icons";

const ResetPassword = () => {
    const {AiOutlineEye, AiOutlineEyeInvisible} = icons;
    const {emailToken} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);
    const [visibleNewPassword, setVisibleNewPassword] = useState(false);
    const [resetPassword, setResetPassword] = useState({
        new_password: "",
        confirm_password: "",
    });
    const {success_message, error_message} = useSelector((state) => state.auth);

    const submitResetPassword = (e) => {
        e.preventDefault();
        dispatch(reset_password({...resetPassword, emailToken}));
    };

    useEffect(() => {
        if (success_message) {
            toast.success(success_message);
            dispatch(message_clear());
            setResetPassword({
                new_password: "",
                confirm_password: "",
            })
            navigate(path.seller_login);
        }

        if (error_message) {
            toast.error(error_message);
            dispatch(message_clear());
        }
    }, [success_message, error_message, dispatch, navigate]);

    return (
        <div className="bg-gray-100 h-screen w-screen flex justify-center items-center">
            <div className="bg-white p-6 md:mx-auto grid grid-cols-2">
                <Card
                    className="max-w-sm"
                    imgSrc="/src/assets/img/reset_password.jpg"
                ></Card>
                <div className="mt-16 w-full">
                    <h3 className="text-2xl font-semibold text-center mb-4">
                        Đặt lại mật khẩu
                    </h3>
                    <form onSubmit={submitResetPassword}>
                        <div className="flex flex-col justify-center items-center ml-4 w-full">
                            <div className="relative flex items-center w-full">
                                <input
                                    onChange={(e) =>
                                        setResetPassword({
                                            ...resetPassword,
                                            new_password: e.target.value,
                                        })
                                    }
                                    value={resetPassword.new_password}
                                    placeholder="Nhập mật khẩu mới..."
                                    type={visibleConfirmPassword ? "text" : "password"}
                                    name="old_password"
                                    className="rounded-md border-black input-md input-bordered w-full"
                                />
                                {visibleConfirmPassword ? (
                                    <AiOutlineEye
                                        className="cursor-pointer absolute right-2"
                                        size={25}
                                        onClick={() => setVisibleConfirmPassword(false)}
                                    />
                                ) : (
                                    <AiOutlineEyeInvisible
                                        className="cursor-pointer absolute right-2"
                                        size={25}
                                        onClick={() => setVisibleConfirmPassword(true)}
                                    />
                                )}
                            </div>
                            <div className="relative flex items-center w-full mt-4">
                                <input
                                    onChange={(e) =>
                                        setResetPassword({
                                            ...resetPassword,
                                            confirm_password: e.target.value,
                                        })
                                    }
                                    value={resetPassword.confirm_password}
                                    name="new_password"
                                    placeholder="Nhập lại mật khẩu mới..."
                                    type={visibleNewPassword ? "text" : "password"}
                                    className="rounded-md border-black input-md input-bordered w-full"
                                />
                                {visibleNewPassword ? (
                                    <AiOutlineEye
                                        className="cursor-pointer absolute right-2"
                                        size={25}
                                        onClick={() => setVisibleNewPassword(false)}
                                    />
                                ) : (
                                    <AiOutlineEyeInvisible
                                        className="cursor-pointer absolute right-2"
                                        size={25}
                                        onClick={() => setVisibleNewPassword(true)}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="relative flex items-center justify-center w-full mt-4">
                            <button
                                type="submit"
                                className="w-[50%] bg-green-700 text-white rounded-md p-3"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;

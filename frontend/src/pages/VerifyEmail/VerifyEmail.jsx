import {Card} from "flowbite-react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import {message_clear, verify_email_customer,} from "../../store/reducers/customer.reducers";
import {toast} from "react-toastify";
import VerySuccesspic from "../../assets/img/success.png"

const VerifyEmail = () => {
    const {email_token} = useParams();
    const dispatch = useDispatch();
    const {success_message, error_message} = useSelector((state) => state.customer);

    useEffect(() => {
        dispatch(verify_email_customer(email_token));
    }, [dispatch, email_token]);

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

    return (<div className="flex justify-center items-center h-screen">
        <Card className="max-w-sm">
            <div className="flex flex-col items-center pb-10">
                <img
                    alt="Bonnie image"
                    height="96"
                    src={VerySuccesspic}
                    width="96"
                    className="mb-3 rounded-full shadow-lg"
                />
                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                    Email Đã Được Xác Thực
                </h5>
                <div className="mt-4 flex space-x-3 lg:mt-6">
                    <Link
                        to="/"
                        className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm
                                   font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4
                                   focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                    >
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        </Card>
    </div>);
};

export default VerifyEmail;

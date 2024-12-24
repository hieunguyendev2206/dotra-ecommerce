/* eslint-disable no-unused-vars */
import axios from "axios";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import confetti from "canvas-confetti";
import congratulationSound from "../../audio/congratulation.mp3";
import ReactH5AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const orderId = localStorage.getItem("orderId");

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const updatePayment = async () => {
        try {
            await axios.put(
                `https://dotra-ecommerce.onrender.com/api/payment/update-payment/${orderId}`,
                {},
                {withCredentials: true}
            );
            localStorage.removeItem("orderId");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        updatePayment();
    }, [updatePayment]);

    useEffect(() => {
        const duration = 10 * 1000;
        const animationEnd = Date.now() + duration;
        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const confettiParams = {
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            Index: 0,
        };

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            // bắn confetti từ trên
            confetti({
                ...confettiParams,
                particleCount: 100,
                origin: {x: Math.random(), y: 0}, // chỉnh vị trí bắt đầu ở trên
            });

            // bắn confetti từ dưới
            confetti({
                ...confettiParams,
                particleCount: 100,
                origin: {x: Math.random(), y: 1}, // chỉnh vị trí bắt đầu ở dưới
            });

            // bắn confetti từ bên trái
            confetti({
                ...confettiParams,
                particleCount: 100,
                origin: {x: 0, y: Math.random()}, // chỉnh vị trí bắt đầu ở bên trái
            });

            // bắn confetti từ bên phải
            confetti({
                ...confettiParams,
                particleCount: 100,
                origin: {x: 1, y: Math.random()}, // chỉnh vị trí bắt đầu ở bên phải
            });
        }, 250);
    }, []);

    const redirectToOrder = () => {
        navigate("/dashboard/my-orders");
    };

    return (
        <div className="bg-gray-100 h-screen w-screen flex justify-center items-center">
            <ReactH5AudioPlayer
                autoPlay
                src={congratulationSound}
                className="hidden"
            />
            <div className="bg-white p-6 md:mx-auto">
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
                    <h3 className="md:text-2xl text-xl text-gray-900 font-semibold text-center">
                        Thanh toán thành công
                    </h3>
                    <p className="text-gray-600 my-2">
                        Cảm ơn bạn đã hoàn tất quá trình thanh toán
                    </p>
                    <p> Chúc bạn một ngày tuyệt vời! </p>
                    <div className="py-10 text-center">
                        <button
                            onClick={redirectToOrder}
                            className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg"
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;

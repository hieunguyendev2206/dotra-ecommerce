import {useNavigate} from "react-router-dom";

const PaymentError = () => {
    const navigate = useNavigate();

    const redirectToOrder = () => {
        navigate("/dashboard/my-orders");
    };

    return (
        <div className="bg-gray-100 h-screen w-screen flex justify-center items-center">
            <div className="bg-white p-6 md:mx-auto">
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
                    <h3 className="md:text-2xl text-2xl text-gray-900 font-semibold text-center">
                        Thanh toán thất bại
                    </h3>
                    <p className="text-gray-600 my-2">
                        Vui lòng cung cấp đầy đủ thông tin để thực hiện thanh toán
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

export default PaymentError;

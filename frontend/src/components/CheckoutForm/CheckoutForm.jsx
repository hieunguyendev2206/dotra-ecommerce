/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {LinkAuthenticationElement, PaymentElement, useElements, useStripe,} from "@stripe/react-stripe-js";
import {useState} from "react";

const CheckoutForm = ({orderId}) => {
    localStorage.setItem("orderId", orderId);
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const paymentElementOptions = {
        layout: "tabs",
    };

    const submit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }
        setIsLoading(true);
        const {error} = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: "http://localhost:3000/order/confirm",
            },
        });
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("Error! Please try again.");
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={submit} id="payment-form">
            <LinkAuthenticationElement id="link-authentication-element"/>
            <PaymentElement id="payment-element" options={paymentElementOptions}/>
            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="px-10 mt-4 py-[6px] rounded-sm hover:shadow-red-500/20 hover:shadow-lg bg-red-500 text-white"
            >
                <span id="button-text">
                  {isLoading ? <div>Đang tải dữ liệu.....</div> : "Thanh toán ngay"}
                </span>
            </button>
            {message && <div>{message}</div>}
        </form>
    );
};

export default CheckoutForm;

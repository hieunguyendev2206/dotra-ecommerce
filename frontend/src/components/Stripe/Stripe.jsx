/* eslint-disable react/prop-types */
import axios from "axios";
import {loadStripe} from "@stripe/stripe-js";

const Stripe = ({orderId}) => {
    const createCheckoutSession = async () => {
        const stripe = await loadStripe("pk_test_51OvzNvRsSTvz81CpFbTIxRUqTGn1jGOCXH6MtbewSulVgUhHGvrkEwdkgooRNbpPwVTlGIuYRnOXZDqwmeK6eTsQ00M6KQzOsl");
        localStorage.setItem("orderId", orderId);
        try {
            const response = await axios.post(
                "http://localhost:5000/api/payment/create-checkout-session",
                {
                    orderId,
                },
                {
                    withCredentials: true,
                }
            );
            const sessionId = response.data.sessionId;
            await stripe.redirectToCheckout({sessionId});
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="">
            <button
                onClick={createCheckoutSession}
                className="px-10 py-[6px] rounded-sm hover:shadow-wrange-500/20 hover:shadow-lg bg-red-600 text-white"
            >
                Thanh toán ngay
            </button>
        </div>
    );
};

export default Stripe;

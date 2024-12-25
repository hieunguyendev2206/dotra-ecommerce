/* eslint-disable no-unused-vars */
import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Stripe from "../../components/Stripe";
import { formateCurrency } from "../../utils/formate";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StripeImage from "../../assets/img/stripe.png"
import VNPAYImage from "../../assets/img/vnpay.png"
import MoMoImage from "../../assets/img/momo.png"
import PaypalImage from "../../assets/logo/logopaypal.png"
import ZaloPayImage from "../../assets/logo/logozalo.png"

const Payment = () => {
    const [paymentMethod, setPaymentMethod] = useState("PayPal", "MoMo");

    const [loading, setLoading] = useState(false);
    const [qrCode, setQrCode] = useState(null); // State để lưu mã QR
    const {
        state: { orderId, price, items },
    } = useLocation();

    const initialOptions = {
        "client-id": "AXo5KWslpqqTDVyr1t0KKSSKC3TDdUySf6VjRB1yqlS6pBwgjB23GYM2y9NdN8c4Hp9M-Ctul-jkqdDg",
        currency: "USD",
        intent: "capture",
    };

    const handleVNPayPayment = async () => {
        try {
            setLoading(true); // Bắt đầu loading
            if (!price || isNaN(price) || price <= 0) {
                toast.error("Số tiền thanh toán không hợp lệ.");
                return;
            }

            // Gửi trực tiếp `orderId` mà không cần xử lý thêm
            const response = await axios.post("https://dotra-ecommerce.onrender.com/api/payment/create-vnpay-payment", {
                amount: price,
                orderInfo: orderId, // Sử dụng trực tiếp orderId làm orderInfo
            });

            if (response.data.paymentUrl) {
                // Điều hướng người dùng đến URL thanh toán
                window.location.href = response.data.paymentUrl;
            } else {
                toast.error("Không thể tạo URL thanh toán. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Error creating VNPay payment:", error);
            toast.error(error.response?.data?.error || "Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.");
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };

    const handleMoMoPayment = async () => {
        try {
            setLoading(true); // Bắt đầu loading
            const response = await axios.post("https://dotra-ecommerce.onrender.com/api/payment/create-momo-payment", {
                amount: price,
                orderId: orderId,
            });

            if (response.data.qrCodeUrl) {
                // Hiển thị mã QR để quét trong ứng dụng MoMo
                setQrCode(response.data.qrCodeUrl);
            } else if (response.data.paymentUrl) {
                // Điều hướng đến URL thanh toán MoMo (trường hợp không có QR code)
                window.open(response.data.paymentUrl, "_blank");
            } else {
                toast.error("Không thể tạo thanh toán MoMo.");
            }
        } catch (error) {
            console.error("Error creating MoMo payment:", error.message);
            toast.error("Lỗi tạo thanh toán MoMo.");
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };

    const handleZaloPayPayment = async () => {
        try {
            setLoading(true); // Bắt đầu loading
            const response = await axios.post("https://dotra-ecommerce.onrender.com/api/payment/create-zalopay-payment", {
                amount: price,
                orderId: orderId,
            });

            if (response.data.paymentUrl) {
                // Điều hướng sang giao diện cổng thanh toán của ZaloPay
                window.location.href = response.data.paymentUrl;
            } else {
                toast.error("Không thể tạo thanh toán ZaloPay.");
            }
        } catch (error) {
            console.error("Error creating ZaloPay payment:", error);
            toast.error("Lỗi tạo thanh toán ZaloPay!");
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };

    return (
        <div className="bg-white">
            <Header />
            <section className="bg-[#eeeeee]">
                <div className="w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto py-16 mt-4">
                    <div className="flex flex-wrap md:flex-col-reverse">
                        <div className="w-7/12 md:w-full">
                            <div className="pr-2 md:pr-0">
                                <div className="flex flex-wrap">
                                    <div
                                        onClick={() => setPaymentMethod("stripe")}
                                        className={`w-[20%] border-r cursor-pointer py-8 px-12 ${paymentMethod === "stripe" ? "bg-white" : "bg-slate-100"}`}
                                    >
                                        <div className="flex flex-col gap-[3px] justify-center items-center">
                                            <img src={StripeImage} alt="stripe" />
                                            <span className="text-slate-600">Stripe</span>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => setPaymentMethod("VnPay")}
                                        className={`w-[20%] border-r cursor-pointer py-8 px-12 ${paymentMethod === "VnPay" ? "bg-white" : "bg-slate-100"}`}
                                    >
                                        <div className="flex flex-col gap-[3px] justify-center items-center">
                                            <img src={VNPAYImage} alt="VnPay" />
                                            <span className="text-slate-600">VNPay</span>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => setPaymentMethod("MoMo")}
                                        className={`w-[20%] border-r cursor-pointer py-8 px-12 ${paymentMethod === "MoMo" ? "bg-white" : "bg-slate-100"}`}
                                    >
                                        <div className="flex flex-col gap-[3px] justify-center items-center">
                                            <img src={MoMoImage} alt="MoMo" />
                                            <span className="text-slate-600">MoMo</span>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => setPaymentMethod("PayPal")}
                                        className={`w-[20%] border-r cursor-pointer py-8 px-12 ${paymentMethod === "PayPal" ? "bg-white" : "bg-slate-100"}`}
                                    >
                                        <div className="flex flex-col gap-[3px] justify-center items-center">
                                            <img src={PaypalImage} alt="PayPal" />
                                            <span className="text-slate-600">PayPal</span>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => setPaymentMethod("ZaloPay")}
                                        className={`w-[20%] border-r cursor-pointer py-8 px-12 ${paymentMethod === "ZaloPay" ? "bg-white" : "bg-slate-100"}`}
                                    >
                                        <div className="flex flex-col gap-[3px] justify-center items-center">
                                            <img src={ZaloPayImage} alt="ZaloPay" />
                                            <span className="text-slate-600">ZaloPay</span>
                                        </div>
                                    </div>
                                </div>
                                {paymentMethod === "stripe" && (
                                    <div className="w-full px-4 py-8 bg-white shadow-sm">
                                        <Stripe orderId={orderId} />
                                    </div>
                                )}
                                {paymentMethod === "VnPay" && (
                                    <div className="w-full px-4 py-8 bg-white shadow-sm">
                                        <button className="px-10 py-[6px] rounded-sm hover:shadow-wrange-500/20 hover:shadow-lg bg-orange-600 text-white"
                                                onClick={handleVNPayPayment}
                                                disabled={loading}>
                                            {loading ? "Đang xử lý..." : "Thanh toán VNPay"}
                                        </button>
                                    </div>
                                )}
                                {paymentMethod === "MoMo" && (
                                    <div className="w-full px-4 py-8 bg-white shadow-sm">
                                        <button
                                            onClick={handleMoMoPayment}
                                            className="px-10 py-[6px] rounded-sm hover:shadow-wrange-500/20 hover:shadow-lg bg-pink-600 text-white"
                                            disabled={loading}
                                        >
                                            {loading ? "Đang xử lý..." : "Thanh toán qua MoMo"}
                                        </button>
                                        {qrCode && (
                                            <div className="mt-4">
                                                <p>Quét mã QR bằng ứng dụng MoMo để thanh toán:</p>
                                                <img src={qrCode} alt="MoMo QR Code" className="mx-auto" />
                                            </div>
                                        )}
                                    </div>
                                )}
                                {paymentMethod === "PayPal" && (
                                    <div className="w-full px-4 py-8 bg-white shadow-sm">
                                        <PayPalScriptProvider options={initialOptions}>
                                            <PayPalButtons
                                                style={{ layout: "vertical" }}
                                                createOrder={(data, actions) => {
                                                    return axios
                                                        .post("https://dotra-ecommerce.onrender.com/api/payment/create-paypal-order", {
                                                            amount: (price / 24000).toFixed(2),
                                                            currency: "USD",
                                                            orderId,
                                                        })
                                                        .then((res) => res.data.orderID);
                                                }}
                                                onApprove={(data, actions) => {
                                                    return axios
                                                        .post("https://dotra-ecommerce.onrender.com/api/payment/capture-paypal-order", {
                                                            orderID: data.orderID,
                                                        })
                                                        .then(() => {
                                                            toast.success("Thanh toán thành công! Chuyển hướng sau 2 giây...");
                                                            setTimeout(() => {
                                                                window.location.href = "/payment/payment-success";
                                                            }, 2000);
                                                        })
                                                        .catch((error) => {
                                                            console.error("Error capturing PayPal order:", error);
                                                            toast.error("Thanh toán thất bại! Vui lòng thử lại.");
                                                        });
                                                }}
                                                onError={(err) => {
                                                    toast.error("Thanh toán thất bại! Vui lòng thử lại.");
                                                    console.error(err);
                                                }}
                                            />
                                        </PayPalScriptProvider>
                                    </div>
                                )}
                                {paymentMethod === "ZaloPay" && (
                                    <div className="w-full px-4 py-8 bg-white shadow-sm">
                                        <button
                                            onClick={handleZaloPayPayment}
                                            className="px-10 py-[6px] rounded-sm hover:shadow-wrange-500/20 hover:shadow-lg bg-green-600 text-white"
                                            disabled={loading}
                                        >
                                            {loading ? "Đang xử lý..." : "Thanh toán qua ZaloPay"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-5/12 md:w-full">
                            <div className="pl-2 md:pl-0 md:mb-0">
                                <div className="bg-white shadow p-5 text-slate-600 flex flex-col gap-3">
                                    <h2 className="text-xl font-bold">Tóm Tắt Đơn Hàng</h2>
                                    <div className="flex justify-between items-center">
                                        <span>({items}) sản phẩm + phí vận chuyển</span>
                                        <span className="text-lg font-bold ml-2">{formateCurrency(price)}</span>
                                    </div>
                                    <div className="flex justify-between items-center font-semibold">
                                        <span className="text-xl">Tổng cộng</span>
                                        <span className="text-xl font-bold text-red-500 ml-2">{formateCurrency(price)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Payment;

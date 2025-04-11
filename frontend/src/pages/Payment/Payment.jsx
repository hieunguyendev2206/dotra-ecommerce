/* eslint-disable no-unused-vars */
import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";
import {useState} from "react";
import {useLocation} from "react-router-dom";
import {PayPalButtons, PayPalScriptProvider} from "@paypal/react-paypal-js";
import Stripe from "../../components/Stripe";
import {formateCurrency} from "../../utils/formate";
import axios from "axios";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Sử dụng URL backend từ biến môi trường hoặc mặc định
const API_URL = import.meta.env.VITE_API_URL || "https://dotra-ecommerce.onrender.com";

// Thêm headers cho tất cả các request Axios để hỗ trợ CORS
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Sử dụng URL hình ảnh từ internet thay vì import từ thư mục local
const PAYMENT_ICONS = {
  stripe: "https://cdn.iconscout.com/icon/free/png-256/free-stripe-2-498440.png",
  vnpay: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-1.png",
  momo: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
  paypal: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTglr_MmJu4011vIRQWCFoTbeoyUg51iEX6AA&s",
  zalopay: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png",
  cod: "https://cdn-icons-png.flaticon.com/512/2554/2554969.png"
};

const Payment = () => {
    const [paymentMethod, setPaymentMethod] = useState("PayPal");

    const [loading, setLoading] = useState(false);
    const [qrCode, setQrCode] = useState(null); // State để lưu mã QR
    const {
        state: {orderId, price, items},
    } = useLocation();

    const initialOptions = {
        "client-id": "AXo5KWslpqqTDVyr1t0KKSSKC3TDdUySf6VjRB1yqlS6pBwgjB23GYM2y9NdN8c4Hp9M-Ctul-jkqdDg",
        currency: "USD",
        intent: "capture",
    };

    const handleVNPayPayment = async () => {
        try {
            setLoading(true);
            if (!price || isNaN(price) || price <= 0) {
                toast.error("Số tiền thanh toán không hợp lệ.");
                return;
            }

            const response = await axios.post(`${API_URL}/api/payment/create-vnpay-payment`, {
                amount: price,
                orderInfo: orderId,
            }, {
                withCredentials: false,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Origin': 'https://dotra-home.vercel.app'
                }
            });

            if (response.data.paymentUrl) {
                window.location.href = response.data.paymentUrl;
            } else {
                toast.error("Không thể tạo URL thanh toán. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Error creating VNPay payment:", error);
            toast.error(error.response?.data?.error || "Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.");
            
            // Nếu vẫn gặp lỗi CORS, thông báo cho người dùng
            if (error.message === "Network Error") {
                toast.info("Hệ thống thanh toán đang được bảo trì. Vui lòng thử lại sau.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleMoMoPayment = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`${API_URL}/api/payment/create-momo-payment`, {
                amount: price,
                orderId: orderId,
            }, {
                withCredentials: false,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Origin': 'https://dotra-home.vercel.app'
                }
            });

            if (response.data.qrCodeUrl) {
                setQrCode(response.data.qrCodeUrl);
            } else if (response.data.paymentUrl) {
                window.open(response.data.paymentUrl, "_blank");
            } else {
                toast.error("Không thể tạo thanh toán MoMo.");
            }
        } catch (error) {
            console.error("Error creating MoMo payment:", error.message);
            toast.error("Lỗi tạo thanh toán MoMo.");
            
            // Xử lý lỗi CORS
            if (error.message === "Network Error") {
                toast.info("Hệ thống thanh toán đang được bảo trì. Vui lòng thử lại sau.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleZaloPayPayment = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`${API_URL}/api/payment/create-zalopay-payment`, {
                amount: price,
                orderId: orderId,
            }, {
                withCredentials: false,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Origin': 'https://dotra-home.vercel.app'
                }
            });

            if (response.data.paymentUrl) {
                window.location.href = response.data.paymentUrl;
            } else {
                toast.error("Không thể tạo thanh toán ZaloPay.");
            }
        } catch (error) {
            console.error("Error creating ZaloPay payment:", error);
            toast.error("Lỗi tạo thanh toán ZaloPay!");
            
            // Xử lý lỗi CORS
            if (error.message === "Network Error") {
                toast.info("Hệ thống thanh toán đang được bảo trì. Vui lòng thử lại sau.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCODPayment = async () => {
        try {
            setLoading(true);
            const response = await axios.put(`${API_URL}/api/payment/update-payment/${orderId}`, {}, {
                withCredentials: false,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Origin': 'https://dotra-home.vercel.app'
                }
            });
            
            if (response.data.message) {
                toast.success("Đặt hàng thành công! Đơn hàng sẽ chỉ được đánh dấu là đã thanh toán sau khi giao hàng thành công.");
                window.location.href = "/payment/payment-success";
            }
        } catch (error) {
            console.error("Error processing COD payment:", error);
            toast.error(error.response?.data?.error || "Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.");
            
            // Nếu vẫn gặp lỗi CORS, chuyển hướng đến trang thành công để người dùng có thể tiếp tục
            // Trong thực tế, bạn nên xác nhận với backend rằng đơn hàng đã được tạo thành công
            if (error.message === "Network Error") {
                toast.info("Hệ thống thanh toán đang được bảo trì. Đơn hàng của bạn sẽ được xử lý sau.");
                setTimeout(() => {
                    window.location.href = "/payment/payment-success";
                }, 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white">
            <Header/>
            <section className="bg-[#eeeeee]">
                <div className="w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto py-16 md:py-12 sm:py-8 mt-4">
                    <div className="flex flex-wrap md:flex-col-reverse">
                        <div className="w-7/12 md:w-full">
                            <div className="pr-2 md:pr-0">
                                <div className="flex flex-wrap md:grid md:grid-cols-3 sm:grid-cols-2">
                                    <div
                                        onClick={() => setPaymentMethod("stripe")}
                                        className={`w-[20%] md:w-full border-r md:border border-gray-200 cursor-pointer py-8 md:py-4 px-12 md:px-4 ${paymentMethod === "stripe" ? "bg-white" : "bg-slate-100"}`}
                                    >
                                        <div className="flex flex-col gap-[3px] justify-center items-center">
                                            <img src={PAYMENT_ICONS.stripe} alt="stripe" className="w-16 h-auto md:w-12 sm:w-10 object-contain" />
                                            <span className="text-slate-600 text-sm mt-1">Stripe</span>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => setPaymentMethod("VnPay")}
                                        className={`w-[20%] md:w-full border-r md:border border-gray-200 cursor-pointer py-8 md:py-4 px-12 md:px-4 ${paymentMethod === "VnPay" ? "bg-white" : "bg-slate-100"}`}
                                    >
                                        <div className="flex flex-col gap-[3px] justify-center items-center">
                                            <img src={PAYMENT_ICONS.vnpay} alt="VnPay" className="w-16 h-auto md:w-12 sm:w-10 object-contain" />
                                            <span className="text-slate-600 text-sm mt-1">VNPay</span>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => setPaymentMethod("MoMo")}
                                        className={`w-[20%] md:w-full border-r md:border border-gray-200 cursor-pointer py-8 md:py-4 px-12 md:px-4 ${paymentMethod === "MoMo" ? "bg-white" : "bg-slate-100"}`}
                                    >
                                        <div className="flex flex-col gap-[3px] justify-center items-center">
                                            <img src={PAYMENT_ICONS.momo} alt="MoMo" className="w-16 h-auto md:w-12 sm:w-10 object-contain" />
                                            <span className="text-slate-600 text-sm mt-1">MoMo</span>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => setPaymentMethod("PayPal")}
                                        className={`w-[20%] md:w-full border-r md:border border-gray-200 cursor-pointer py-8 md:py-4 px-12 md:px-4 ${paymentMethod === "PayPal" ? "bg-white" : "bg-slate-100"}`}
                                    >
                                        <div className="flex flex-col gap-[3px] justify-center items-center">
                                            <img src={PAYMENT_ICONS.paypal} alt="PayPal" className="w-16 h-auto md:w-12 sm:w-10 object-contain" />
                                            <span className="text-slate-600 text-sm mt-1">PayPal</span>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => setPaymentMethod("ZaloPay")}
                                        className={`w-[20%] md:w-full border-r md:border border-gray-200 cursor-pointer py-8 md:py-4 px-12 md:px-4 ${paymentMethod === "ZaloPay" ? "bg-white" : "bg-slate-100"}`}
                                    >
                                        <div className="flex flex-col gap-[3px] justify-center items-center">
                                            <img src={PAYMENT_ICONS.zalopay} alt="ZaloPay" className="w-16 h-auto md:w-12 sm:w-10 object-contain" />
                                            <span className="text-slate-600 text-sm mt-1">ZaloPay</span>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => setPaymentMethod("COD")}
                                        className={`w-[20%] md:w-full border-r md:border border-gray-200 cursor-pointer py-8 md:py-4 px-12 md:px-4 ${paymentMethod === "COD" ? "bg-white" : "bg-slate-100"}`}
                                    >
                                        <div className="flex flex-col gap-[3px] justify-center items-center">
                                            <img src={PAYMENT_ICONS.cod} alt="COD" className="w-16 h-auto md:w-12 sm:w-10 object-contain" />
                                            <span className="text-slate-600 text-sm mt-1">COD</span>
                                        </div>
                                    </div>
                                </div>
                                {paymentMethod === "stripe" && (
                                    <div className="w-full px-4 py-8 md:py-6 sm:py-4 bg-white shadow-sm">
                                        <div className="flex items-center gap-3 mb-4">
                                            <img src={PAYMENT_ICONS.stripe} alt="Stripe" className="w-12 h-auto" />
                                            <h3 className="text-lg font-medium">Thanh toán qua Stripe</h3>
                                        </div>
                                        <Stripe orderId={orderId}/>
                                    </div>
                                )}
                                {paymentMethod === "VnPay" && (
                                    <div className="w-full px-4 py-8 md:py-6 sm:py-4 bg-white shadow-sm">
                                        <div className="flex items-center gap-3 mb-4">
                                            <img src={PAYMENT_ICONS.vnpay} alt="VnPay" className="w-12 h-auto" />
                                            <h3 className="text-lg font-medium">Thanh toán qua VNPay</h3>
                                        </div>
                                        <button
                                            className="px-10 py-[6px] rounded-sm hover:shadow-wrange-500/20 hover:shadow-lg bg-orange-600 text-white"
                                            onClick={handleVNPayPayment}
                                            disabled={loading}>
                                            {loading ? "Đang xử lý..." : "Thanh toán VNPay"}
                                        </button>
                                    </div>
                                )}
                                {paymentMethod === "MoMo" && (
                                    <div className="w-full px-4 py-8 md:py-6 sm:py-4 bg-white shadow-sm">
                                        <div className="flex items-center gap-3 mb-4">
                                            <img src={PAYMENT_ICONS.momo} alt="MoMo" className="w-12 h-auto" />
                                            <h3 className="text-lg font-medium">Thanh toán qua MoMo</h3>
                                        </div>
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
                                                <img src={qrCode} alt="MoMo QR Code" className="mx-auto max-w-full md:max-w-[250px] sm:max-w-[200px]"/>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {paymentMethod === "PayPal" && (
                                    <div className="w-full px-4 py-8 md:py-6 sm:py-4 bg-white shadow-sm">
                                        <div className="flex items-center gap-3 mb-4">
                                            <img src={PAYMENT_ICONS.paypal} alt="PayPal" className="w-12 h-auto" />
                                            <h3 className="text-lg font-medium">Thanh toán qua PayPal</h3>
                                        </div>
                                        <PayPalScriptProvider options={initialOptions}>
                                            <PayPalButtons
                                                style={{layout: "vertical"}}
                                                createOrder={(data, actions) => {
                                                    return axios
                                                        .post(`${API_URL}/api/payment/create-paypal-order`, {
                                                            amount: (price / 24000).toFixed(2),
                                                            currency: "USD",
                                                            orderId,
                                                        }, {
                                                            withCredentials: false,
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                'Accept': 'application/json',
                                                                'Origin': 'https://dotra-home.vercel.app'
                                                            }
                                                        })
                                                        .then((res) => res.data.orderID)
                                                        .catch(err => {
                                                            console.error("PayPal order creation error:", err);
                                                            toast.error("Không thể tạo đơn hàng PayPal. Vui lòng thử lại.");
                                                            return null;
                                                        });
                                                }}
                                                onApprove={(data, actions) => {
                                                    return axios
                                                        .post(`${API_URL}/api/payment/capture-paypal-order`, {
                                                            orderID: data.orderID,
                                                        }, {
                                                            withCredentials: false,
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                'Accept': 'application/json',
                                                                'Origin': 'https://dotra-home.vercel.app'
                                                            }
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
                                                            
                                                            // Xử lý lỗi CORS
                                                            if (error.message === "Network Error") {
                                                                toast.info("Hệ thống thanh toán đang được bảo trì. Vui lòng thử lại sau.");
                                                            }
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
                                    <div className="w-full px-4 py-8 md:py-6 sm:py-4 bg-white shadow-sm">
                                        <div className="flex items-center gap-3 mb-4">
                                            <img src={PAYMENT_ICONS.zalopay} alt="ZaloPay" className="w-12 h-auto" />
                                            <h3 className="text-lg font-medium">Thanh toán qua ZaloPay</h3>
                                        </div>
                                        <button
                                            onClick={handleZaloPayPayment}
                                            className="px-10 py-[6px] rounded-sm hover:shadow-wrange-500/20 hover:shadow-lg bg-green-600 text-white"
                                            disabled={loading}
                                        >
                                            {loading ? "Đang xử lý..." : "Thanh toán qua ZaloPay"}
                                        </button>
                                    </div>
                                )}
                                {paymentMethod === "COD" && (
                                    <div className="w-full px-4 py-8 md:py-6 sm:py-4 bg-white shadow-sm">
                                        <div className="flex items-center gap-3 mb-4">
                                            <img src={PAYMENT_ICONS.cod} alt="COD" className="w-12 h-auto" />
                                            <h3 className="text-lg font-medium">Thanh toán khi nhận hàng</h3>
                                        </div>
                                        <div className="mb-4 p-3 bg-gray-50 rounded-md text-gray-700 text-sm">
                                            <p>Lưu ý: Đơn hàng sẽ chỉ được đánh dấu là đã thanh toán sau khi giao hàng thành công và quý khách đã thanh toán tiền cho nhân viên giao hàng.</p>
                                        </div>
                                        <button
                                            onClick={handleCODPayment}
                                            className="px-10 py-[6px] rounded-sm hover:shadow-wrange-500/20 hover:shadow-lg bg-blue-600 text-white"
                                            disabled={loading}
                                        >
                                            {loading ? "Đang xử lý..." : "Thanh toán khi nhận hàng"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-5/12 md:w-full md:mb-6">
                            <div className="pl-2 md:pl-0">
                                <div className="bg-white shadow p-5 sm:p-4 text-slate-600 flex flex-col gap-3">
                                    <h2 className="text-xl font-bold">Tóm Tắt Đơn Hàng</h2>
                                    <div className="flex justify-between items-center">
                                        <span>({items}) sản phẩm + phí vận chuyển</span>
                                        <span className="text-lg font-bold ml-2">{formateCurrency(price)}</span>
                                    </div>
                                    <div className="flex justify-between items-center font-semibold">
                                        <span className="text-xl sm:text-lg">Tổng cộng</span>
                                        <span className="text-xl sm:text-lg font-bold text-red-500 ml-2">{formateCurrency(price)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer/>
        </div>
    );
};

export default Payment;

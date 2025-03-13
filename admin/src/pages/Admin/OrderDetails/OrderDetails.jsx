import { Badge } from "flowbite-react";
import { formatDate, formateCurrency } from "../../../utils/formate";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get_order_details_to_admin } from "../../../store/reducers/order.reducers";
import { FaBoxOpen, FaCheckCircle, FaTruck, FaTimesCircle } from "react-icons/fa";

const OrderDetails = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const { order_details } = useSelector((state) => state.order);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadOrderDetails = async () => {
            setIsLoading(true);
            try {
                await dispatch(get_order_details_to_admin(orderId));
            } finally {
                setIsLoading(false);
            }
        };
        loadOrderDetails();
    }, [dispatch, orderId]);

    const getStatusIcon = (status) => {
        switch (status) {
            case "processing":
                return <FaBoxOpen className="w-5 h-5 text-yellow-500" />;
            case "shipping":
                return <FaTruck className="w-5 h-5 text-blue-500" />;
            case "delivered":
                return <FaCheckCircle className="w-5 h-5 text-green-500" />;
            case "canceled":
                return <FaTimesCircle className="w-5 h-5 text-red-500" />;
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-600">Đang tải thông tin đơn hàng...</h2>
                </div>
            </div>
        );
    }

    if (!order_details) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-600">Không tìm thấy thông tin đơn hàng</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 p-6">
            {/* Thông tin đơn hàng */}
            <div className="bg-white shadow-md p-5 rounded-md mb-5">
                <h1 className="text-2xl font-semibold text-center mb-2 text-gray-700">Chi tiết đơn hàng</h1>
                <h2 className="text-red-600 font-semibold text-center">
                    Mã đơn hàng: #{order_details?._id}
                </h2>
                <h3 className="text-green-500 mt-1 text-center">
                    Ngày đặt hàng: {formatDate(order_details?.createdAt)}
                </h3>
            </div>

            {/* Thông tin khách hàng và thông tin shop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                {/* Thông tin khách hàng */}
                <div className="bg-white shadow-md p-5 rounded-md">
                    <h2 className="text-gray-700 font-semibold mb-4">Thông tin khách hàng</h2>
                    <p className="text-slate-600">Người nhận: {order_details?.customer_name}</p>
                    <p className="text-slate-600">Số điện thoại: {order_details?.delivery_address?.phone}</p>
                    <p className="text-gray-600">
                        <span className="bg-red-500 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                            Nhà riêng
                        </span>
                        {order_details?.delivery_address?.address}, {order_details?.delivery_address?.ward?.name}, {order_details?.delivery_address?.district?.name}, {order_details?.delivery_address?.province?.name}
                    </p>
                    <p className="text-slate-600">
                        Đơn giá: <span className="text-red-500 font-bold">{formateCurrency(order_details?.price)}</span>
                    </p>
                    <p className="my-1 flex items-center">
                        Trạng thái thanh toán:{" "}
                        {order_details?.payment_status === "paid" ? (
                            <span
                                className="bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-lg ml-2 inline-block">
                                Đã thanh toán
                            </span>
                        ) : (
                            <span
                                className="bg-red-100 text-red-700 font-semibold px-3 py-1 rounded-lg ml-2 inline-block">
                                Chưa thanh toán
                            </span>
                        )}
                    </p>
                </div>

                {/* Thông tin shop */}
                <div className="bg-white shadow-md p-5 rounded-md">
                    <h2 className="text-gray-700 font-semibold mb-4">Thông tin shop</h2>
                    {order_details?.sellerOfOrder?.map((seller) => (
                        <div key={seller._id} className="mb-4">
                            <p className="text-black font-semibold">
                                Đơn hàng của shop: {seller.products[0].shop_name}
                            </p>
                            <p className="text-red-500 font-semibold">Mã seller: #{seller?.sellerId}</p>
                            <p className="text-green-500 font-semibold">
                                Mã đơn hàng của người bán: #{seller?._id}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sản phẩm đã mua */}
            <div className="bg-white shadow-md p-5 rounded-md mb-5">
                <h2 className="text-gray-700 font-semibold mb-4">Sản phẩm đã mua</h2>
                {order_details?.products?.map((p) => (
                    <div key={p._id} className="flex gap-4 items-center border-b pb-3 mb-3">
                        <img className="w-20 h-20 rounded-md" src={p.images[0]} alt="product" />
                        <div className="flex-grow text-slate-600">
                            <div className="text-lg font-semibold">{p.product_name}</div>
                            <p className="text-sm text-blue-600 font-semibold">Thương hiệu: {p.brand_name}</p>
                            <p>Số lượng: {p.quantity}</p>
                            <p className="text-sm line-through text-gray-500">{formateCurrency(p.price)}</p>
                            <p className="text-red-500 font-semibold">
                                {formateCurrency(p.price - (p.price * p.discount) / 100)} (Giảm {p.discount}%)
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Trạng thái đơn hàng */}
            <div className="bg-white shadow-md p-5 rounded-md">
                <h2 className="text-gray-700 font-semibold mb-4">Trạng thái đơn hàng</h2>
                <div className="flex items-center justify-between w-full">
                    {["processing", "shipping", "delivered"].map((status, index) => {
                        // Xác định thứ tự của các trạng thái
                        const statusOrder = ["processing", "shipping", "delivered"];
                        const currentIndex = statusOrder.indexOf(order_details?.delivery_status);
                        const isActive = index <= currentIndex;

                        return (
                            <div key={status} className="flex items-center w-full">
                                {/* Icon trạng thái */}
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`rounded-full h-12 w-12 flex items-center justify-center ${isActive ? getStatusIcon(status) : "bg-gray-300"} transition-colors duration-300`}
                                    >
                                        {getStatusIcon(status)}
                                    </div>
                                    {isActive ? (
                                        <span className="text-xs mt-2 text-gray-600">
                                            {formatDate(order_details?.updatedAt)}
                                        </span>
                                    ) : (
                                        <span className="text-xs mt-2 text-gray-400">Chưa cập nhật</span>
                                    )}
                                </div>

                                {/* Thanh process giữa các trạng thái */}
                                {index < 2 && (
                                    <div
                                        className={`flex-1 h-1 ${isActive ? 'bg-blue-500' : 'bg-gray-300'} mx-2`}
                                    ></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


export default OrderDetails;

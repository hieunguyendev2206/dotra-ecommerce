import {formatDate, formateCurrency, formatAddress} from "../../../utils/formate";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {get_order_details_to_admin} from "../../../store/reducers/order.reducers";
import {FaBoxOpen, FaCheckCircle, FaTimesCircle, FaTruck,} from "react-icons/fa";
import axios from "axios";

const OrderDetails = () => {
    const {orderId} = useParams();
    const dispatch = useDispatch();
    const {order_details} = useSelector((state) => state.order);
    const [isLoading, setIsLoading] = useState(true);
    const [formattedAddress, setFormattedAddress] = useState('');

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
    
    // Debug: In ra cấu trúc dữ liệu sellerOfOrder khi có dữ liệu
    useEffect(() => {
        if (order_details?.sellerOfOrder) {
            console.log("SellerOfOrder data:", order_details.sellerOfOrder);
        }
    }, [order_details]);
    
    useEffect(() => {
        if (order_details && order_details?.delivery_address) {
            // Gọi hàm formatAddressWithAPI để lấy địa chỉ đầy đủ
            const getAddress = async () => {
                try {
                    // Kiểm tra xem có dữ liệu địa chỉ trong localStorage không
                    let addressData = localStorage.getItem('addressData');
                    
                    // Nếu không có dữ liệu hoặc dữ liệu cũ hơn 24 giờ, gọi API để lấy dữ liệu mới
                    const lastFetchTime = localStorage.getItem('addressDataTimestamp');
                    const now = new Date().getTime();
                    const isExpired = !lastFetchTime || (now - parseInt(lastFetchTime) > 24 * 60 * 60 * 1000);
                    
                    if (!addressData || isExpired) {
                        const response = await axios.get('https://provinces.open-api.vn/api/?depth=3');
                        
                        // Chuyển đổi dữ liệu từ API để phù hợp với cấu trúc cache của chúng ta
                        const provinces = {};
                        const districts = {};
                        const wards = {};
                        
                        response.data.forEach(province => {
                            provinces[province.code] = province.name;
                            
                            if (province.districts) {
                                province.districts.forEach(district => {
                                    districts[district.code] = district.name;
                                    
                                    if (district.wards) {
                                        district.wards.forEach(ward => {
                                            wards[ward.code] = ward.name;
                                        });
                                    }
                                });
                            }
                        });
                        
                        // Lưu dữ liệu vào localStorage
                        addressData = { provinces, districts, wards };
                        localStorage.setItem('addressData', JSON.stringify(addressData));
                        localStorage.setItem('addressDataTimestamp', now.toString());
                    } else {
                        addressData = JSON.parse(addressData);
                    }
                    
                    // Tìm thông tin địa chỉ từ dữ liệu đã có
                    const deliveryAddress = order_details.delivery_address;
                    const provinceName = addressData.provinces[deliveryAddress.province?.code] || '';
                    const districtName = addressData.districts[deliveryAddress.district?.code] || '';
                    const wardName = addressData.wards[deliveryAddress.ward?.code] || '';
                    
                    // Tạo địa chỉ đầy đủ
                    const addressParts = [];
                    if (deliveryAddress.address) addressParts.push(deliveryAddress.address);
                    if (wardName) addressParts.push(wardName);
                    if (districtName) addressParts.push(districtName);
                    if (provinceName) addressParts.push(provinceName);
                    
                    const fullAddress = addressParts.join(', ');
                    setFormattedAddress(fullAddress);
                } catch (error) {
                    console.error('Lỗi khi lấy dữ liệu địa chỉ:', error);
                    // Fallback sử dụng hàm formatAddress
                    setFormattedAddress(formatAddress(order_details.delivery_address));
                }
            };
            
            getAddress();
        }
    }, [order_details]);

    const getStatusIcon = (status) => {
        switch (status) {
            case "processing":
                return <FaBoxOpen className="w-5 h-5 text-yellow-500"/>;
            case "shipping":
                return <FaTruck className="w-5 h-5 text-blue-500"/>;
            case "delivered":
                return <FaCheckCircle className="w-5 h-5 text-green-500"/>;
            case "canceled":
                return <FaTimesCircle className="w-5 h-5 text-red-500"/>;
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-600">
                        Đang tải thông tin đơn hàng...
                    </h2>
                </div>
            </div>
        );
    }

    if (!order_details) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-600">
                        Không tìm thấy thông tin đơn hàng
                    </h2>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 p-6">
            {/* Thông tin đơn hàng */}
            <div className="bg-white shadow-md p-5 rounded-md mb-5">
                <h1 className="text-2xl font-semibold text-center mb-2 text-gray-700">
                    Chi tiết đơn hàng
                </h1>
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
                    <h2 className="text-gray-700 font-semibold mb-4">
                        Thông tin khách hàng
                    </h2>
                    <p className="text-slate-600">
                        Người nhận: {order_details?.customer_name}
                    </p>
                    <p className="text-slate-600">
                        Số điện thoại: {order_details?.delivery_address?.phone}
                    </p>
                    <p className="text-gray-600">
            <span className="bg-red-500 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
              Nhà riêng
            </span>
                        {formattedAddress || formatAddress(order_details?.delivery_address)}
                    </p>
                    <p className="text-slate-600">
                        Đơn giá:{" "}
                        <span className="text-red-500 font-bold">
              {formateCurrency(order_details?.price)}
            </span>
                    </p>
                    <p className="my-1 flex items-center">
                        Trạng thái thanh toán:{" "}
                        {order_details?.payment_status === "paid" ? (
                            <span
                                className="bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-lg ml-2 inline-block">
                                Đã thanh toán
                            </span>
                        ) : order_details?.payment_status === "pending_payment" ? (
                            <span
                                className="bg-yellow-100 text-yellow-700 font-semibold px-3 py-1 rounded-lg ml-2 inline-block">
                                Chờ thanh toán khi nhận hàng
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
                        <div key={seller._id} className="mb-4 flex items-center gap-3">
                            {/* Thử nhiều cách lấy ảnh, từ các thuộc tính có thể khác nhau */}
                            {seller.image || seller.shopInfo?.image || seller.shop?.image || seller.products?.[0]?.shopImage ? (
                                <img
                                    src={seller.image || seller.shopInfo?.image || seller.shop?.image || seller.products?.[0]?.shopImage}
                                    alt={seller.products[0].shop_name}
                                    className="w-14 h-14 rounded-full border-2 border-green-500 object-cover"
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            )}
                            <div>
                                <p className="text-black font-semibold">
                                    Đơn hàng của shop: {seller.products[0].shop_name}
                                </p>
                                <p className="text-red-500 font-semibold">
                                    Mã seller: #{seller?.sellerId}
                                </p>
                                <p className="text-green-500 font-semibold">
                                    Mã đơn hàng của người bán: #{seller?._id}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sản phẩm đã mua */}
            <div className="bg-white shadow-md p-5 rounded-md mb-5">
                <h2 className="text-gray-700 font-semibold mb-4">Sản phẩm đã mua</h2>
                {order_details?.products?.map((p) => (
                    <div
                        key={p._id}
                        className="flex gap-4 items-center border-b pb-3 mb-3"
                    >
                        <img
                            className="w-20 h-20 rounded-md"
                            src={p.images[0]}
                            alt="product"
                        />
                        <div className="flex-grow text-slate-600">
                            <div className="text-lg font-semibold">{p.product_name}</div>
                            <p className="text-sm text-blue-600 font-semibold">
                                Thương hiệu: {p.brand_name}
                            </p>
                            <p>Số lượng: {p.quantity}</p>
                            <p className="text-sm line-through text-gray-500">
                                {formateCurrency(p.price)}
                            </p>
                            <p className="text-red-500 font-semibold">
                                {formateCurrency(p.price - (p.price * p.discount) / 100)} (Giảm{" "}
                                {p.discount}%)
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Trạng thái đơn hàng */}
            <div className="bg-white shadow-md p-5 rounded-md">
                <h2 className="text-gray-700 font-semibold mb-4">
                    Trạng thái đơn hàng
                </h2>
                <div className="flex items-center justify-between w-full">
                    {["processing", "shipping", "delivered"].map((status, index) => {
                        // Xác định thứ tự của các trạng thái
                        const statusOrder = ["processing", "shipping", "delivered"];
                        const currentIndex = statusOrder.indexOf(
                            order_details?.delivery_status
                        );
                        const isActive = index <= currentIndex;

                        return (
                            <div key={status} className="flex items-center w-full">
                                {/* Icon trạng thái */}
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`rounded-full h-12 w-12 flex items-center justify-center ${
                                            isActive ? getStatusIcon(status) : "bg-gray-300"
                                        } transition-colors duration-300`}
                                    >
                                        {getStatusIcon(status)}
                                    </div>
                                    {isActive ? (
                                        <span className="text-xs mt-2 text-gray-600">
                                            {formatDate(order_details?.updatedAt)}
                                        </span>
                                    ) : (
                                        <span className="text-xs mt-2 text-gray-400">
                                            Chưa cập nhật
                                        </span>
                                    )}
                                </div>

                                {/* Thanh process giữa các trạng thái */}
                                {index < 2 && (
                                    <div
                                        className={`flex-1 h-1 ${
                                            isActive ? "bg-blue-500" : "bg-gray-300"
                                        } mx-2`}
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

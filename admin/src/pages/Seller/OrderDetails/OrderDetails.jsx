import {formatDate, formateCurrency, formatAddress} from "../../../utils/formate";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {get_order_details_to_seller} from "../../../store/reducers/order.reducers";
import {FaBoxOpen, FaCheckCircle, FaTimesCircle, FaTruck,} from "react-icons/fa";
import axios from "axios";

const OrderDetails = () => {
    const {orderId} = useParams();
    const dispatch = useDispatch();
    const {order_details} = useSelector((state) => state.order);
    const [formattedAddress, setFormattedAddress] = useState('');

    useEffect(() => {
        dispatch(get_order_details_to_seller(orderId));
    }, [dispatch, orderId]);
    
    useEffect(() => {
        if (order_details && order_details?.shipping) {
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
                    const shipping = order_details.shipping;
                    const provinceName = addressData.provinces[shipping.province?.code] || '';
                    const districtName = addressData.districts[shipping.district?.code] || '';
                    const wardName = addressData.wards[shipping.ward?.code] || '';
                    
                    // Tạo địa chỉ đầy đủ
                    const addressParts = [];
                    if (shipping.address) addressParts.push(shipping.address);
                    if (wardName) addressParts.push(wardName);
                    if (districtName) addressParts.push(districtName);
                    if (provinceName) addressParts.push(provinceName);
                    
                    const fullAddress = addressParts.join(', ');
                    setFormattedAddress(fullAddress);
                } catch (error) {
                    console.error('Lỗi khi lấy dữ liệu địa chỉ:', error);
                    // Fallback sử dụng hàm formatAddress
                    setFormattedAddress(formatAddress(order_details.shipping));
                }
            };
            
            getAddress();
        }
    }, [order_details]);

    // Hàm trả về biểu tượng tương ứng với trạng thái
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

            {/* Thông tin giao hàng */}
            <div className="bg-white shadow-md p-5 rounded-md mb-5">
                <h2 className="text-gray-700 font-semibold">Thông tin giao hàng</h2>
                <p className="text-slate-600">
                    Người nhận: {order_details?.customer_name}
                </p>
                <p className="text-slate-600">
                    Địa chỉ: {formattedAddress || formatAddress(order_details?.shipping)}
                </p>
                <p className="text-slate-600">
                    Số điện thoại: {order_details?.shipping?.phone || 'Chưa có thông tin'}
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
                <div className="flex items-center justify-between">
                    {/* Đang xử lý */}
                    <div className="flex flex-col items-center">
                        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-100">
                            {getStatusIcon("processing")}
                        </div>
                        <span className="text-xs mt-1 text-gray-600">Đang xử lý</span>
                        <span className="text-xs mt-1 text-gray-600">
              {formatDate(order_details?.createdAt)}
            </span>
                    </div>

                    {/* Thanh nối */}
                    <div
                        className={`flex-1 h-1 mx-2 ${
                            order_details?.delivery_status === "shipping" ||
                            order_details?.delivery_status === "delivered"
                                ? "bg-blue-500"
                                : "bg-gray-300"
                        }`}
                    ></div>

                    {/* Đang vận chuyển */}
                    <div className="flex flex-col items-center">
                        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-blue-100">
                            {getStatusIcon("shipping")}
                        </div>
                        <span className="text-xs mt-1 text-gray-600">Đang vận chuyển</span>
                        {order_details?.delivery_status === "shipping" ||
                        order_details?.delivery_status === "delivered" ? (
                            <span className="text-xs mt-1 text-gray-600">
                {formatDate(order_details?.updatedAt)}
              </span>
                        ) : null}
                    </div>

                    {/* Thanh nối */}
                    <div
                        className={`flex-1 h-1 mx-2 ${
                            order_details?.delivery_status === "delivered"
                                ? "bg-green-500"
                                : "bg-gray-300"
                        }`}
                    ></div>

                    {/* Đã giao */}
                    <div className="flex flex-col items-center">
                        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-100">
                            {getStatusIcon("delivered")}
                        </div>
                        <span className="text-xs mt-1 text-gray-600">Đã giao</span>
                        {order_details?.delivery_status === "delivered" ? (
                            <span className="text-xs mt-1 text-gray-600">
                {formatDate(order_details?.changeStatusDate)}
              </span>
                        ) : null}
                    </div>

                    {/* Nếu đơn hàng bị hủy */}
                    {order_details?.delivery_status === "canceled" && (
                        <>
                            <div className="flex-1 h-1 mx-2 bg-red-500"></div>
                            <div className="flex flex-col items-center">
                                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-red-100">
                                    {getStatusIcon("canceled")}
                                </div>
                                <span className="text-xs mt-1 text-gray-600">Đã bị hủy</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;

/* eslint-disable no-unused-vars */
import {useEffect, useRef, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {get_order_details} from "../../../store/reducers/order.reducers";
import {formatDate, formateCurrency} from "../../../utils/formate";
import {formatAddressWithAPI, formatAddress} from "../../../utils/addressService";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image-more";
import axios from "axios";

const OrderDetails = () => {
    const dispatch = useDispatch();
    const {orderId} = useParams();
    const {userInfo} = useSelector((state) => state.customer);
    const {order_details} = useSelector((state) => state.order);
    const [formattedAddress, setFormattedAddress] = useState('');
    const [addressLoading, setAddressLoading] = useState(true);
    
    const invoiceRef = useRef(); // Tham chiếu đến hóa đơn để render PDF

    useEffect(() => {
        dispatch(get_order_details(orderId));
    }, [dispatch, orderId]);
    
    useEffect(() => {
        if (order_details && order_details?.delivery_address) {
            const getAddress = async () => {
                setAddressLoading(true);
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
                    // Fallback: sử dụng formatAddress từ addressService
                    const formattedAddr = formatAddress(order_details.delivery_address);
                    setFormattedAddress(formattedAddr || 'Không thể lấy địa chỉ');
                } finally {
                    setAddressLoading(false);
                }
            };
            
            getAddress();
        }
    }, [order_details]);

    const handleExportPDF = async () => {
        const element = invoiceRef.current; // Lấy nội dung cần xuất PDF
        try {
            const dataUrl = await domtoimage.toPng(element, {quality: 1});
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;

            pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`HoaDon_${order_details._id}.pdf`);
        } catch (error) {
            console.error("Lỗi khi xuất file PDF:", error);
        }
    };

    return (
        <div className="bg-white p-5">
            <h1 className="text-2xl font-semibold text-center mb-5">
                HÓA ĐƠN BÁN HÀNG
            </h1>

            {/* Nút xuất PDF */}
            <div className="text-right mb-4">
                <button
                    onClick={handleExportPDF}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Xuất hóa đơn PDF
                </button>
            </div>

            {/* Nội dung hóa đơn */}
            <div ref={invoiceRef} className="bg-white p-5 border border-gray-300 rounded">
                <div className="mb-5 border-b pb-3">
                    <div className="flex justify-between mb-2">
                        <p className="text-slate-600 font-semibold">
                            Mã đơn hàng: <span className="text-red-600">#{order_details._id}</span>
                        </p>
                        <p className="text-green-500 font-semibold">
                            Ngày đặt hàng: <span>{formatDate(order_details.createdAt)}</span>
                        </p>
                    </div>
                    <div>
                        <p className="text-slate-600">
                            <strong>Khách hàng:</strong> {order_details.customer_name}
                        </p>
                        <p className="text-slate-600">
                            <strong>Email:</strong> {userInfo.email}
                        </p>
                        <p className="text-slate-600">
                            <strong>Địa chỉ giao hàng:</strong>{" "}
                            {addressLoading ? (
                                <span className="inline-block animate-pulse">Đang tải địa chỉ...</span>
                            ) : formattedAddress ? (
                                formattedAddress
                            ) : (
                                "Không có thông tin địa chỉ giao hàng"
                            )}
                        </p>
                        <p className="text-slate-600">
                            <strong>Số điện thoại:</strong>{" "}
                            {order_details.delivery_address?.phone || "Không có thông tin"}
                        </p>
                    </div>
                </div>
                
                {/* Thông tin người bán */}
                {order_details.sellerOfOrder && order_details.sellerOfOrder.length > 0 && (
                    <div className="mb-5 border-b pb-3">
                        <h2 className="font-semibold text-lg mb-3">Thông tin người bán</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {order_details.sellerOfOrder.map((seller) => (
                                <div key={seller._id} className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                                    {/* Thử nhiều cách lấy ảnh, từ các thuộc tính có thể khác nhau */}
                                    {seller.image || seller.shop?.image || seller.shopInfo?.image || seller.products?.[0]?.shopImage ? (
                                        <img
                                            src={seller.image || seller.shop?.image || seller.shopInfo?.image || seller.products?.[0]?.shopImage}
                                            alt={seller.products[0]?.shop_name}
                                            className="w-12 h-12 rounded-full border-2 border-green-500 object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-blue-600">{seller.products[0]?.shop_name || "Shop không xác định"}</h3>
                                        <p className="text-sm text-gray-600">Mã seller: #{seller.sellerId}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-5 border-b pb-3">
                    <div className="flex flex-col md:flex-row gap-3 mb-2">
                        <div className="flex items-center">
                            <span className="text-gray-700 font-semibold text-base mr-2">Trạng thái thanh toán:</span>
                            {order_details.payment_status === "paid" ? (
                                <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1.5 rounded">
                                    Đã thanh toán
                                </span>
                            ) : order_details.payment_status === "pending_payment" ? (
                                <span className="bg-yellow-100 text-yellow-700 text-sm font-medium px-3 py-1.5 rounded">
                                    Chờ thanh toán khi nhận hàng
                                </span>
                            ) : (
                                <span className="bg-red-100 text-red-700 text-sm font-medium px-3 py-1.5 rounded">
                                    Chưa thanh toán
                                </span>
                            )}
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-700 font-semibold text-base mr-2">Tình trạng đơn hàng:</span>
                            {(() => {
                                if (order_details.delivery_status === "delivered") {
                                    return <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1.5 rounded">Đã giao</span>;
                                } else if (order_details.delivery_status === "processing") {
                                    return (
                                        <span className="bg-yellow-100 text-yellow-700 text-sm font-medium px-3 py-1.5 rounded">
                                            Đang xử lý
                                        </span>
                                    );
                                } else if (order_details.delivery_status === "shipping") {
                                    return (
                                        <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1.5 rounded">
                                            Vận chuyển
                                        </span>
                                    );
                                } else {
                                    return (
                                        <span className="bg-red-100 text-red-700 text-sm font-medium px-3 py-1.5 rounded">
                                            Đã hủy
                                        </span>
                                    );
                                }
                            })()}
                        </div>
                    </div>
                    <p className="text-gray-700 mt-2">
                        <span className="font-semibold text-base">Tổng tiền:</span>{" "}
                        <span className="text-red-500 text-xl font-bold">
                            {formateCurrency(order_details.price)}
                        </span>
                    </p>
                </div>

                {order_details.payment_status === "pending_payment" && (
                    <div className="mt-3 p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                        <p className="font-medium">Lưu ý về thanh toán khi nhận hàng:</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>Đơn hàng sẽ chỉ được đánh dấu là đã thanh toán sau khi bạn nhận hàng và thanh toán đầy đủ cho người giao hàng.</li>
                            <li>Vui lòng kiểm tra hàng kỹ trước khi thanh toán.</li>
                            <li>Sau khi thanh toán, trạng thái đơn hàng sẽ được cập nhật trong vòng 24 giờ.</li>
                        </ul>
                    </div>
                )}

                {/* Thêm overflow-x-auto để hỗ trợ cuộn ngang */}
                <div className="overflow-x-auto">
                    <h2 className="text-slate-600 text-lg pb-2 font-semibold">
                        Sản phẩm đã mua
                    </h2>
                    <table className="w-full min-w-full text-left border-collapse border border-gray-300">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-3 py-2">Hình ảnh</th>
                            <th className="border px-3 py-2">Tên sản phẩm</th>
                            <th className="border px-3 py-2">Màu sắc</th>
                            <th className="border px-3 py-2">Kích thước</th>
                            <th className="border px-3 py-2">Số lượng</th>
                            <th className="border px-3 py-2">Đơn giá</th>
                            <th className="border px-3 py-2">Thành tiền</th>
                        </tr>
                        </thead>
                        <tbody>
                        {order_details.products?.map((p) => (
                            <tr key={p._id} className="hover:bg-gray-50">
                                <td className="border px-3 py-2">
                                    <img
                                        className="w-14 h-14"
                                        src={p.images[0]}
                                        alt={p.product_name}
                                    />
                                </td>
                                <td className="border px-3 py-2">
                                    <Link
                                        to={`/home/product-details/${p.slug}`}
                                        className="text-blue-500 underline"
                                    >
                                        {p.product_name}
                                    </Link>
                                    <p className="text-sm text-gray-500">
                                        Thương hiệu: {p.brand_name}
                                    </p>
                                </td>
                                <td className="border px-3 py-2">
                                    {p?.color?.code && (
                                        <div className="flex items-center gap-2">
                                            <span className="w-4 h-4 rounded-full border"
                                                  style={{backgroundColor: p.color.code}}></span>
                                            <span>{p.color.name}</span>
                                        </div>
                                    )}
                                </td>
                                <td className="border px-3 py-2">
                                    {p?.size}
                                </td>
                                <td className="border px-3 py-2">{p.quantity}</td>
                                <td className="border px-3 py-2">
                                    {formateCurrency(p.price)}
                                </td>
                                <td className="border px-3 py-2">
                                    {formateCurrency(
                                        p.quantity * (p.price - (p.price * p.discount) / 100)
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
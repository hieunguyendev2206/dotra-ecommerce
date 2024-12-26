/* eslint-disable no-unused-vars */
import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get_order_details } from "../../../store/reducers/order.reducers";
import { formatDate, formateCurrency } from "../../../utils/formate";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image-more";
import html2canvas from "html2canvas";

const OrderDetails = () => {
    const dispatch = useDispatch();
    const { orderId } = useParams();
    const { userInfo } = useSelector((state) => state.customer);
    const { order_details } = useSelector((state) => state.order);

    const invoiceRef = useRef(); // Tham chiếu đến hóa đơn để render PDF

    useEffect(() => {
        dispatch(get_order_details(orderId));
    }, [dispatch, orderId]);

    const handleExportPDF = async () => {
        const element = invoiceRef.current;
        try {
            const canvas = await html2canvas(element, { useCORS: true, scale: 2 });
            const dataUrl = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

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
                            {order_details.delivery_address?.address},{" "}
                            {order_details.delivery_address?.ward?.name},{" "}
                            {order_details.delivery_address?.district?.name},{" "}
                            {order_details.delivery_address?.province?.name}
                        </p>
                    </div>
                </div>

                <div className="mb-5 border-b pb-3">
                    <p className="text-slate-600">
                        <strong>Trạng thái thanh toán:</strong>{" "}
                        {order_details.payment_status === "paid" ? (
                            <span className="bg-green-100 text-green-600 px-2 py-1 rounded">
                                Đã thanh toán
                            </span>
                        ) : (
                            <span className="bg-red-100 text-red-600 px-2 py-1 rounded">
                                Chưa thanh toán
                            </span>
                        )}
                    </p>
                    <p className="text-slate-600">
                        <strong>Tình trạng đơn hàng:</strong>{" "}
                        {(() => {
                            if (order_details.delivery_status === "delivered") {
                                return <span className="bg-green-100 text-green-600 px-2 py-1 rounded">Đã giao</span>;
                            } else if (order_details.delivery_status === "processing") {
                                return (
                                    <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded">
                                        Đang xử lý
                                    </span>
                                );
                            } else if (order_details.delivery_status === "shipping") {
                                return (
                                    <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded">
                                        Vận chuyển
                                    </span>
                                );
                            } else {
                                return (
                                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded">
                                        Đã hủy
                                    </span>
                                );
                            }
                        })()}
                    </p>
                    <p className="text-slate-600">
                        <strong>Tổng tiền:</strong>{" "}
                        <span className="text-red-500 font-bold">
                            {formateCurrency(order_details.price)}
                        </span>
                    </p>
                </div>

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
                                        crossOrigin="anonymous"
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

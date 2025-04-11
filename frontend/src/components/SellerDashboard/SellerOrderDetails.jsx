import {Link} from 'react-router-dom';
import {formateCurrency} from '../../../utils/currency';
import PropTypes from 'prop-types';

const SellerOrderDetails = ({order_details}) => {
    if (!order_details || !order_details.products) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-600">Đang tải thông tin đơn hàng...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-5">
            {/* Thông tin đơn hàng */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-center mb-2">Chi tiết đơn hàng</h1>
                <p className="text-center text-red-500 font-medium">Mã đơn hàng: #{order_details._id}</p>
            </div>

            {/* Thông tin khách hàng */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h2 className="text-lg font-semibold mb-3">Thông tin khách hàng</h2>
                <p><span className="font-medium">Tên khách hàng:</span> {order_details.customer_name}</p>
                <p><span className="font-medium">Địa chỉ:</span> {order_details.delivery_address?.address}
                   {order_details.delivery_address?.ward?.name && `, ${order_details.delivery_address?.ward?.name}`}
                   {order_details.delivery_address?.district?.name && `, ${order_details.delivery_address?.district?.name}`}
                   {order_details.delivery_address?.province?.name && `, ${order_details.delivery_address?.province?.name}`}
                </p>
                <p><span className="font-medium">Số điện thoại:</span> {order_details.delivery_address?.phone}</p>
                <p className="my-1 flex items-center">
                    <span className="font-semibold">Trạng thái thanh toán:</span>{" "}
                    {order_details.payment_status === "paid" ? (
                        <span
                            className="bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-lg ml-2 inline-block">
                            Đã thanh toán
                        </span>
                    ) : order_details.payment_status === "pending_payment" ? (
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
                {order_details.payment_status === "pending_payment" && (
                    <div className="mt-3 p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                        <p className="font-medium">Lưu ý về thanh toán khi nhận hàng:</p>
                        <p className="mt-1">Đơn hàng này đang ở chế độ thanh toán khi nhận hàng (COD). Chỉ khi khách hàng đã nhận hàng và thanh toán đầy đủ, trạng thái đơn hàng sẽ được cập nhật thành &quot;Đã thanh toán&quot;.</p>
                    </div>
                )}
            </div>

            {/* Sản phẩm đã bán */}
            <div className="overflow-x-auto">
                <h2 className="text-lg font-semibold mb-4">Sản phẩm đã bán</h2>
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
                                    to={`/seller/product-details/${p.slug}`}
                                    className="text-blue-500 underline"
                                >
                                    {p.product_name}
                                </Link>
                                <p className="text-sm text-gray-500">
                                    Thương hiệu: {p.brand_name}
                                </p>
                            </td>
                            <td className="border px-3 py-2">
                                <div className="flex items-center gap-2">
                                        <span
                                            className="w-4 h-4 rounded-full border"
                                            style={{backgroundColor: p.color.code}}
                                        ></span>
                                    <span>{p.color.name}</span>
                                </div>
                            </td>
                            <td className="border px-3 py-2">{p.size}</td>
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

            {/* Tổng tiền */}
            <div className="mt-6 text-right">
                <p className="text-lg">
                    <span className="font-medium">Tổng tiền: </span>
                    <span className="text-red-600 font-bold">{formateCurrency(order_details.price)}</span>
                </p>
            </div>
        </div>
    );
};

SellerOrderDetails.propTypes = {
    order_details: PropTypes.shape({
        _id: PropTypes.string,
        customer_name: PropTypes.string,
        delivery_address: PropTypes.shape({
            address: PropTypes.string,
            phone: PropTypes.string,
            ward: PropTypes.shape({
                code: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                name: PropTypes.string
            }),
            district: PropTypes.shape({
                code: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                name: PropTypes.string
            }),
            province: PropTypes.shape({
                code: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                name: PropTypes.string
            })
        }),
        payment_status: PropTypes.string,
        price: PropTypes.number,
        products: PropTypes.arrayOf(
            PropTypes.shape({
                _id: PropTypes.string.isRequired,
                images: PropTypes.arrayOf(PropTypes.string).isRequired,
                product_name: PropTypes.string.isRequired,
                brand_name: PropTypes.string.isRequired,
                slug: PropTypes.string.isRequired,
                color: PropTypes.shape({
                    name: PropTypes.string,
                    code: PropTypes.string
                }),
                size: PropTypes.string,
                quantity: PropTypes.number.isRequired,
                price: PropTypes.number.isRequired,
                discount: PropTypes.number.isRequired
            })
        )
    })
};

export default SellerOrderDetails; 
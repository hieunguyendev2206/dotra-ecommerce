/* eslint-disable no-unused-vars */
import {Badge, Table} from "flowbite-react";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import icons from "../../../assets/icons";
import {useEffect} from "react";
import {formatDate, formateCurrency} from "../../../utils/formate";
import {get_orders} from "../../../store/reducers/order.reducers";

const MyOrders = () => {
    const {AiOutlineEye, MdOutlinePayment} = icons;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {userInfo} = useSelector((state) => state.customer);
    const {orders} = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(get_orders(userInfo.id));
    }, [dispatch, userInfo]);

    const redirectToPayment = (order) => {
        let items = 0;
        for (let i = 0; i < order.products.length; i++) {
            items += order.products[i].quantity;
        }
        navigate("/payment", {
            state: {
                orderId: order._id,
                price: order.price,
                items,
            },
        });
    };
    return (
        <div className="overflow-x-auto">
            <Table hoverable>
                <Table.Head>
                    <Table.HeadCell>STT</Table.HeadCell>
                    <Table.HeadCell>Mã Đơn Hàng</Table.HeadCell>
                    <Table.HeadCell>Khách Hàng</Table.HeadCell>
                    <Table.HeadCell>Ngày Đặt Hàng</Table.HeadCell>
                    <Table.HeadCell>Đơn Giá</Table.HeadCell>
                    <Table.HeadCell>Thanh Toán</Table.HeadCell>
                    <Table.HeadCell>Tình Trạng</Table.HeadCell>
                    <Table.HeadCell></Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {orders.map((m, index) => (
                        <Table.Row
                            key={m._id}
                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                            <Table.Cell>{index + 1}</Table.Cell>
                            <Table.Cell>#{m._id.slice(0, 15) + "..."}</Table.Cell>
                            <Table.Cell
                                className="whitespace-nowrap font-medium text-gray-900 dark:text-white truncate">
                                {m.customer_name}
                            </Table.Cell>
                            <Table.Cell>{formatDate(m.createdAt)}</Table.Cell>
                            <Table.Cell>
                                <Badge color="gray" className="inline-block px-2 py-1">
                                    {formateCurrency(m.price)}
                                </Badge>
                            </Table.Cell>
                            <Table.Cell>
                                {m.payment_status === "paid" ? (
                                    <Badge color="success" className="inline-block px-2 py-1">
                                        Đã thanh toán
                                    </Badge>
                                ) : (
                                    <Badge color="failure" className="inline-block px-2 py-1">
                                        Chưa thanh toán
                                    </Badge>
                                )}
                            </Table.Cell>
                            <Table.Cell>
                                <div className="flex justify-start items-center">
                                    {(() => {
                                        if (m.delivery_status === "delivered") {
                                            return <Badge color="success">Đã giao</Badge>;
                                        } else if (m.delivery_status === "processing") {
                                            return (
                                                <Badge className="" color="warning">
                                                    Đang xử lý
                                                </Badge>
                                            );
                                        } else if (m.delivery_status === "shipping") {
                                            return <Badge color="purple">Vận chuyển</Badge>;
                                        } else {
                                            return <Badge color="failure">Đã hủy</Badge>;
                                        }
                                    })(m.delivery_status)}
                                </div>
                            </Table.Cell>
                            <Table.Cell>
                                <div className="flex justify-between items-center">
                                    <Link to={`/dashboard/my-orders/get-order-details/${m._id}`}>
                                        <AiOutlineEye size={25} className="text-cyan-600"/>
                                    </Link>
                                    {m.payment_status === "unpaid" && (
                                        <div
                                            onClick={() => redirectToPayment(m)}
                                            className="text-red-600 cursor-pointer"
                                        >
                                            <MdOutlinePayment size={25}/>
                                        </div>
                                    )}
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};

export default MyOrders;

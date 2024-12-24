/* eslint-disable no-unused-vars */
import {Link} from "react-router-dom";
import {Badge, Table} from "flowbite-react";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {get_dashboard_data} from "../../store/reducers/dashboard.reducers";
import {formatDate, formateCurrency} from "../../utils/formate";
import icons from "../../assets/icons";

const CustomerDashboard = () => {
    const {
        AiOutlineShoppingCart,
        FaCheck,
        IoMdClose,
        ImSpinner11,
        AiOutlineEye,
    } = icons;

    const dispatch = useDispatch();
    const {userInfo} = useSelector((state) => state.customer);
    const {
        recent_orders,
        total_orders,
        total_delivered,
        total_processing,
        total_cancelled,
    } = useSelector((state) => state.dashboard);

    useEffect(() => {
        if (userInfo) {
            dispatch(get_dashboard_data(userInfo.id));
        }
    }, [dispatch, userInfo]);

    return (
        <div>
            <div className="grid grid-cols-4 md:grid-cols-1 gap-2">
                <div className="flex justify-start items-center p-5 bg-white rounded-md mr-2">
                    <div
                        className="ml-4 w-[40px] h-[40px] bg-blue-200 rounded-full flex justify-center items-center mr-4">
                        <AiOutlineShoppingCart size={25} color="blue"/>
                    </div>
                    <div className="flex flex-col justify-center items-start mx-4">
                        <span className="uppercase font-mono">Tổng Đơn Hàng</span>
                        <h2 className="font-bold text-xl">{total_orders}</h2>
                    </div>
                </div>
                <div className="flex justify-start items-center p-5 bg-white rounded-md mr-2">
                    <div
                        className="ml-4 w-[40px] h-[40px] bg-green-200 rounded-full flex justify-center items-center mr-4">
                        <FaCheck size={25} color="green"/>
                    </div>
                    <div className="flex flex-col justify-center items-start mx-4">
                        <span className="uppercase font-mono">Đã Nhận</span>
                        <h2 className="font-bold text-xl">{total_delivered}</h2>
                    </div>
                </div>
                <div className="flex justify-start items-center p-5 bg-white rounded-md mr-2">
                    <div
                        className="ml-4 w-[40px] h-[40px] bg-orange-200 rounded-full flex justify-center items-center mr-4">
                        <ImSpinner11 size={25} color="orange"/>
                    </div>
                    <div className="flex flex-col justify-center items-start mx-4">
                        <span className="uppercase font-mono">Đang xử lý</span>
                        <h2 className="font-bold text-xl">{total_processing}</h2>
                    </div>
                </div>
                <div className="flex justify-start items-center p-5 bg-white rounded-md mr-2">
                    <div
                        className="ml-4 w-[40px] h-[40px] bg-red-200 rounded-full flex justify-center items-center mr-4">
                        <IoMdClose size={25} color="red"/>
                    </div>
                    <div className="flex flex-col justify-center items-start mx-4">
                        <span className="uppercase font-mono">Đã Hủy</span>
                        <h2 className="font-bold text-xl">{total_cancelled}</h2>
                    </div>
                </div>
            </div>
            <div className="bg-white p-4 mt-5 mr-2 rounded-md">
                <h2 className="text-lg font-semibold text-slate-600">
                    Đơn Hàng Gần Đây
                </h2>
                <div className="overflow-x-auto mt-5">
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
                            {recent_orders &&
                                recent_orders.map((o, index) => (
                                    <Table.Row
                                        key={o._id}
                                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell>#{o._id.slice(0, 15) + "..."}</Table.Cell>
                                        <Table.Cell
                                            className="whitespace-nowrap font-medium text-gray-900 dark:text-white truncate">
                                            {o.customer_name}
                                        </Table.Cell>
                                        <Table.Cell>{formatDate(o.createdAt)}</Table.Cell>
                                        <Table.Cell>
                                            <Badge color="gray" className="inline-block px-2 py-1">
                                                {formateCurrency(o.price)}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {o.payment_status === "paid" ? (
                                                <Badge
                                                    color="success"
                                                    className="inline-block px-2 py-1"
                                                >
                                                    Đã thanh toán
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    color="failure"
                                                    className="inline-block px-2 py-1"
                                                >
                                                    Chưa thanh toán
                                                </Badge>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex justify-start items-center">
                                                {(() => {
                                                    if (o.delivery_status === "delivered") {
                                                        return <Badge color="success">Đã giao</Badge>;
                                                    } else if (o.delivery_status === "processing") {
                                                        return (
                                                            <Badge className="" color="warning">
                                                                Đang xử lý
                                                            </Badge>
                                                        );
                                                    } else if (o.delivery_status === "shipping") {
                                                        return <Badge color="purple">Vận chuyển</Badge>;
                                                    } else {
                                                        return <Badge color="failure">Đã hủy</Badge>;
                                                    }
                                                })(o.delivery_status)}
                                            </div>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <Link
                                                to={`/dashboard/my-orders/get-order-details/${o._id}`}
                                            >
                                                <AiOutlineEye size={22} className="text-cyan-600"/>
                                            </Link>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                        </Table.Body>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;

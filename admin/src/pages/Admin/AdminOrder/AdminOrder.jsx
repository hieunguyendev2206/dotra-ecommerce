/* eslint-disable no-unused-vars */
import {Badge, Button, Table} from "flowbite-react";
import {createSearchParams, Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Panigation from "../../../components/Panigation";
import Search from "../../../components/Search";
import {
    admin_change_status_order,
    admin_query_orders,
    get_orders_to_admin,
    message_clear,
} from "../../../store/reducers/order.reducers";
import {formatDate, formateCurrency} from "../../../utils/formate";
import {toast} from "react-toastify";
import {FaEye} from "react-icons/fa";

const AdminOrder = () => {
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [parPage, setParPage] = useState(10);
    const [searchParams, setSearchParams] = useState({
        pageNumber: currentPageNumber, parPage,
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {orders, total_orders, success_message, error_message} = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(get_orders_to_admin({
            pageNumber: currentPageNumber, parPage, searchValue,
        }));
    }, [currentPageNumber, dispatch, parPage, searchValue]);

    const handleStatusChange = (statusChange, orderId) => {
        dispatch(admin_change_status_order({
            statusChange, orderId,
        }));
    };

    const handleFilterOrderRecently = (e) => {
        const orderRecently = e.target.value;
        navigate({
            pathname: "/admin/dashboard/orders", search: createSearchParams({
                ...searchParams, order_recently: orderRecently,
            }).toString(),
        });
        setSearchParams({
            ...searchParams, order_recently: orderRecently,
        });
    };

    const handleFilterStatus = (e) => {
        const status = e.target.value;
        navigate({
            pathname: "/admin/dashboard/orders", search: createSearchParams({
                ...searchParams, status,
            }).toString(),
        });
        setSearchParams({
            ...searchParams, status,
        });
    };

    const handleFilterPayment = (e) => {
        const payment = e.target.value;
        navigate({
            pathname: "/admin/dashboard/orders", search: createSearchParams({
                ...searchParams, payment,
            }).toString(),
        });
        setSearchParams({
            ...searchParams, payment,
        });
    };

    useEffect(() => {
        if (searchParams) {
            dispatch(admin_query_orders(searchParams));
        }
    }, [dispatch, searchParams]);

    const handleResetFilter = () => {
        navigate({
            pathname: "/admin/dashboard/orders", search: "",
        });
        setSearchParams({
            pageNumber: 1, parPage: 10,
        });
    };

    useEffect(() => {
        if (success_message) {
            toast.success(success_message);
            dispatch(message_clear());
        }
        if (error_message) {
            toast.error(error_message);
            dispatch(message_clear());
        }
    }, [success_message, error_message, dispatch]);

    return (<div className="px-2 md:px-7 py-5 bg-[#dae1e7]">
        <h1 className="text-xl font-bold uppercase mt-2">Đơn Hàng</h1>
        <div className="bg-white p-4 w-full flex flex-wrap justify-between items-center mt-4 rounded-lg gap-3">
            <div className="flex flex-wrap w-full lg:w-auto gap-3">
                <Search
                    setParPage={setParPage}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    className="w-full sm:w-auto"
                />

                <select
                    className="select select-bordered w-full lg:w-auto bg-white"
                    defaultValue="Đơn hàng gần đây"
                    onChange={handleFilterOrderRecently}
                >
                    <option disabled>Đơn hàng gần đây</option>
                    <option value={3}>3 ngày gần đây</option>
                    <option value={5}>5 ngày gần đây</option>
                    <option value={7}>7 ngày gần đây</option>
                    <option value={15}>15 ngày gần đây</option>
                    <option value={30}>30 ngày gần đây</option>
                </select>

                <select
                    className="select select-bordered w-full lg:w-auto bg-white"
                    defaultValue="Trạng thái"
                    onChange={handleFilterStatus}
                >
                    <option disabled>Trạng thái</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipping">Đang vận chuyển</option>
                    <option value="delivered">Đã giao</option>
                    <option value="canceled">Đã hủy</option>
                </select>

                <select
                    className="select select-bordered w-full lg:w-auto bg-white"
                    defaultValue="Thanh toán"
                    onChange={handleFilterPayment}
                >
                    <option disabled>Thanh toán</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="unpaid">Chưa thanh toán</option>
                </select>
            </div>

            <Button onClick={handleResetFilter} color="failure"
                    className="w-full sm:w-auto lg:w-auto mt-3 lg:mt-0 text-center">
                Đặt lại
            </Button>
        </div>


        <div className="overflow-x-auto mt-5">
            <Table hoverable className="min-w-full">
                <Table.Head>
                    <Table.HeadCell>Mã Đơn Hàng</Table.HeadCell>
                    <Table.HeadCell>Ngày Đặt Hàng</Table.HeadCell>
                    <Table.HeadCell>Khách Hàng</Table.HeadCell>
                    <Table.HeadCell>Đơn Giá</Table.HeadCell>
                    <Table.HeadCell>Thanh Toán</Table.HeadCell>
                    <Table.HeadCell>Tình Trạng</Table.HeadCell>
                    <Table.HeadCell>Hành Động</Table.HeadCell>
                    <Table.HeadCell></Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {orders && orders.map((o) => (<Table.Row
                        key={o._id}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                        <Table.Cell className="whitespace-nowrap">
                            #{o._id.slice(0, 5)}...{o._id.slice(-5)}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap">{formatDate(o.createdAt)}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap">{o.customer_name}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap">
                            <Badge color="gray" className="inline-block px-2 py-1">
                                {formateCurrency(o.price)}
                            </Badge>
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap">
                            {o.payment_status === "paid" ? (<Badge color="success" className="inline-block px-2 py-1">
                                Đã thanh toán
                            </Badge>) : (<Badge color="failure" className="inline-block px-2 py-1">
                                Chưa thanh toán
                            </Badge>)}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap">
                            <div className="flex justify-start items-center">
                                {(() => {
                                    if (o.delivery_status === "delivered") {
                                        return <Badge color="success">Đã giao</Badge>;
                                    } else if (o.delivery_status === "processing") {
                                        return (<Badge className="" color="warning">
                                            Đang xử lý
                                        </Badge>);
                                    } else if (o.delivery_status === "shipping") {
                                        return <Badge color="purple">Vận chuyển</Badge>;
                                    } else {
                                        return <Badge color="failure">Đã hủy</Badge>;
                                    }
                                })(o.delivery_status)}
                            </div>
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap">
                            <select
                                value={o.delivery_status}
                                className="rounded-lg text-xs"
                                onChange={(e) => handleStatusChange(e.target.value, o._id)}
                                disabled={o.delivery_status === "delivered" || o.delivery_status === "canceled"}
                            >
                                <option value="processing" disabled>
                                    Đang xử lý
                                </option>
                                <option value="shipping">Vận chuyển</option>
                                <option value="delivered">Đã giao</option>
                                <option value="canceled">Hủy đơn</option>
                            </select>
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap">
                            <div className="flex flex-warp gap-4">
                                <Link to={`/admin/dashboard/orders/details/${o._id}`}>
                                    <button
                                        className="flex items-center justify-center bg-[#f1f1f1] dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-2">
                                        <FaEye className="w-5 h-5"/>
                                    </button>
                                </Link>
                            </div>
                        </Table.Cell>
                    </Table.Row>))}
                </Table.Body>
            </Table>
            {total_orders > parPage && (<div className="w-full flex justify-end mt-4 bottom-4 right-4">
                <Panigation
                    currentPageNumber={currentPageNumber}
                    setCurrentPageNumber={setCurrentPageNumber}
                    totalItem={total_orders}
                    parPage={parPage}
                    showItem={Math.floor(total_orders / parPage)}
                />
            </div>)}
        </div>
    </div>);
};

export default AdminOrder;

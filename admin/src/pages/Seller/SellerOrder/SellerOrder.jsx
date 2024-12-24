/* eslint-disable no-unused-vars */
import {Badge, Button, Table} from "flowbite-react";
import {createSearchParams, Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Panigation from "../../../components/Panigation";
import {
    get_orders_to_seller,
    message_clear,
    seller_change_status_order,
    seller_query_orders,
} from "../../../store/reducers/order.reducers";
import Search from "../../../components/Search";
import {formatDate, formateCurrency} from "../../../utils/formate";
import {toast} from "react-toastify";
import {FaEye} from "react-icons/fa";

const SellerOrder = () => {
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [parPage, setParPage] = useState(10);
    const [searchValue, setSearchValue] = useState("");
    const [searchParams, setSearchParams] = useState({
        pageNumber: currentPageNumber,
        parPage,
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user_info} = useSelector((state) => state.auth);
    const {orders, total_orders, success_message, error_message} = useSelector(
        (state) => state.order
    );

    useEffect(() => {
        dispatch(
            get_orders_to_seller({
                sellerId: user_info._id,
                pageNumber: currentPageNumber,
                parPage,
                searchValue,
            })
        );
    }, [currentPageNumber, dispatch, parPage, searchValue, user_info._id]);

    const handleStatusChange = (statusChange, orderId) => {
        console.log(statusChange, orderId);
        dispatch(
            seller_change_status_order({
                statusChange,
                orderId,
            })
        );
    };

    const handleFilterOrderRecently = (e) => {
        const orderRecently = e.target.value;
        navigate({
            pathname: "/seller/dashboard/orders",
            search: createSearchParams({
                ...searchParams,
                order_recently: orderRecently,
            }).toString(),
        });
        setSearchParams({
            ...searchParams,
            order_recently: orderRecently,
        });
    };

    const handleFilterStatus = (e) => {
        const status = e.target.value;
        navigate({
            pathname: "/seller/dashboard/orders",
            search: createSearchParams({
                ...searchParams,
                status,
            }).toString(),
        });
        setSearchParams({
            ...searchParams,
            status,
        });
    };

    const handleFilterPayment = (e) => {
        const payment = e.target.value;
        navigate({
            pathname: "/seller/dashboard/orders",
            search: createSearchParams({
                ...searchParams,
                payment,
            }).toString(),
        });
        setSearchParams({
            ...searchParams,
            payment,
        });
    };

    useEffect(() => {
        if (searchParams) {
            dispatch(
                seller_query_orders({
                    sellerId: user_info._id,
                    queryParams: searchParams,
                })
            );
        }
    }, [dispatch, searchParams, user_info._id]);

    const handleResetFilter = () => {
        navigate({
            pathname: "/seller/dashboard/orders",
            search: "",
        });
        setSearchParams({
            pageNumber: 1,
            parPage: 10,
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

    return (
        <div className="px-2 md:px-7 py-5 bg-[#dae1e7]">
            <h1 className="text-xl font-bold uppercase mt-2">Đơn Hàng</h1>
            <div className="bg-white p-3 mt-5 flex justify-between items-center rounded-lg">
                <Search
                    setParPage={setParPage}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                />
                <div>
                    <select
                        className="select select-bordered max-w-xs mr-2 bg-white text-gray-900"
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
                        defaultValue="Trạng thái"
                        className="select select-bordered max-w-xs mr-2 bg-white text-gray-900"
                        onChange={handleFilterStatus}
                    >
                        <option disabled>Trạng thái</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="shipping">Đang vận chuyển</option>
                        <option value="delivered">Đã giao</option>
                        <option value="canceled">Đã hủy</option>
                    </select>
                    <select
                        defaultValue="Thanh toán"
                        className="select select-bordered max-w-xs bg-white text-gray-900"
                        onChange={handleFilterPayment}
                    >
                        <option disabled>Thanh toán</option>
                        <option value="paid">Đã thanh toán</option>
                        <option value="unpaid">Chưa thanh toán</option>
                    </select>
                </div>
                <Button onClick={handleResetFilter} color="failure">
                    Đặt lại
                </Button>
            </div>
            <div className="overflow-x-auto mt-5">
                <Table hoverable>
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
                        {orders &&
                            orders.map((o) => (
                                <Table.Row
                                    key={o._id}
                                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <Table.Cell>
                                        #{o._id.slice(0, 8) + "..."}
                                    </Table.Cell>
                                    <Table.Cell>{formatDate(o.createdAt)}</Table.Cell>
                                    <Table.Cell>{o.customer_name}</Table.Cell>
                                    <Table.Cell>
                                        <Badge color="gray" className="inline-block px-2 py-1">
                                            {formateCurrency(o.price)}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {o.payment_status === "paid" ? (
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
                                        <select
                                            value={o.delivery_status}
                                            className="rounded-lg text-xs"
                                            onChange={(e) =>
                                                handleStatusChange(e.target.value, o._id)
                                            }
                                            disabled={
                                                o.delivery_status === "delivered" ||
                                                o.delivery_status === "canceled"
                                            }
                                        >
                                            <option value="processing" disabled>
                                                Đang xử lý
                                            </option>
                                            <option value="shipping">Vận chuyển</option>
                                            <option value="delivered">Đã giao</option>
                                            <option value="canceled">Hủy đơn</option>
                                        </select>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div className="flex flex-warp">
                                            <Link to={`/seller/dashboard/orders/details/${o._id}`}>
                                                <button
                                                    className="flex items-center justify-center bg-[#f1f1f1] dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-2">
                                                    <FaEye className="w-5 h-5"/>
                                                </button>
                                            </Link>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                    </Table.Body>
                </Table>
                {total_orders > parPage && (
                    <div className="w-full flex justify-end mt-4 bottom-4 right-4">
                        <Panigation
                            currentPageNumber={currentPageNumber}
                            setCurrentPageNumber={setCurrentPageNumber}
                            totalItem={total_orders}
                            parPage={parPage}
                            showItem={Math.floor(total_orders / parPage)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerOrder;

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
    // Khai báo hooks trước
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user_info} = useSelector((state) => state.auth);
    const {orders, total_orders, success_message, error_message} = useSelector(
        (state) => state.order
    );

    // Sau đó khai báo các state
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [parPage, setParPage] = useState(10);
    const [searchValue, setSearchValue] = useState("");
    const [searchParams, setSearchParams] = useState({
        pageNumber: currentPageNumber,
        parPage,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Xóa useEffect trùng lặp và giữ lại một useEffect duy nhất cho việc tải đơn hàng
    useEffect(() => {
        const loadOrders = async () => {
            if (isInitialLoad) {
                setIsLoading(true);
            }
            
            try {
                await dispatch(
                    get_orders_to_seller({
                        sellerId: user_info._id,
                        pageNumber: currentPageNumber,
                        parPage,
                        searchValue,
                    })
                );
            } finally {
                setIsLoading(false);
                if (isInitialLoad) {
                    setIsInitialLoad(false);
                }
            }
        };
        
        // Thêm debounce để tránh gọi API liên tục khi gõ
        const timeoutId = setTimeout(() => {
            loadOrders();
        }, 500);
        
        return () => clearTimeout(timeoutId);
    }, [currentPageNumber, dispatch, parPage, searchValue, user_info._id, isInitialLoad]);

    // Các hàm xử lý sự kiện và useEffect khác giữ nguyên
    const handleStatusChange = async (statusChange, orderId) => {
        try {
            await dispatch(
                seller_change_status_order({
                    statusChange,
                    orderId,
                })
            );
        } catch (error) {
            console.error("Error changing status:", error);
        }
    };

    // Các hàm xử lý khác giữ nguyên
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

    // Các phần còn lại giữ nguyên
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

    // Thay đổi điều kiện hiển thị loading
    if (isInitialLoad && isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-600">Đang tải danh sách đơn hàng...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="px-2 md:px-7 py-5 bg-[#dae1e7] min-h-screen">
            <h1 className="text-xl md:text-2xl font-bold uppercase mt-2">Đơn Hàng</h1>
            
            {/* Filter section - Responsive layout */}
            <div className="bg-white p-3 mt-5 rounded-lg flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                <div className="w-full md:w-auto">
                    <Search
                        setParPage={setParPage}
                        searchValue={searchValue}
                        setSearchValue={(value) => {
                            setSearchValue(value);
                            // Không gọi API ngay lập tức khi nhập, để useEffect với debounce xử lý
                        }}
                    />
                </div>
                
                <div className="flex flex-wrap gap-2">
                    <select
                        className="select select-bordered w-full sm:w-auto bg-white text-gray-900 text-sm py-2 px-3 rounded-lg border border-gray-300"
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
                        className="select select-bordered w-full sm:w-auto bg-white text-gray-900 text-sm py-2 px-3 rounded-lg border border-gray-300"
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
                        className="select select-bordered w-full sm:w-auto bg-white text-gray-900 text-sm py-2 px-3 rounded-lg border border-gray-300"
                        onChange={handleFilterPayment}
                    >
                        <option disabled>Thanh toán</option>
                        <option value="paid">Đã thanh toán</option>
                        <option value="unpaid">Chưa thanh toán</option>
                    </select>
                </div>
                
                <div className="w-full md:w-auto">
                    <Button onClick={handleResetFilter} color="failure" className="w-full md:w-auto">
                        Đặt lại
                    </Button>
                </div>
            </div>
            
            {/* Table section - Responsive handling */}
            <div className="mt-5">
                <div className="overflow-x-auto rounded-lg shadow">
                    <div className="hidden md:block"> {/* Desktop view */}
                        <Table hoverable className="w-full">
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
                                                    })()}
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <select
                                                    value={o.delivery_status}
                                                    className="rounded-lg text-xs py-1 px-2 border border-gray-300"
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
                                            <Table.Cell>
                                                <div className="flex flex-warp gap-4">
                                                    <Link to={`/seller/dashboard/orders/details/${o._id}`}>
                                                        <button
                                                            className="flex items-center justify-center bg-[#f1f1f1] dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-2 hover:bg-gray-200 transition-colors">
                                                            <FaEye className="w-5 h-5"/>
                                                        </button>
                                                    </Link>
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                            </Table.Body>
                        </Table>
                    </div>
                    
                    {/* Mobile view - Card layout */}
                    <div className="md:hidden">
                        {orders && orders.map((o) => (
                            <div key={o._id} className="bg-white p-4 rounded-lg mb-3 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold">#{o._id.slice(0, 8) + "..."}</span>
                                    <Link to={`/seller/dashboard/orders/details/${o._id}`}>
                                        <button className="flex items-center justify-center bg-[#f1f1f1] text-gray-900 rounded-lg p-2 hover:bg-gray-200 transition-colors">
                                            <FaEye className="w-4 h-4"/>
                                        </button>
                                    </Link>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="text-gray-600">Khách hàng:</div>
                                    <div className="font-medium">{o.customer_name}</div>
                                    
                                    <div className="text-gray-600">Ngày đặt:</div>
                                    <div>{formatDate(o.createdAt)}</div>
                                    
                                    <div className="text-gray-600">Đơn giá:</div>
                                    <div>
                                        <Badge color="gray" className="px-2 py-1">
                                            {formateCurrency(o.price)}
                                        </Badge>
                                    </div>
                                    
                                    <div className="text-gray-600">Thanh toán:</div>
                                    <div>
                                        {o.payment_status === "paid" ? (
                                            <Badge color="success" className="px-2 py-1">
                                                Đã thanh toán
                                            </Badge>
                                        ) : (
                                            <Badge color="failure" className="px-2 py-1">
                                                Chưa thanh toán
                                            </Badge>
                                        )}
                                    </div>
                                    
                                    <div className="text-gray-600">Tình trạng:</div>
                                    <div>
                                        {(() => {
                                            if (o.delivery_status === "delivered") {
                                                return <Badge color="success">Đã giao</Badge>;
                                            } else if (o.delivery_status === "processing") {
                                                return <Badge color="warning">Đang xử lý</Badge>;
                                            } else if (o.delivery_status === "shipping") {
                                                return <Badge color="purple">Vận chuyển</Badge>;
                                            } else {
                                                return <Badge color="failure">Đã hủy</Badge>;
                                            }
                                        })()}
                                    </div>
                                </div>
                                
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Cập nhật trạng thái:</span>
                                        <select
                                            value={o.delivery_status}
                                            className="rounded-lg text-xs py-1 px-2 border border-gray-300 bg-white"
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
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Pagination */}
                {total_orders > parPage && (
                    <div className="w-full flex justify-center md:justify-end mt-4 bottom-4 right-4">
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
            
            {/* Empty state */}
            {orders && orders.length === 0 && (
                <div className="bg-white p-8 rounded-lg shadow-sm mt-5 text-center">
                    <h3 className="text-lg font-medium text-gray-700">Không có đơn hàng nào</h3>
                    <p className="text-gray-500 mt-2">Chưa có đơn hàng nào phù hợp với bộ lọc hiện tại</p>
                </div>
            )}
        </div>
    );
};

export default SellerOrder;

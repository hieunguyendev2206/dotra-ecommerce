/* eslint-disable no-unused-vars */
import {Badge, Table} from "flowbite-react";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import icons from "../../../assets/icons";
import {useEffect} from "react";
import {formatDate, formateCurrency} from "../../../utils/formate";
import {get_seller_chart_data, get_seller_dashboard_data,} from "../../../store/reducers/dashboard.reducers";
import Chart from "react-apexcharts";
import {FaEye} from "react-icons/fa";

const SellerDashboard = () => {
    const {
        AiOutlineShoppingCart,
        FaMoneyCheckDollar,
        FaProductHunt,
        HiOutlineUserGroup,
    } = icons;

    const dispatch = useDispatch();
    const {
        total_amount,
        total_order,
        total_product,
        total_customer,
        recent_order,
        monthlyOrderCounts,
        monthlyProductCounts,
        monthlyUniqueCustomerCounts,
        monthlyRevenues,
        percentagesArray,
    } = useSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(get_seller_dashboard_data());
        dispatch(get_seller_chart_data());
    }, [dispatch]);

    function translateStatusToVietnamese(status) {
        const statusTranslations = {
            processing: "Đang xử lý",
            shipping: "Đang vận chuyển",
            delivered: "Đã giao",
            canceled: "Đã hủy",
        };

        return statusTranslations[status] || status;
    }

    const state = {
        series: [
            {
                name: "Đơn hàng",
                data: monthlyOrderCounts,
            },

            {
                name: "Sản phẩm",
                data: monthlyProductCounts,
            },
            {
                name: "Khách hàng",
                data: monthlyUniqueCustomerCounts,
            },
        ],
        options: {
            title: {
                text: "BIỂU ĐỒ THỐNG KÊ",
                align: "center",
                margin: 10,
                offsetX: 0,
                offsetY: 0,
                floating: false,
                style: {
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#263238",
                },
            },
            color: ["#181ee8", "#181ee8"],
            plotOptions: {
                radius: 30,
            },
            chart: {
                background: "white",
            },
            dataLables: {
                enable: false,
            },
            stroke: {
                show: true,
                curve: ["smooth", "straight", "stepline"],
                lineCap: "butt",
                color: "#f0f0f0",
                width: 1.5,
                dashArray: 0,
            },
            xaxis: {
                categories: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apl",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                ],
            },
            legend: {
                position: "top",
            },
            responsive: [
                {
                    breakpoint: 565,
                    xaxis: {
                        categories: [
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apl",
                            "May",
                            "Jun",
                            "Jul",
                            "Aug",
                            "Sep",
                            "Oct",
                            "Nov",
                            "Dec",
                        ],
                    },
                    options: {
                        title: {
                            text: "BIỂU ĐỒ THỐNG KÊ",
                            align: "center",
                            margin: 10,
                            offsetX: 0,
                            offsetY: 0,
                            floating: false,
                            style: {
                                fontSize: "14px",
                                fontWeight: "bold",
                                color: "#263238",
                            },
                        },
                        plotOptions: {
                            bar: {
                                horizontal: true,
                            },
                        },
                        chart: {
                            height: "550px",
                        },
                    },
                },
            ],
        },
    };

    const line = {
        series: [
            {
                name: "Doanh thu",
                data: monthlyRevenues,
            },
        ],
        options: {
            title: {
                text: "BIỂU ĐỒ THỐNG KÊ DOANH THU",
                align: "center",
                margin: 10,
                offsetX: 0,
                offsetY: 0,
                floating: false,
                style: {
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#263238",
                },
            },
            color: ["#181ee8", "#181ee8"],
            plotOptions: {
                radius: 30,
            },
            chart: {
                background: "white",
            },
            dataLables: {
                enable: false,
            },
            stroke: {
                show: true,
                curve: ["smooth", "straight", "stepline"],
                lineCap: "butt",
                color: "#f0f0f0",
                width: 3.5,
                dashArray: 0,
            },
            xaxis: {
                categories: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apl",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                ],
            },
            legend: {
                position: "top",
            },
            responsive: [
                {
                    breakpoint: 565,
                    xaxis: {
                        categories: [
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apl",
                            "May",
                            "Jun",
                            "Jul",
                            "Aug",
                            "Sep",
                            "Oct",
                            "Nov",
                            "Dec",
                        ],
                    },
                    options: {
                        title: {
                            text: "BIỂU ĐỒ THỐNG KÊ DOANH THU",
                            align: "center",
                            margin: 10,
                            offsetX: 0,
                            offsetY: 0,
                            floating: false,
                            style: {
                                fontSize: "14px",
                                fontWeight: "bold",
                                color: "#263238",
                            },
                        },
                        plotOptions: {
                            bar: {
                                horizontal: true,
                            },
                        },
                        chart: {
                            height: "550px",
                        },
                    },
                },
            ],
        },
    };

    const donut = {
        series: percentagesArray.map((p) => p.percentage),
        options: {
            chart: {
                type: "donut",
            },
            labels: percentagesArray.map((p) =>
                translateStatusToVietnamese(p.status)
            ), // Chuyển đổi trạng thái sang tiếng Việt
            colors: ["#FFFF00", "#0000FF", "#00FF00", "#FF0000"],
            title: {
                text: "BIỂU ĐỒ THỐNG KÊ TỶ LỆ ĐẶT HÀNG",
                align: "center",
                style: {
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#263238",
                },
            },
            responsive: [
                {
                    breakpoint: 325,
                    options: {
                        chart: {
                            width: 200,
                        },
                        legend: {
                            position: "bottom",
                        },
                    },
                },
            ],
        },
    };

    return (
        <div className="px-2 md:px-7 py-5 bg-[#dae1e7]">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex justify-between items-center p-5 bg-white rounded-md gap-3">   
                    <div className="flex flex-col justify-start items-start text-gray-600">
                        <span className="text-sm font-medium">Tổng Doanh Thu</span>
                        <h2 className="text-xl font-semibold">
                            {formateCurrency(total_amount)}
                        </h2>
                    </div>
                    {/* eslint-disable-next-line no-mixed-spaces-and-tabs */}
	    	    <div
                        className="w-[46px] h-[47px] rounded-full bg-green-400 flex justify-center items-center text-xl">
                        <FaMoneyCheckDollar size={22} className="text-white shadow-lg"/>
                    </div>
                </div>

                <div className="flex justify-between items-center p-5 bg-white rounded-md gap-3">
                    <div className="flex flex-col justify-start items-start text-gray-600">
                        <span className="text-sm font-medium">Sản Phẩm</span>
                        <h2 className="text-xl font-semibold">{total_product}</h2>
                    </div>
                    <div
                        className="w-[46px] h-[47px] rounded-full bg-orange-400 flex justify-center items-center text-xl">
                        <FaProductHunt size={22} className="text-white shadow-lg"/>
                    </div>
                </div>

                <div className="flex justify-between items-center p-5 bg-white rounded-md gap-3">
                    <div className="flex flex-col justify-start items-start text-gray-600">
                        <span className="text-sm font-medium">Đơn Hàng</span>
                        <h2 className="text-xl font-semibold">{total_order}</h2>
                    </div>
                    <div className="w-[46px] h-[47px] rounded-full bg-red-400 flex justify-center items-center text-xl">
                        <AiOutlineShoppingCart size={22} className="text-white shadow-lg"/>
                    </div>
                </div>

                <div className="flex justify-between items-center p-5 bg-white rounded-md gap-3">
                    <div className="flex flex-col justify-start items-start text-gray-600">
                        <span className="text-sm font-medium">Khách hàng</span>
                        <h2 className="text-xl font-semibold">{total_customer}</h2>
                    </div>
                    <div
                        className="w-[46px] h-[47px] rounded-full bg-yellow-400 flex justify-center items-center text-xl">
                        <HiOutlineUserGroup size={22} className="text-white shadow-lg"/>
                    </div>
                </div>
            </div>
            <div className="w-full mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white rounded-md p-5">
                    <Chart
                        options={line.options}
                        series={line.series}
                        type="line"
                        className="w-full h-auto"
                    />
                </div>
                <div className="bg-white rounded-md p-8">
                    <Chart
                        options={donut.options}
                        series={donut.series}
                        type="donut"
	    		        heigh={400}
                        className="w-full h-auto"
                    />
                </div>
            </div>
            <div className="bg-white rounded-md p-8 mt-5">
                <Chart
                    options={state.options}
                    series={state.series}
                    type="bar"
	    	    height={350}
                    className="w-full h-auto"
                />
            </div>
            <div className="overflow-x-auto mt-10">
                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>Mã Đơn Hàng</Table.HeadCell>
                        <Table.HeadCell>Ngày Đặt Hàng</Table.HeadCell>
                        <Table.HeadCell>Khách Hàng</Table.HeadCell>
                        <Table.HeadCell>Đơn Giá</Table.HeadCell>
                        <Table.HeadCell>Thanh Toán</Table.HeadCell>
                        <Table.HeadCell>Tình Trạng</Table.HeadCell>
                        <Table.HeadCell></Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {recent_order &&
                            recent_order.map((o, index) => (
                                <Table.Row
                                    key={o._id}
                                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <Table.Cell>#{o._id.slice(0, 15) + "..."}</Table.Cell>
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
                                        <div className="flex flex-warp gap-4">
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
            </div>
        </div>
    );
};

export default SellerDashboard;

/* eslint-disable no-unused-vars */
import {Badge, Table} from "flowbite-react";
import icons from "../../../assets/icons";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {get_seller_revenue, message_clear, send_request_withdrawal,} from "../../../store/reducers/payment.reducers";
import {formatDate, formateCurrency} from "../../../utils/formate";
import CircleLoader from "react-spinners/CircleLoader";
import {toast} from "react-toastify";

const RequestPayment = () => {
    const {FaMoneyCheckDollar} = icons;
    const [amount, setAmount] = useState(0);
    const dispatch = useDispatch();
    const {user_info} = useSelector((state) => state.auth);
    const {
        success_message,
        error_message,
        pendingWithdrawalRequest,
        successWithdrawalRequest,
        pendingAmount,
        successAmount,
        totalAmount,
        availableAmount,
        loading,
    } = useSelector((state) => state.payment);

    useEffect(() => {
        dispatch(get_seller_revenue(user_info._id));
    }, [dispatch, user_info._id]);

    const submitSendWithdrawalRequest = (e) => {
        e.preventDefault();

        const withdrawalAmount = Number(amount);

        if (!withdrawalAmount) {
            toast.error("Vui lòng nhập số tiền hợp lệ.");
            return;
        }

        if (withdrawalAmount < 50000) {
            toast.error("Số tiền rút tối thiểu là 50,000.");
            return;
        }

        if (withdrawalAmount > availableAmount) {
            toast.error("Số tiền rút không được vượt quá số dư hiện tại.");
            return;
        }

        dispatch(
            send_request_withdrawal({
                sellerId: user_info._id,
                amount: withdrawalAmount
            })
        );
    };

    useEffect(() => {
        if (success_message) {
            toast.success(success_message);
            dispatch(message_clear());
            setAmount(0);
        }
        if (error_message) {
            toast.error(error_message);
            dispatch(message_clear());
        }
    }, [success_message, error_message, dispatch]);

    const exchangeRate = 25473;

    return (
        <div className="px-2 md:px-7 py-5 bg-[#dae1e7]">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7">
                <div className="flex justify-between items-center p-5 bg-white rounded-md gap-3">
                    <div className="flex flex-col justify-start items-start text-gray-600">
                        <span className="text-sm font-medium">Tổng Doanh Thu</span>
                        <h2 className="text-xl font-semibold">
                            {formateCurrency(totalAmount)}
                        </h2>
                    </div>
                    <div
                        className="w-[46px] h-[47px] rounded-full bg-green-400 flex justify-center items-center text-xl">
                        <FaMoneyCheckDollar size={22} className="text-white shadow-lg"/>
                    </div>
                </div>
                <div className="flex justify-between items-center p-5 bg-white rounded-md gap-3">
                    <div className="flex flex-col justify-start items-start text-gray-600">
                        <span className="text-sm font-medium">Số dư hiện tại</span>
                        <h2 className="text-xl font-semibold">
                            {formateCurrency(availableAmount - successAmount * exchangeRate)}
                        </h2>
                    </div>
                    <div
                        className="w-[46px] h-[47px] rounded-full bg-orange-400 flex justify-center items-center text-xl">
                        <FaMoneyCheckDollar size={22} className="text-white shadow-lg"/>
                    </div>
                </div>

                <div className="flex justify-between items-center p-5 bg-white rounded-md gap-3">
                    <div className="flex flex-col justify-start items-start text-gray-600">
                        <span className="text-sm font-medium">Số Tiền Đã Rút</span>
                        <h2 className="text-xl font-semibold">
                            {formateCurrency(successAmount * exchangeRate)}
                        </h2>
                    </div>
                    <div className="w-[46px] h-[47px] rounded-full bg-red-400 flex justify-center items-center text-xl">
                        <FaMoneyCheckDollar size={22} className="text-white shadow-lg"/>
                    </div>
                </div>

                <div className="flex justify-between items-center p-5 bg-white rounded-md gap-3">
                    <div className="flex flex-col justify-start items-start text-gray-600">
                        <span className="text-sm font-medium">Số tiền chờ xác nhận</span>
                        <h2 className="text-xl font-semibold">
                            {formateCurrency(pendingAmount * exchangeRate)}
                        </h2>
                    </div>
                    <div
                        className="w-[46px] h-[47px] rounded-full bg-yellow-400 flex justify-center items-center text-xl">
                        <FaMoneyCheckDollar size={22} className="text-white shadow-lg"/>
                    </div>
                </div>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 pb-4 mt-5 ">
                <div className="rounded-md p-5">
                    <span className="font-semibold">Gửi yêu cầu rút tiền</span>
                    <div className="py-5">
                        <form onSubmit={submitSendWithdrawalRequest}>
                            <div className="flex gap-3 flex-wrap">
                                <input
                                    onChange={(e) => setAmount(e.target.value)}
                                    value={amount}
                                    required
                                    type="number"
                                    min="0"
                                    placeholder="Nhập số tiền cần rút"
                                    className="input-bordered w-[80%] rounded-md bg-white"
                                />
                                <button
                                    disabled={loading ? true : false}
                                    type="submit"
                                    className="bg-red-500 hover:shadow-red-500/50 hover:shadow-lg text-white rounded-md px-7 py-2"
                                >
                                    {loading ? <CircleLoader className="transition-transform"/> : "Gửi"}
                                </button>
                            </div>
                        </form>
                    </div>
                    <span className="font-semibold">Yêu cầu đang được xử lý</span>
                    <div className="overflow-x-auto mt-5">
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell>STT</Table.HeadCell>
                                <Table.HeadCell>Số tiền rút</Table.HeadCell>
                                <Table.HeadCell>Trạng thái</Table.HeadCell>
                                <Table.HeadCell>Ngày gửi yêu cầu</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {pendingWithdrawalRequest &&
                                    pendingWithdrawalRequest.map((r, index) => (
                                        <Table.Row
                                            key={r._id}
                                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                        >
                                            <Table.Cell
                                                className="whitespace-nowrap overflow-hidden text-ellipsis truncate font-medium text-gray-900 dark:text-white">
                                                {index + 1}
                                            </Table.Cell>
                                            <Table.Cell
                                                className="whitespace-nowrap overflow-hidden text-ellipsis truncate font-medium text-gray-900 dark:text-white">
                                                {formateCurrency(r.amount * exchangeRate)}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {r.status === "pending" && (
                                                    <Badge
                                                        color="warning"
                                                        className="inline-block px-2 py-1"
                                                    >
                                                        Chờ xử lý
                                                    </Badge>
                                                )}
                                            </Table.Cell>
                                            <Table.Cell>{formatDate(r.createdAt)}</Table.Cell>
                                        </Table.Row>
                                    ))}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
                <div className="bg-white rounded-md p-5">
                    <span className="font-semibold">Lịch sử rút tiền</span>
                    <div className="overflow-x-auto mt-5">
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell>STT</Table.HeadCell>
                                <Table.HeadCell>Số tiền rút</Table.HeadCell>
                                <Table.HeadCell>Trạng thái</Table.HeadCell>
                                <Table.HeadCell>Ngày nhận</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {successWithdrawalRequest &&
                                    successWithdrawalRequest.map((s, index) => (
                                        <Table.Row
                                            key={s._id}
                                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                        >
                                            <Table.Cell
                                                className="whitespace-nowrap overflow-hidden text-ellipsis truncate font-medium text-gray-900 dark:text-white">
                                                {index + 1}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {formateCurrency(s.amount * exchangeRate)}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Badge
                                                    color="success"
                                                    className="inline-block px-2 py-1"
                                                >
                                                    Đã nhận
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell>{formatDate(s.createdAt)}</Table.Cell>
                                        </Table.Row>
                                    ))}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestPayment;

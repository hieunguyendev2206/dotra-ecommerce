/* eslint-disable no-unused-vars */
import {Badge, Button, Table} from "flowbite-react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    admin_receive_withdrawal_request,
    confirm_withdrawal_request,
    message_clear,
} from "../../../store/reducers/payment.reducers";
import {formatDate, formateCurrency} from "../../../utils/formate";
import {toast} from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

const RequestPayment = () => {
    const dispatch = useDispatch();
    const {pendingWithdrawalRequest, loading, success_message} = useSelector((state) => state.payment);

    const exchangeRate = 25473;

    useEffect(() => {
        dispatch(admin_receive_withdrawal_request());
    }, []);

    useEffect(() => {
        if (success_message) {
            toast.success(success_message);
            dispatch(message_clear());
        }
    }, [success_message]);

    return (<div className="px-2 md:px-7 py-5 bg-[#dae1e7]">
        <h1 className="text-xl font-bold uppercase mt-2">
            Danh sách yêu cầu rút tiền
        </h1>
        <div className="overflow-x-auto mt-5">
            <Table hoverable>
                <Table.Head>
                    <Table.HeadCell>STT</Table.HeadCell>
                    <Table.HeadCell>Mã seller</Table.HeadCell>
                    <Table.HeadCell>Ngày Tạo Yêu Cầu</Table.HeadCell>
                    <Table.HeadCell>Số Tiền Rút</Table.HeadCell>
                    <Table.HeadCell>Trạng Thái</Table.HeadCell>
                    <Table.HeadCell></Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {pendingWithdrawalRequest && pendingWithdrawalRequest.map((r, index) => (<Table.Row
                        key={r._id}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                        <Table.Cell>{index + 1}</Table.Cell>
                        <Table.Cell>#{r._id.slice(0, 5)}...{r._id.slice(-5)}</Table.Cell>
                        <Table.Cell>{formatDate(r.createdAt)}</Table.Cell>
                        <Table.Cell>
                            <Badge color="gray" className="inline-block px-2 py-1">
                                {formateCurrency(r.amount * exchangeRate)}
                            </Badge>
                        </Table.Cell>
                        <Table.Cell>
                            {r.status === "pending" && (<Badge color="warning" className="inline-block px-2 py-1">
                                Chờ xử lý
                            </Badge>)}
                        </Table.Cell>
                        <Table.Cell>
                            <Button
                                onClick={() => dispatch(confirm_withdrawal_request(r._id))}
                                disabled={loading ? true : false}
                                color="success"
                            >
                                {loading ? <ClipLoader size={20}/> : "Xác nhận"}
                            </Button>
                        </Table.Cell>
                    </Table.Row>))}
                </Table.Body>
            </Table>
        </div>
    </div>);
};

export default RequestPayment;

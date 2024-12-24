/* eslint-disable no-unused-vars */
import {Badge, Button} from "flowbite-react";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {get_seller_details, message_clear, seller_update_status,} from "../../../store/reducers/seller.reducer";
import {toast} from "react-toastify";
import {formatDate} from "../../../utils/formate";

const SellerDetails = () => {
    const {sellerId} = useParams();
    const dispatch = useDispatch();
    const [status, setStatus] = useState("");
    const [isStatusChangedByUser, setIsStatusChangedByUser] = useState(false);
    const {seller_info, success_message, error_message} = useSelector((state) => state.seller);

    useEffect(() => {
        dispatch(get_seller_details(sellerId));
    }, [sellerId]);

    useEffect(() => {
        if (!isStatusChangedByUser) {
            setStatus(seller_info.status);
        }
    }, [seller_info, isStatusChangedByUser]);

    useEffect(() => {
        setStatus(seller_info.status);
    }, [seller_info]);

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(seller_update_status({
            sellerId, status,
        }));
        setIsStatusChangedByUser(false);
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
    });

    console.log(formatDate(seller_info.createdAt));

    return (<div className="px-2 lg:px-7 pt-5 bg-[#dae1e7]">
        <div className="flex justify-center items-center py-3">
            <div>
                {seller_info.image ? (<img
                    src={seller_info.image}
                    className="w-full h-[100px] rounded-full"
                    alt=""
                />) : (<img
                    src="/src/assets/img/user.jpg"
                    className="w-full h-[100px] rounded-full"
                    alt=""
                />)}
            </div>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 pb-4 mt-2">
            <div className="bg-white rounded-md p-5">
                <span className="font-semibold">THÔNG TIN CÁ NHÂN</span>
                <div className="flex justify-start items-center mt-4">
                    <label htmlFor="email" className="w-[25%]">
                        Mã seller:
                    </label>
                    <input
                        readOnly
                        value={seller_info._id}
                        disabled
                        type="text"
                        name="email"
                        className="rounded-md border-gray-600 input-md input-bordered w-[75%]"
                    />
                </div>
                <div className="flex justify-start items-center mt-4">
                    <label htmlFor="email" className="w-[25%]">
                        Họ và tên:
                    </label>
                    <input
                        readOnly
                        value={seller_info.name}
                        disabled
                        type="text"
                        name="email"
                        className="rounded-md border-gray-600 input-md input-bordered w-[75%]"
                    />
                </div>
                <div className="flex justify-start items-center mt-4">
                    <label htmlFor="email" className="w-[25%]">
                        Email:
                    </label>
                    <input
                        readOnly
                        value={seller_info.email}
                        disabled
                        type="text"
                        name="email"
                        className="rounded-md border-gray-600 input-md input-bordered w-[75%]"
                    />
                </div>
                <div className="flex justify-start items-center mt-4">
                    <label htmlFor="status" className="w-[25%]">
                        Xác thực email:
                    </label>
                    {seller_info.isVerified ? (<Badge color="success">Đã xác thực</Badge>) : (
                        <Badge color="warning">Chưa xác thực</Badge>)}
                </div>
                <div className="flex justify-start items-center mt-4">
                    <label htmlFor="status" className="w-[25%]">
                        Trạng thái:
                    </label>
                    {(() => {
                        if (seller_info.status === "active") {
                            return <Badge color="success">Hoạt động</Badge>;
                        } else if (seller_info.status === "pending") {
                            return <Badge color="warning">Chờ xác nhận</Badge>;
                        } else {
                            return <Badge color="failure">Bị khóa</Badge>;
                        }
                    })(seller_info.status)}
                </div>
                <div className="flex justify-start items-center mt-4">
                    <label htmlFor="status" className="w-[25%]">
                        TK thanh toán:
                    </label>
                    {seller_info.payment === "unactive" ? (<Badge color="failure">Chưa kích hoạt</Badge>) : (
                        <Badge color="success">Đã kích hoạt</Badge>)}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="flex items-center w-[80%]">
                        <select
                            onChange={(e) => {
                                setStatus(e.target.value);
                                setIsStatusChangedByUser(true);
                            }}
                            value={status}
                            required
                            className="mt-5 py-2 px-3 hover:border-indigo-500 outline-none bg-[#eeeeee] border border-slate-400 rounded-md"
                        >
                            <option value="" disabled>
                                --Chọn trạng thái---
                            </option>
                            <option value="pending" disabled>
                                Chờ xác nhận
                            </option>
                            <option value="active">Hoạt động</option>
                            <option value="deactive">Vô hiệu hóa</option>
                        </select>
                        <Button type="submit" className="mt-6 ml-8" color="success">
                            Xác nhận
                        </Button>
                    </div>
                </form>
            </div>
            <div className="bg-white rounded-md p-5">
                <span className="font-semibold">THÔNG TIN CỬA HÀNG</span>
                <div className="flex justify-start items-center mt-4">
                    <label htmlFor="createAt" className="w-[25%]">
                        Ngày tạo:
                    </label>
                    <input
                        readOnly
                        value={formatDate(seller_info.createdAt)}
                        disabled
                        type="text"
                        name="createAt"
                        className="rounded-md border-gray-600 input-md input-bordered w-[75%]"
                    />
                </div>
                <div className="flex justify-start items-center mt-4">
                    <label htmlFor="shop_name" className="w-[25%]">
                        Tên cửa hàng:
                    </label>
                    <input
                        readOnly
                        value={seller_info?.shop_info?.shop_name}
                        disabled
                        type="text"
                        name="shop_name"
                        className="rounded-md border-gray-600 input-md input-bordered w-[75%]"
                    />
                </div>
                <div className="flex justify-start items-center mt-4">
                    <label htmlFor="province" className="w-[25%]">
                        Tỉnh/Thành phố:
                    </label>
                    <input
                        readOnly
                        value={seller_info?.shop_info?.province}
                        disabled
                        type="text"
                        name="province"
                        className="rounded-md border-gray-600 input-md input-bordered w-[75%]"
                    />
                </div>
                <div className="flex justify-start items-center mt-4">
                    <label htmlFor="district" className="w-[25%]">
                        Quận/Huyện:
                    </label>
                    <input
                        readOnly
                        value={seller_info?.shop_info?.district}
                        disabled
                        type="text"
                        name="district"
                        className="rounded-md border-gray-600 input-md input-bordered w-[75%]"
                    />
                </div>
                <div className="flex justify-start items-center mt-4">
                    <label htmlFor="ward" className="w-[25%]">
                        Xã/Phường:
                    </label>
                    <input
                        readOnly
                        value={seller_info?.shop_info?.ward}
                        disabled
                        type="text"
                        name="ward"
                        className="rounded-md border-gray-600 input-md input-bordered w-[75%]"
                    />
                </div>
            </div>
        </div>
    </div>);
};

export default SellerDetails;

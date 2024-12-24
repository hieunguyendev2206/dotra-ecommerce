/* eslint-disable no-unused-vars */
import {ClipLoader} from "react-spinners";
import {Badge, Button, Modal} from "flowbite-react";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    add_profile_info,
    change_password,
    forgot_password,
    message_clear,
    upload_profile_image,
} from "../../../store/reducers/auth.reducers";
import {toast} from "react-toastify";
import icons from "../../../assets/icons";
import {create_stripe_connect_account} from "../../../store/reducers/payment.reducers";

const Profile = () => {
    const {FiUploadCloud, AiOutlineEye, AiOutlineEyeInvisible} = icons;
    const dispatch = useDispatch();
    const {loading, user_info, success_message, error_message} = useSelector(
        (state) => state.auth
    );
    const [shopInfo, setShopInfo] = useState({
        shop_name: "",
        province: "",
        district: "",
        ward: "",
    });
    const [visibleOldPassword, setVisibleOldPassword] = useState(false);
    const [visibleNewPassword, setVisibleNewPassword] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [changePassword, setChangePassword] = useState({
        old_password: "",
        new_password: "",
    });

    const handleUploadImage = (event) => {
        const images = event.target.files[0];
        if (images) {
            const formData = new FormData();
            formData.append("image", images);
            dispatch(upload_profile_image(formData));
        }
    };

    useEffect(() => {
        if (success_message) {
            toast.success(success_message);
            dispatch(message_clear());
            setChangePassword({
                old_password: "",
                new_password: "",
            });
            setOpenModal(false);
        }
        if (error_message) {
            toast.error(error_message);
            dispatch(message_clear());
        }
    }, [success_message, error_message, dispatch]);

    const handleInput = (event) => {
        setShopInfo({
            ...shopInfo,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmitAddInfoProfile = (event) => {
        event.preventDefault();
        dispatch(add_profile_info(shopInfo));
    };

    const handleCreateAccountClick = () => {
        dispatch(create_stripe_connect_account());
    };

    const onSubmitChangePassword = (event) => {
        event.preventDefault();
        dispatch(change_password(changePassword));
    };

    const handleForgotPassword = () => {
        dispatch(forgot_password({email: user_info.email, name: user_info.name}));
    };

    return (
        <div className="px-2 md:px-7 py-5 bg-[#dae1e7]">
            <h1 className="text-xl font-bold uppercase my-2">Hồ sơ cá nhân</h1>
            <div className="w-full flex flex-wrap">
                <div className="w-full md:w-6/12">
                    <div className="w-full p-6 bg-white">
                        <div className="flex justify-center items-center bg-[#dae1e7] py-3">
                            {user_info?.image ? (
                                <label
                                    htmlFor="img"
                                    className="h-[250px] w-[300px] relative p-3 cursor-pointer overflow-hidden"
                                >
                                    <img
                                        src={user_info.image}
                                        alt=""
                                        className="w-full h-full rounded-lg"
                                    />
                                    {loading && (
                                        <div
                                            className="bg-slate-400 absolute left-0 top-0 w-full h-full opacity-70 flex justify-center items-center z-20">
                                          <span>
                                            <ClipLoader/>
                                          </span>
                                        </div>
                                    )}
                                </label>
                            ) : (
                                <label
                                    htmlFor="img"
                                    className="my-3 rounded-md flex justify-center items-center flex-col h-[250px] cursor-pointer border-2 border-black border-dashed hover:border-indigo-500 w-[80%]"
                                >
                                    <span>
                                      <FiUploadCloud size={40}/>
                                    </span>
                                    <span>Chọn ảnh</span>
                                    <span className="italic text-gray-600">
                                      (Định dạng file ảnh: *.png, *.jpg, *.jpeg)
                                    </span>
                                    {loading && (
                                        <div
                                            className="bg-slate-600 absolute left-0 top-0 w-full h-full opacity-70 flex justify-center items-center z-20">
                                          <span>
                                            <ClipLoader/>
                                          </span>
                                        </div>
                                    )}
                                </label>
                            )}
                            <input
                                onChange={handleUploadImage}
                                type="file"
                                className="hidden"
                                id="img"
                            />
                        </div>
                        <div className="py-2">
                            <div className="flex justify-between text-sm flex-col gap-2 mt-4 rounded-md relative">
                                <div className="flex justify-start items-center">
                                    <label htmlFor="name" className="w-[25%] font-semibold bg-white">
                                        Họ và tên:
                                    </label>
                                    <input
                                        readOnly
                                        value={user_info.name}
                                        disabled
                                        type="text"
                                        name="name"
                                        className="input-md input-bordered w-[75%] border-gray-600 text-gray-600 rounded-md"
                                    />
                                </div>
                                <div className="flex justify-start items-center mt-2">
                                    <label htmlFor="email" className="w-[25%] font-semibold">
                                        Email:
                                    </label>
                                    <input
                                        readOnly
                                        value={user_info.email}
                                        disabled
                                        type="text"
                                        name="email"
                                        className="input-md input-bordered w-[75%] border-gray-600 text-gray-600 rounded-md"
                                    />
                                </div>
                                <div className="flex justify-start items-center mt-4">
                                    <label htmlFor="role" className="w-[25%] font-semibold">
                                        Role:
                                    </label>
                                    <Badge color="purple">{user_info.role}</Badge>
                                </div>
                                <div className="flex justify-start items-center mt-4">
                                    <label htmlFor="status" className="w-[25%] font-semibold">
                                        Trạng thái:
                                    </label>
                                    {(() => {
                                        if (user_info.status === "active") {
                                            return <Badge color="success">Hoạt động</Badge>;
                                        } else if (user_info.status === "pending") {
                                            return <Badge color="warning">Chờ xác nhận</Badge>;
                                        } else {
                                            return <Badge color="failure">Bị khóa</Badge>;
                                        }
                                    })(user_info.status)}
                                </div>
                                <div className="flex justify-start items-center mt-4">
                                    <label htmlFor="status" className="w-[25%] font-semibold">
                                        Tài khoản thanh toán:
                                    </label>
                                    {user_info.payment === "unactive" ? (
                                        <Button
                                            onClick={handleCreateAccountClick}
                                            color="failure"
                                            size="xs"
                                        >
                                            Nhấn để kích hoạt
                                        </Button>
                                    ) : (
                                        <Badge color="success">Đã kích hoạt</Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 border-b-2 border-black"></div>
                        <div>
                            {user_info?.shop_info ? (
                                <div className="flex justify-between text-sm flex-col gap-2 p-4 rounded-md relative">
                                    <div className="flex justify-start items-center">
                                        <label htmlFor="" className="w-[25%] font-semibold">
                                            Tên shop:
                                        </label>
                                        <input
                                            readOnly
                                            value={user_info.shop_info.shop_name}
                                            disabled
                                            type="text"
                                            className="input-md input-bordered w-[75%] border-gray-600 text-gray-600 rounded-md"
                                        />
                                    </div>
                                    <div className="flex justify-start items-center mt-4">
                                        <label htmlFor="" className="w-[25%] font-semibold">
                                            Địa chỉ:
                                        </label>
                                        <input
                                            readOnly
                                            value={`${user_info.shop_info.ward}, ${user_info.shop_info.district}, ${user_info.shop_info.province}`}
                                            disabled
                                            type="text"
                                            className="input-md input-bordered w-[75%] border-gray-600 text-gray-600 rounded-md"
                                        />
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <Button color="success" size="md">
                                            Sửa
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitAddInfoProfile}>
                                    <div className="flex justify-start items-center mt-4">
                                        <label
                                            htmlFor="shop_name"
                                            className="w-[25%] font-semibold"
                                        >
                                            Tên shop:
                                        </label>
                                        <input
                                            type="text"
                                            onChange={handleInput}
                                            value={shopInfo.shop_name}
                                            name="shop_name"
                                            placeholder="Nhập tên shop..."
                                            className="input input-md input-bordered w-[75%]"
                                        />
                                    </div>
                                    <div className="flex justify-start items-center mt-4">
                                        <label htmlFor="province" className="w-[25%] font-semibold">
                                            Tỉnh/Thành phố:
                                        </label>
                                        <input
                                            type="text"
                                            onChange={handleInput}
                                            value={shopInfo.province}
                                            name="province"
                                            placeholder="Nhập tên tỉnh, thành phố..."
                                            className="input input-md input-bordered w-[75%]"
                                        />
                                    </div>
                                    <div className="flex justify-start items-center mt-4">
                                        <label htmlFor="district" className="w-[25%] font-semibold">
                                            Quận/Huyện:
                                        </label>
                                        <input
                                            type="text"
                                            onChange={handleInput}
                                            value={shopInfo.district}
                                            name="district"
                                            placeholder="Nhập tên quận, huyện..."
                                            className="input input-md input-bordered w-[75%]"
                                        />
                                    </div>
                                    <div className="flex justify-start items-center mt-4">
                                        <label htmlFor="ward" className="w-[25%] font-semibold">
                                            Xã/Phường:
                                        </label>
                                        <input
                                            type="text"
                                            onChange={handleInput}
                                            value={shopInfo.ward}
                                            name="ward"
                                            placeholder="Nhập tên xã phường..."
                                            className="input input-md input-bordered w-[75%]"
                                        />
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <Button type="submit" color="failure" size="md">
                                            Thêm
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-6/12">
                    <div className="w-full pl-0 md:pl-7 mt-6 md:mt-0">
                        <div className="bg-white rounded-md p-4">
                            <h1 className="text-lg mb-3 font-semibold">Thay đổi mật khẩu</h1>
                            <form onSubmit={onSubmitChangePassword}>
                                <div className="flex justify-start items-center">
                                    <label
                                        htmlFor="old_password"
                                        className="w-[25%] font-semibold"
                                    >
                                        Mật khẩu cũ:
                                    </label>
                                    <input
                                        onChange={(e) =>
                                            setChangePassword({
                                                ...changePassword,
                                                old_password: e.target.value,
                                            })
                                        }
                                        value={changePassword.old_password}
                                        placeholder="Nhập mật khẩu cũ..."
                                        type={visibleOldPassword ? "text" : "password"}
                                        name="old_password"
                                        className="input-md input-bordered w-[75%] border-gray-600 text-black rounded-md relative"
                                    />
                                    {visibleOldPassword ? (
                                        <AiOutlineEye
                                            className="cursor-pointer absolute right-0 mr-14"
                                            size={25}
                                            onClick={() => setVisibleOldPassword(false)}
                                        />
                                    ) : (
                                        <AiOutlineEyeInvisible
                                            className="cursor-pointer absolute right-0 mr-14"
                                            size={25}
                                            onClick={() => setVisibleOldPassword(true)}
                                        />
                                    )}
                                </div>
                                <div className="flex justify-start items-center mt-4">
                                    <label
                                        htmlFor="new_password"
                                        className="w-[25%] font-semibold"
                                    >
                                        Mật khẩu mới:
                                    </label>
                                    <input
                                        onChange={(e) =>
                                            setChangePassword({
                                                ...changePassword,
                                                new_password: e.target.value,
                                            })
                                        }
                                        value={changePassword.new_password}
                                        name="new_password"
                                        placeholder="Nhập mật khẩu mới..."
                                        type={visibleNewPassword ? "text" : "password"}
                                        className="input-md input-bordered w-[75%] border-gray-600 text-black rounded-md relative"
                                    />
                                    {visibleNewPassword ? (
                                        <AiOutlineEye
                                            className="cursor-pointer absolute right-0 mr-14"
                                            size={25}
                                            onClick={() => setVisibleNewPassword(false)}
                                        />
                                    ) : (
                                        <AiOutlineEyeInvisible
                                            className="cursor-pointer absolute right-0 mr-14"
                                            size={25}
                                            onClick={() => setVisibleNewPassword(true)}
                                        />
                                    )}
                                </div>
                                <div className="flex justify-between">
                                    <div
                                        onClick={() => setOpenModal(true)}
                                        className="flex justify-start items-center mt-4 font-semibold text-red-500 cursor-pointer"
                                    >
                                        Quên mật khẩu?
                                    </div>
                                    <Modal
                                        size={"lg"}
                                        dismissible
                                        show={openModal}
                                        onClose={() => setOpenModal(false)}
                                    >
                                        <Modal.Header>Xác thực email</Modal.Header>
                                        <Modal.Body>
                                            <div className="space-y-6">
                                                <div className="text-center">
                                                    <p className="mb-5 text-md font-normal text-black dark:text-gray-400">
                                                        Xác nhận email để lấy lại mật khẩu
                                                    </p>
                                                    <div className="flex justify-center">
                                                        <input
                                                            readOnly
                                                            value={user_info.email}
                                                            disabled
                                                            type="text"
                                                            name="email"
                                                            className="input-md input-bordered w-[75%] border-gray-600 text-black rounded-l-md"
                                                        />
                                                        <button
                                                            onClick={handleForgotPassword}
                                                            className="rounded-r-lg py-2 px-3 bg-green-700 text-white"
                                                        >
                                                            {loading ? (
                                                                <ClipLoader
                                                                    color="white"
                                                                    size={10}
                                                                    className="p-2 mt-1"
                                                                />
                                                            ) : (
                                                                "Xác nhận"
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Modal.Body>
                                    </Modal>
                                    <div className="flex justify-end mt-4">
                                        <Button type="submit" color="success" size="md">
                                            Xác nhận
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

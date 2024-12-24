import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    get_customer_profile,
    update_customer_profile,
    upload_profile_image,
} from "../../store/reducers/customer.reducers";
import defaultCoverPicture from "../../assets/img/coverr.jpg";
import { ImSpinner2 } from "react-icons/im";

const CustomerProfile = () => {
    const dispatch = useDispatch();
    const { profile, loading } = useSelector((state) => state.customer);

    const [name, setName] = useState("");
    const [dob, setDob] = useState({ day: "", month: "", year: "" });
    const [gender, setGender] = useState("");
    const [bio, setBio] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        dispatch(get_customer_profile());
    }, [dispatch]);

    useEffect(() => {
        if (profile) {
            setName(profile.name || "");
            setGender(profile.gender || "");
            setBio(profile.bio || "");
            setPhone(profile.customerInfo?.phone || "");
            setAddress(profile.customerInfo?.address || "");
            if (profile.dob) {
                const date = new Date(profile.dob);
                setDob({
                    day: date.getDate().toString(),
                    month: (date.getMonth() + 1).toString(),
                    year: date.getFullYear().toString(),
                });
            }
        }
    }, [profile]);

    const handleImageUpload = (type, file) => {
        if (file) {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("type", type);

            dispatch(upload_profile_image({ type, formData }))
                .unwrap()
                .then(() => {
                    dispatch(get_customer_profile());
                })
                .catch((error) => {
                    console.error("Lỗi khi tải ảnh:", error);
                });
        }
    };

    const handleCoverChange = (e) => handleImageUpload("cover", e.target.files[0]);
    const handleAvatarChange = (e) => handleImageUpload("avatar", e.target.files[0]);

    const handleUpdateProfile = () => {
        const updatedInfo = {
            name,
            gender,
            dob: `${dob.year}-${dob.month}-${dob.day}`,
            bio,
            customerInfo: {
                phone,
                address,
            },
        };
        dispatch(update_customer_profile(updatedInfo))
            .unwrap()
            .then(() => {
                setIsEditing(false);
            })
            .catch((error) => {
                console.error("Lỗi cập nhật thông tin:", error);
            });
    };

    const generateOptions = (start, end) => {
        const options = [];
        for (let i = start; i <= end; i++) {
            options.push(
                <option key={i} value={i}>
                    {i}
                </option>
            );
        }
        return options;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <ImSpinner2 className="animate-spin text-5xl text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-w-full mx-auto bg-white shadow-xl rounded-lg p-6 space-y-6">
            <h1 className="text-2xl font-semibold text-gray-700">Thông tin cá nhân</h1>
            <div className="relative">
                <img
                    className="w-full h-48 object-cover rounded-lg cursor-pointer"
                    src={profile?.cover || defaultCoverPicture}
                    alt="Cover"
                    onClick={() => document.getElementById("cover-upload").click()}
                />
                <input
                    type="file"
                    id="cover-upload"
                    className="hidden"
                    onChange={handleCoverChange}
                />
            </div>

            <div className="flex items-start space-x-6">
                <div className="flex flex-col items-center space-y-4">
                    <img
                        src={profile?.avatar}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full border-4 border-gray-200 object-cover cursor-pointer"
                        onClick={() => document.getElementById("avatar-upload").click()}
                    />
                    <input
                        type="file"
                        id="avatar-upload"
                        className="hidden"
                        onChange={handleAvatarChange}
                    />
                    <button
                        className="text-black text-sm hover:text-[#f05251] transition duration-150"
                        onClick={() => document.getElementById("avatar-upload").click()}
                    >
                        Thay đổi ảnh đại diện
                    </button>
                </div>

                <div className="flex-1 space-y-4">
                    <label className="block">
                        <span className="text-gray-600 font-bold">Họ & Tên</span>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
                            placeholder="Họ & Tên"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!isEditing}
                        />
                    </label>

                    <label className="block">
                        <span className="text-gray-600 font-bold">Số điện thoại</span>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
                            placeholder="Số điện thoại"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={!isEditing}
                        />
                    </label>

                    <label className="block">
                        <span className="text-gray-600 font-bold">Địa chỉ</span>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
                            placeholder="Địa chỉ"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            disabled={!isEditing}
                        />
                    </label>

                    <div>
                        <span className="text-gray-600 font-bold">Ngày sinh</span>
                        <div className="flex space-x-4 mt-2">
                            <select
                                className="w-1/5 px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
                                value={dob.day}
                                onChange={(e) => setDob({ ...dob, day: e.target.value })}
                                disabled={!isEditing}
                            >
                                <option value="">Ngày</option>
                                {generateOptions(1, 31)}
                            </select>
                            <select
                                className="w-1/5 px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
                                value={dob.month}
                                onChange={(e) => setDob({ ...dob, month: e.target.value })}
                                disabled={!isEditing}
                            >
                                <option value="">Tháng</option>
                                {generateOptions(1, 12)}
                            </select>
                            <select
                                className="w-1/5 px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
                                value={dob.year}
                                onChange={(e) => setDob({ ...dob, year: e.target.value })}
                                disabled={!isEditing}
                            >
                                <option value="">Năm</option>
                                {generateOptions(1950, new Date().getFullYear())}
                            </select>
                        </div>
                    </div>

                    <div>
                        <span className="text-gray-600 font-bold">Giới tính</span>
                        <div className="flex space-x-6 mt-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={gender === "male"}
                                    onChange={(e) => setGender(e.target.value)}
                                    disabled={!isEditing}
                                />
                                <span className="ml-2 font-bold">Nam</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={gender === "female"}
                                    onChange={(e) => setGender(e.target.value)}
                                    disabled={!isEditing}
                                />
                                <span className="ml-2 font-bold">Nữ</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="other"
                                    checked={gender === "other"}
                                    onChange={(e) => setGender(e.target.value)}
                                    disabled={!isEditing}
                                />
                                <span className="ml-2 font-bold">Khác</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block">
                            <span className="text-gray-600 font-bold">Giới thiệu</span>
                            <textarea
                                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
                                placeholder="Giới thiệu về bản thân"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                disabled={!isEditing}
                            />
                        </label>
                    </div>
                </div>
            </div>

            <div className="text-center">
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Chỉnh sửa thông tin
                    </button>
                ) : (
                    <button
                        onClick={handleUpdateProfile}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        Lưu thay đổi
                    </button>
                )}
            </div>
        </div>
    );
};

export default CustomerProfile;

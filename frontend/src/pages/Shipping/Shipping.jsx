/* eslint-disable no-unused-vars */
/* eslint-disable no-empty-pattern */
import {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {formateCurrency} from "../../utils/formate";
import icons from "../../assets/icons";
import Footer from "../../layouts/Footer";
import Header from "../../layouts/Header";
import {place_order} from "../../store/reducers/order.reducers";
import axios from "axios";

const Shipping = () => {
    const {MdOutlineKeyboardArrowRight} = icons;
    const [res, setRes] = useState(false);
    const {
        state: {cart, price, shipping_fee, items, coupons_price},
    } = useLocation();

    const final_price = price - coupons_price;

    const {userInfo} = useSelector((state) => state.customer);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // State để lưu thông tin người dùng nhập
    const [state, setState] = useState({
        name: userInfo?.name || "",
        address: "",
        phone: "",
        post: "",
        province: "",
        district: "",
        ward: "",
    });

    // State để lưu danh sách các địa phương
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    // Thêm state lưu tên đầy đủ của địa chỉ
    const [locationNames, setLocationNames] = useState({
        provinceName: "",
        districtName: "",
        wardName: ""
    });

    // Thay đổi API endpoint để sử dụng fetch thay vì axios
    const API_BASE_URL = "https://provinces.open-api.vn/api";

    // Lấy danh sách các Tỉnh/Thành phố khi component mount
    useEffect(() => {
        fetch(`${API_BASE_URL}/?depth=1`)
            .then(response => response.json())
            .then(data => setProvinces(data))
            .catch(error => console.error("Lỗi khi lấy danh sách tỉnh/thành phố:", error));
    }, []);

    // Hàm xử lý khi thay đổi Tỉnh/Thành phố
    const handleProvinceChange = (e) => {
        const selectedProvince = e.target.value;
        // Tìm tên tỉnh/thành phố từ danh sách đã có
        const selectedProvinceName = provinces.find(p => p.code == selectedProvince)?.name || "";

        setState({...state, province: selectedProvince, district: "", ward: ""});
        setLocationNames({
            ...locationNames, 
            provinceName: selectedProvinceName,
            districtName: "",
            wardName: ""
        });

        // Lấy danh sách các Quận/Huyện theo Tỉnh/Thành phố
        fetch(`${API_BASE_URL}/p/${selectedProvince}?depth=2`)
            .then(response => response.json())
            .then(data => {
                setDistricts(data.districts);
                console.log("Đã cập nhật tên tỉnh/thành phố:", selectedProvinceName);
            })
            .catch(error => console.error("Lỗi khi lấy danh sách quận/huyện:", error));

        // Reset danh sách Xã/Phường khi Tỉnh/Thành phố thay đổi
        setWards([]);
    };

    // Hàm xử lý khi thay đổi Quận/Huyện
    const handleDistrictChange = (e) => {
        const selectedDistrict = e.target.value;
        // Tìm tên quận/huyện từ danh sách đã có
        const selectedDistrictName = districts.find(d => d.code == selectedDistrict)?.name || "";

        setState({...state, district: selectedDistrict, ward: ""});
        setLocationNames({
            ...locationNames, 
            districtName: selectedDistrictName,
            wardName: ""
        });

        // Lấy danh sách các Xã/Phường theo Quận/Huyện
        fetch(`${API_BASE_URL}/d/${selectedDistrict}?depth=2`)
            .then(response => response.json())
            .then(data => {
                setWards(data.wards);
                console.log("Đã cập nhật tên quận/huyện:", selectedDistrictName);
            })
            .catch(error => console.error("Lỗi khi lấy danh sách phường/xã:", error));
    };

    // Cập nhật tên xã/phường khi thay đổi
    const handleWardChange = (e) => {
        const selectedWard = e.target.value;
        // Tìm tên xã/phường từ danh sách đã có
        const selectedWardName = wards.find(w => w.code == selectedWard)?.name || "";

        setState({...state, ward: selectedWard});
        setLocationNames({
            ...locationNames, 
            wardName: selectedWardName
        });
        
        console.log("Đã cập nhật tên phường/xã:", selectedWardName);
    };

    // Hàm xử lý khi thay đổi giá trị trong các input khác
    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    // Hàm lưu thông tin địa chỉ
    const save = (e) => {
        e.preventDefault();
        const {name, address, phone, post, province, district, ward} = state;
        if (name && address && phone && post && province && district && ward) {
            // Kiểm tra nếu có thiếu thông tin tên các địa phương
            if (!locationNames.provinceName || !locationNames.districtName || !locationNames.wardName) {
                // Tìm lại từ danh sách đã có
                const provinceName = provinces.find(p => p.code == province)?.name || "Không xác định";
                const districtName = districts.find(d => d.code == district)?.name || "Không xác định";
                const wardName = wards.find(w => w.code == ward)?.name || "Không xác định";
                
                setLocationNames({
                    provinceName,
                    districtName,
                    wardName
                });
                
                console.log("Đã cập nhật lại thông tin địa chỉ:", {
                    provinceName,
                    districtName,
                    wardName
                });
            }
            
            setRes(true);
        }
    };

    // Hàm đặt hàng
    const placeOrder = () => {
        dispatch(
            place_order({
                customerId: userInfo.id,
                customer_name: userInfo.name,
                products: cart,
                price: final_price,
                shipping_fee,
                items,
                navigate,
                shippingInfo: state,
            })
        );
    };

    return (
        <div className="bg-white">
            <Header/>
            <section
                className='bg-[url("/src/assets/banners/7.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
                <div className="absolute left-0 top-0 w-full h-full bg-[#2422228a]">
                    <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto">
                        <div className="flex flex-col justify-center gap-1 items-center h-full w-full text-white">
                            <h2 className="text-3xl font-bold">Dotra.</h2>
                            <div className="flex justify-center items-center gap-2 text-2xl w-full">
                                <Link to="/">Trang chủ</Link>
                                <span className="pt-2">
                                    <MdOutlineKeyboardArrowRight/>
                                </span>
                                <span>Đơn hàng</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-[#eeeeee]">
                <div className="w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90] mx-auto py-16">
                    <div className="w-full flex flex-wrap">
                        <div className="w-[67%] md-lg:w-full">
                            <div className="flex flex-col gap-3">
                                <div className="bg-white p-6 shadow-sm rounded-md">
                                    {!res && (
                                        <>
                                            <h2 className="text-slate-600 font-bold pb-3">Địa chỉ giao hàng</h2>
                                            <form onSubmit={save}>
                                                <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                                                    <div className="flex flex-col gap-1 mb-2 w-full">
                                                        <label htmlFor="name">Họ và tên</label>
                                                        <input
                                                            onChange={inputHandle}
                                                            required
                                                            value={state.name}
                                                            type="text"
                                                            className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                                                            name="name"
                                                            placeholder="Nhập họ và tên..."
                                                            id="name"
                                                            readOnly
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1 mb-2 w-full">
                                                        <label htmlFor="phone">Số điện thoại</label>
                                                        <input
                                                            onChange={inputHandle}
                                                            required
                                                            value={state.phone}
                                                            type="text"
                                                            className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                                                            name="phone"
                                                            placeholder="Nhập số điện thoại..."
                                                            id="phone"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                                                    <div className="flex flex-col gap-1 mb-2 w-full">
                                                        <label htmlFor="province">Tỉnh/Thành phố</label>
                                                        <select
                                                            onChange={handleProvinceChange}
                                                            value={state.province}
                                                            className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                                                            id="province"
                                                            required
                                                        >
                                                            <option value="">Chọn Tỉnh/Thành phố</option>
                                                            {provinces.map((province) => (
                                                                <option key={province.code} value={province.code}>
                                                                    {province.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="flex flex-col gap-1 mb-2 w-full">
                                                        <label htmlFor="district">Quận/Huyện</label>
                                                        <select
                                                            onChange={handleDistrictChange}
                                                            value={state.district}
                                                            className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                                                            id="district"
                                                            required
                                                        >
                                                            <option value="">Chọn Quận/Huyện</option>
                                                            {districts.map((district) => (
                                                                <option key={district.code} value={district.code}>
                                                                    {district.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                                                    <div className="flex flex-col gap-1 mb-2 w-full">
                                                        <label htmlFor="ward">Xã/Phường</label>
                                                        <select
                                                            onChange={handleWardChange}
                                                            value={state.ward}
                                                            className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                                                            id="ward"
                                                            required
                                                        >
                                                            <option value="">Chọn Xã/Phường</option>
                                                            {wards.map((ward) => (
                                                                <option key={ward.code} value={ward.code}>
                                                                    {ward.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="flex flex-col gap-1 mb-2 w-full">
                                                        <label htmlFor="address">Địa chỉ</label>
                                                        <input
                                                            onChange={inputHandle}
                                                            required
                                                            value={state.address}
                                                            type="text"
                                                            className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                                                            name="address"
                                                            placeholder="Số nhà/Tòa nhà, tên đường..."
                                                            id="address"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                                                    <div className="flex flex-col gap-1 mb-2 w-full">
                                                        <label htmlFor="post">Mã bưu chính (ZIP code/Postal
                                                            code)</label>
                                                        <input
                                                            onChange={inputHandle}
                                                            required
                                                            value={state.post}
                                                            type="text"
                                                            className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                                                            name="post"
                                                            placeholder="Nhập Zip code/Postal code..."
                                                            id="post"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1 mt-7 w-full">
                                                        <button
                                                            className="px-3 py-[8px] rounded-md hover:shadow-red-500/20 hover:shadow-lg bg-red-500 text-white">
                                                            Lưu
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </>
                                    )}
                                    {res && (
                                        <div className="flex flex-col gap-1">
                                            <h2 className="text-slate-600 font-semibold pb-2">
                                                Giao hàng đến {state.name}
                                            </h2>
                                            <p>
                                                <span
                                                    className="bg-red-500 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Nhà riêng</span>
                                                <span className="text-slate-600 text-sm">
                                                    {state.address}, {locationNames.wardName}, {locationNames.districtName}, {locationNames.provinceName}
                                                </span>
                                                <span onClick={() => setRes(false)}
                                                      className="text-red-500 cursor-pointer"> Thay đổi</span>
                                            </p>
                                            <p className="text-slate-600 text-sm font-medium">Số điện thoại: {state.phone}</p>
                                            <p className="text-slate-600 text-sm font-medium">Email: {userInfo.email}</p>
                                        </div>
                                    )}
                                </div>
                                {cart.map((c, i) => (
                                    <div key={i} className="flex bg-white p-4 flex-col gap-2">
                                        <div className="flex justify-start items-center">
                                            <h2 className="text-md font-medium">
                                                Cửa hàng: <span
                                                className="text-red-600 font-medium">{c.shop_name}</span>
                                            </h2>
                                        </div>
                                        {c.products.map((p, j) => (
                                            <div key={i + 99} className="w-full flex flex-wrap">
                                                <div className="flex sm:w-full gap-2 w-7/12">
                                                    <div className="flex gap-2 justify-start items-center">
                                                        <img className="w-[80px] h-[80px]"
                                                             src={p.product_info.images[0]} alt="product image"/>
                                                        <div className="pr-4 text-slate-600">
                                                            <h2 className="text-sm line-clamp-2">{p.product_info.product_name}</h2>
                                                            <div className="flex flex-col gap-1">
                                                                {p?.color?.code && (
                                                                    <span className="text-sm text-gray-600">
                                                                        Màu sắc: 
                                                                        <div
                                                                            className="inline-flex items-center gap-1 ml-1">
                                                                            <span
                                                                                className="w-4 h-4 rounded-full border"
                                                                                style={{backgroundColor: p.color.code}}></span>
                                                                            <span
                                                                                className="font-medium">{p.color.name}</span>
                                                                        </div>
                                                                    </span>
                                                                )}
                                                                {p?.size && (
                                                                    <span className="text-sm text-gray-600">
                                                                        Kích thước: <span
                                                                        className="font-medium">{p.size}</span>
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-sm text-blue-600 font-medium">Thương hiệu : {p.product_info.brand_name}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end w-5/12 sm:w-full sm:mt-3">
                                                    <div className="pl-4 sm:pl-0">
                                                        <div className="flex justify-between">
                                                            <span className="text-base">
                                                                {formateCurrency(p.product_info.price - Math.floor((p.product_info.price * p.product_info.discount) / 100))}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-[33%] md-lg:w-full">
                            <div className="pl-3 md-lg:pl-0">
                                <div className="bg-white font-medium p-5 text-slate-600 flex flex-col gap-3">
                                    <h2 className="text-xl font-semibold">Tóm tắt đơn hàng</h2>
                                    <div className="flex justify-between items-center">
                                        <span>({items} sản phẩm)</span>
                                        <span className="text-lg ml-2">{formateCurrency(price)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Phí vận chuyển</span>
                                        <span className="text-lg ml-2">{formateCurrency(shipping_fee)}</span>
                                    </div>
                                    {coupons_price > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span>Giảm giá</span>
                                            <span
                                                className="text-lg ml-2 text-red-600">
                                                - {formateCurrency(coupons_price)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <span>Tổng cộng</span>
                                        <span
                                            className="text-xl font-bold ml-2 text-red-600">
                                            {formateCurrency(final_price + shipping_fee)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={placeOrder}
                                        disabled={!res}
                                        className={
                                            `px-5 py-[8px] 
                                            rounded-sm 
                                            hover:shadow-red-700/20 
                                            hover:shadow-lg ${res ? "bg-red-500" : "bg-red-700"} 
                                            text-sm text-white uppercase`
                                        }
                                    >
                                        Đặt Hàng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer/>
        </div>
    );
};


export default Shipping;

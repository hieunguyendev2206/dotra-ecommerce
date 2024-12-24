import icons from "../assets/icons";
import path from "../constants/path";
import {ImBlogger2} from "react-icons/im";
import {HiChat} from "react-icons/hi";

const {
    RxDashboard,
    AiOutlineShoppingCart,
    MdOutlineCategory,
    FaRegUser,
    MdOutlinePayment,
    BiChat,
    FaRegCalendarCheck,
    FaProductHunt,
    ImProfile,
    TbDiscount2,
    GoCodeReview,
} = icons;

const allNavbar = [{
    id: 1, title: "Dashboard", path: path.admin_dashboard, role: "admin", icon: <RxDashboard size={20}/>,
}, {
    id: 2,
    title: "Đơn hàng",
    path: path.admin_dashboard_orders,
    role: "admin",
    icon: <AiOutlineShoppingCart size={20}/>,
}, {
    id: 3,
    title: "Danh mục",
    path: path.admin_dashboard_categories,
    role: "admin",
    icon: <MdOutlineCategory size={20}/>,
}, {
    id: 4, title: "Mã giảm giá", path: path.admin_dashboard_coupons, role: "admin", icon: <TbDiscount2 size={20}/>,
}, {
    id: 5, title: "Người bán", path: path.admin_dashboard_sellers, role: "admin", icon: <FaRegUser size={20}/>,
}, {
    id: 6,
    title: "Kích Hoạt Tài khoản",
    path: path.admin_dashboard_sellers_request,
    role: "admin",
    icon: <FaRegCalendarCheck size={20}/>,
}, {
    id: 7, title: "Thanh toán", path: path.admin_dashboard_payments, role: "admin", icon: <MdOutlinePayment size={20}/>,
}, {
    id: 8, title: "Trò chuyện", path: path.admin_dashboard_chat, role: "admin", icon: <BiChat size={20}/>,
}, {
    id: 9, title: "Dashboard", path: path.seller_dashboard, role: "seller", icon: <RxDashboard size={20}/>,
}, {
    id: 10,
    title: "Đơn hàng",
    path: path.seller_dashboard_orders,
    role: "seller",
    icon: <AiOutlineShoppingCart size={20}/>,
}, {
    id: 11, title: "Sản phẩm", path: path.seller_dashboard_products, role: "seller", icon: <FaProductHunt size={20}/>,
}, {
    id: 12,
    title: "Đánh giá sản phẩm",
    path: path.seller_dashboard_reply_review,
    role: "seller",
    icon: <GoCodeReview size={20}/>,
}, {
    id: 13, title: "Quản lý bài viết", path: path.seller_dashboard_blog, role: "seller", icon: <ImBlogger2 size={20}/>
}, {
    id: 14,
    title: "Thanh toán",
    path: path.seller_dashboard_payment,
    role: "seller",
    icon: <MdOutlinePayment size={20}/>,
}, {
    id: 15,
    title: "Liên hệ khách hàng",
    path: path.seller_dashboard_chat_customers,
    role: "seller",
    icon: <BiChat size={20}/>,
}, {
    id: 16, title: "Liên hệ admin", path: path.seller_dashboard_chat_admin, role: "seller", icon: <HiChat size={20}/>,
}, {
    id: 17, title: "Hồ sơ", path: path.seller_dashboard_profile, role: "seller", icon: <ImProfile size={20}/>,
},
];

export default allNavbar;

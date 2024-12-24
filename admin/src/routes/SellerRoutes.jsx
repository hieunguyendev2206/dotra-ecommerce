import {lazy, Suspense} from "react";
import path from "../constants/path";
import Blog from "../pages/Seller/Blog/Blog.jsx";

const SellerDashboard = lazy(() => import("../pages/Seller/SellerDashboard"));
const SellerOrder = lazy(() => import("../pages/Seller/SellerOrder"));
const OrderDetails = lazy(() => import("../pages/Seller/OrderDetails"));
const Product = lazy(() => import("../pages/Seller/Product"));
const ReplyReview = lazy(() => import("../pages/Seller/ReplyReview"));
const EditProduct = lazy(() => import("../pages/Seller/EditProduct"));
const RequestPayment = lazy(() => import("../pages/Seller/RequestPayment"));
const AdminChat = lazy(() => import("../pages/Seller/Chat/AdminChat"));
const CustomerChat = lazy(() => import("../pages/Seller/Chat/CustomerChat"));
const Profile = lazy(() => import("../pages/Seller/Profile"));
const Pending = lazy(() => import("../components/Pending"));
const Deactive = lazy(() => import("../components/Deactive"));

const SellerRoutes = [
    {
        path: path.seller_account_pending,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <Pending/>
            </Suspense>
        ),
        ability: "seller",
    },
    {
        path: path.seller_account_deactive,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <Deactive/>
            </Suspense>
        ),
        ability: "seller",
    },
    {
        path: path.seller_dashboard,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <SellerDashboard/>
            </Suspense>
        ),
        role: "seller",
        status: "active",
    },
    {
        path: path.seller_dashboard_orders,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <SellerOrder/>
            </Suspense>
        ),
        role: "seller",
        visibility: ["active", "deactive"],
    },
    {
        path: path.seller_dashboard_orders_details,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <OrderDetails/>
            </Suspense>
        ),
        role: "seller",
        visibility: ["active", "deactive"],
    },
    {
        path: path.seller_dashboard_products,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <Product/>
            </Suspense>
        ),
        role: "seller",
        status: "active",
    },
    {
        path: path.seller_dashboard_reply_review,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <ReplyReview/>
            </Suspense>
        ),
        role: "seller",
        status: "active",
    },
    {
        path: path.seller_dashboard_blog,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <Blog/>
            </Suspense>
        ),
        role: "seller",
        status: "active",
    },
    {
        path: path.seller_dashboard_edit_product,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <EditProduct/>
            </Suspense>
        ),
        role: "seller",
        status: "active",
    },
    {
        path: path.seller_dashboard_chat_customers,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <CustomerChat/>
            </Suspense>
        ),
        role: "seller",
        status: "active",
    },
    {
        path: path.seller_dashboard_chat_customer_id,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <CustomerChat/>
            </Suspense>
        ),
        role: "seller",
        status: "active",
    },
    {
        path: path.seller_dashboard_payment,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <RequestPayment/>
            </Suspense>
        ),
        role: "seller",
        status: "active",
    },
    {
        path: path.seller_dashboard_chat_admin,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <AdminChat/>
            </Suspense>
        ),
        role: "seller",
        visibility: ["active", "deactive", "pending"],
    },
    {
        path: path.seller_dashboard_profile,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <Profile/>
            </Suspense>
        ),
        role: "seller",
        visibility: ["active", "deactive", "pending"],
    },
];

export default SellerRoutes;

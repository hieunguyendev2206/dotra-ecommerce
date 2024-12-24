import {lazy, Suspense} from "react";
import path from "../constants/path";

const AdminDashboard = lazy(() => import("../pages/Admin/AdminDashboard"));
const AdminOrders = lazy(() => import("../pages/Admin/AdminOrder"));
const Categories = lazy(() => import("../pages/Admin/Categories"));
const Coupons = lazy(() => import("../pages/Admin/Coupons"));
const Seller = lazy(() => import("../pages/Admin/Seller"));
const SellerRequest = lazy(() => import("../pages/Admin/SellerRequest"));
const RequestPayment = lazy(() => import("../pages/Admin/RequestPayment"));
const DeactiveSeller = lazy(() => import("../pages/Admin/DeactiveSeller"));
const SellerDetails = lazy(() => import("../pages/Admin/SellerDetails"));
const OrderDetails = lazy(() => import("../pages/Admin/OrderDetails"));
const Chat = lazy(() => import("../pages/Admin/Chat"));

const AdminRoutes = [
    {
        path: path.admin_dashboard,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <AdminDashboard/>
            </Suspense>
        ),
        role: "admin",
    },
    {
        path: path.admin_dashboard_orders,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <AdminOrders/>
            </Suspense>
        ),
        role: "admin",
    },
    {
        path: path.admin_dashboard_categories,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <Categories/>
            </Suspense>
        ),
        role: "admin",
    },
    {
        path: path.admin_dashboard_coupons,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <Coupons/>
            </Suspense>
        ),
        role: "admin",
    },
    {
        path: path.admin_dashboard_sellers,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <Seller/>
            </Suspense>
        ),
        role: "admin",
    },
    {
        path: path.admin_dashboard_sellers_request,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <SellerRequest/>
            </Suspense>
        ),
        role: "admin",
    },
    {
        path: path.admin_dashboard_payments,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <RequestPayment/>
            </Suspense>
        ),
        role: "admin",
    },
    {
        path: path.admin_dashboard_deactive,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <DeactiveSeller/>
            </Suspense>
        ),
        role: "admin",
    },
    {
        path: path.admin_dashboard_sellers_details,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <SellerDetails/>
            </Suspense>
        ),
        role: "admin",
    },
    {
        path: path.admin_dashboard_orders_details,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <OrderDetails/>
            </Suspense>
        ),
        role: "admin",
    },
    {
        path: path.admin_dashboard_chat,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <Chat/>
            </Suspense>
        ),
        role: "admin",
    },
    {
        path: path.admin_dashboard_chat_seller,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <Chat/>
            </Suspense>
        ),
        role: "admin",
    },
];

export default AdminRoutes;

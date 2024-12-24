/* eslint-disable no-unused-vars */
import {lazy, Suspense} from "react";
import path from "../constants/path";

const Login = lazy(() => import("../pages/Seller/Login"));
const Register = lazy(() => import("../pages/Seller/Register"));
const AdminLogin = lazy(() => import("../pages/Admin/AdminLogin"));
const Home = lazy(() => import("../pages/Home"));
const Unauthorized = lazy(() => import("../components/Unauthorized"));
const PaymentSuccess = lazy(() =>
    import("../pages/PaymentSuccess/PaymentSuccess")
);

const PublicRoutes = [
    {
        path: path.home,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <Home/>
            </Suspense>
        ),
    },
    {
        path: path.seller_login,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <Login/>
            </Suspense>
        ),
    },
    {
        path: path.seller_register,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <Register/>
            </Suspense>
        ),
    },
    {
        path: path.admin_login,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <AdminLogin/>
            </Suspense>
        ),
    },
    {
        path: path.unauthorized,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <Unauthorized/>
            </Suspense>
        ),
    },
    {
        path: path.payment_success,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <PaymentSuccess/>
            </Suspense>
        ),
    },
];

export default PublicRoutes;

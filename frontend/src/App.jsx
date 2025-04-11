import {BrowserRouter, Route, Routes} from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Shipping from "./pages/Shipping/Shipping";
import CategoryShop from "./pages/CategoryShop";
import SearchProducts from "./pages/SearchProducts";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import OauthGoogle from "./pages/OauthGoogle";
import Payment from "./pages/Payment/Payment";
import ProtectUser from "./routes/ProtectUser";
import Dashboard from "./pages/Dashboard/Dashboard";
import CustomerDashboard from "./components/CustomerDashboard";
import MyOrders from "./components/CustomerDashboard/MyOrders";
import MyWishList from "./components/CustomerDashboard/MyWishList";
import Chat from "./components/CustomerDashboard/Chat";
import OrderDetails from "./components/CustomerDashboard/OrderDetails/OrderDetails";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentError from "./pages/PaymentError";
import CustomerProfile from "./components/CustomerProfile/CustomerProfile.jsx";
import ShopProfile from "./pages/SellerStore/ShopProfile.jsx";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop.jsx";

function App() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                {/* Nút cuộn lên đầu trang */}
                <ScrollToTop/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/shop" element={<Shop/>}/>
                    <Route path="/cart" element={<Cart/>}/>
                    <Route path="/home/product-details/:slug" element={<ProductDetails/>}/>
                    <Route path="/seller-store/:sellerId" element={<ShopProfile/>}/>
                    <Route path="/shipping" element={<Shipping/>}/>
                    <Route path="/products?" element={<CategoryShop/>}/>
                    <Route path="/products/search?" element={<SearchProducts/>}/>
                    <Route
                        path="/verify-email-customer/:email_token"
                        element={<VerifyEmail/>}
                    />
                    <Route path="/oauth/google-login" element={<OauthGoogle/>}/>
                    <Route path="/payment" element={<Payment/>}/>
                    <Route path="/payment/payment-success" element={<PaymentSuccess/>}/>
                    <Route path="/payment/payment-error" element={<PaymentError/>}/>
                    <Route path="/dashboard" element={<ProtectUser/>}>
                        <Route path="" element={<Dashboard/>}>
                            <Route path="" element={<CustomerDashboard/>}/>
                            <Route path="my-orders" element={<MyOrders/>}/>
                            <Route path="my-wishlist" element={<MyWishList/>}/>
                            <Route path="chat" element={<Chat/>}/>
                            <Route path="chat/:sellerId" element={<Chat/>}/>
                            <Route
                                path="my-orders/get-order-details/:orderId"
                                element={<OrderDetails/>}
                            />
                            <Route path="/dashboard/profile" element={<CustomerProfile/>}/>
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </HelmetProvider>
    );
}

export default App;

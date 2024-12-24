/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import Router from "./router/Router";
import GetRoutes from "./routes/GetRoutes";
import EmailVerify from "./pages/Seller/EmailVerify/EmailVerify";
import ResetPassword from "./pages/Seller/ResetPassword";
import { useDispatch, useSelector } from "react-redux";
import { get_user_info } from "./store/reducers/auth.reducers";

function App() {
    const dispatch = useDispatch();
    const { access_token } = useSelector((state) => state.auth);
    const [allRoutes, setAllRoutes] = useState([...PublicRoutes]);

    useEffect(() => {
        const routes = GetRoutes();
        setAllRoutes([...allRoutes, routes]);
    }, []);

    useEffect(() => {
        if (access_token) {
            dispatch(get_user_info());
        }
    }, [access_token, dispatch]);

    return (
        <>
            <Router allRoutes={allRoutes} />
            <Routes>
                <Route path="/verify-email/:emailToken" element={<EmailVerify />} />
                <Route path="/reset-password/:emailToken" element={<ResetPassword />} />
            </Routes>
        </>
    );
}

export default App;

/* eslint-disable no-unused-vars */
import {Outlet} from "react-router-dom";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {socket} from "../../utils/socket.io";
import HeaderLayout from "../HeaderLayout";
import SidebarLayout from "../SidebarLayout";
import {update_active_customer, update_active_seller,} from "../../store/reducers/chat.reducers";

const MainLayout = () => {
    const [showSidebar, setShowSidebar] = useState(false);

    const dispatch = useDispatch();
    const {user_info} = useSelector((state) => state.auth);

    useEffect(() => {
        if (user_info && user_info.role === "seller") {
            socket.emit("add_seller", user_info._id, user_info);
        } else {
            socket.emit("add_admin", user_info);
        }
    }, [user_info]);

    useEffect(() => {
        socket.on("active_customer", (customers) => {
            dispatch(update_active_customer(customers));
        });
        socket.on("active_seller", (sellers) => {
            dispatch(update_active_seller(sellers));
        });
    }, [dispatch]);

    return (
        <div className="w-full min-h-screen bg-white">
            <HeaderLayout showSidebar={showSidebar} setShowSidebar={setShowSidebar}/>
            <SidebarLayout
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
            />
            <div className="ml-0 lg:ml-[260px] pt-[65px] transition-all">
                <Outlet/>
            </div>
        </div>
    );
};

export default MainLayout;

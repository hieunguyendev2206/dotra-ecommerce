import {useSelector} from "react-redux";
import {Navigate, Outlet} from "react-router-dom";

const ProtectUser = () => {
    const {userInfo} = useSelector((state) => state.customer);
    if (userInfo) {
        return <Outlet/>;
    } else {
        return <Navigate to="/" replace={true}/>;
    }
};

export default ProtectUser;

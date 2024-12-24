import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import path from "../../constants/path";

const Home = () => {
    const {role} = useSelector((state) => state.auth);
    if (role === "admin") return <Navigate to={path.admin_dashboard}/>;
    else if (role === "seller") return <Navigate to={path.seller_dashboard}/>;
    else return <Navigate to={path.seller_login}/>;
};

export default Home;

import path from "../constants/path";
import MainLayout from "../layouts/MainLayout";
import PrivateRoutes from "./PrivateRoutes";
import ProtectedRoutes from "./ProtectedRoutes";

const GetRoutes = () => {
    PrivateRoutes.map((r) => {
        r.element = <ProtectedRoutes route={r}>{r.element}</ProtectedRoutes>;
    });
    return {
        path: path.home,
        element: <MainLayout/>,
        children: PrivateRoutes,
    };
};

export default GetRoutes;

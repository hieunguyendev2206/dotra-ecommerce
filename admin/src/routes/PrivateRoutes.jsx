import AdminRoutes from "./AdminRoutes";
import SellerRoutes from "./SellerRoutes";

const PrivateRoutes = [...AdminRoutes, ...SellerRoutes];

export default PrivateRoutes;

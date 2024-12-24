import authReducer from "./auth.reducers";
import categoryReducer from "./category.reducers";
import chatReducer from "./chat.reducers";
import couponsReducer from "./coupons.reducers";
import dashboardReducer from "./dashboard.reducers";
import orderReducer from "./order.reducers";
import paymentReducer from "./payment.reducers";
import productReducer from "./product.reducers";
import reviewReducer from "./review.reducers";
import sellerReducer from "./seller.reducer";

const rootReducer = {
    auth: authReducer,
    category: categoryReducer,
    product: productReducer,
    seller: sellerReducer,
    coupons: couponsReducer,
    chat: chatReducer,
    order: orderReducer,
    payment: paymentReducer,
    dashboard: dashboardReducer,
    review: reviewReducer,
};

export default rootReducer;

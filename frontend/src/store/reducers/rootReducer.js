import cartReducer from "./cart.reducers";
import chatReducer from "./chat.reducers";
import customerReducer from "./customer.reducers";
import dashboardReducer from "./dashboard.reducers";
import homeReducer from "./home.reducers";
import orderReducer from "./order.reducers";
import reviewReducer from "./rewiew.reducers";
import wishlistReducer from "./wishlist.reducers";
import shopReducers from "./shop.reducers.js";
import blogReducers from "./blog.reducers.js";

const rootReducer = {
    home: homeReducer,
    customer: customerReducer,
    cart: cartReducer,
    dashboard: dashboardReducer,
    order: orderReducer,
    wishlist: wishlistReducer,
    review: reviewReducer,
    chat: chatReducer,
    shop: shopReducers,
    blog: blogReducers
};

export default rootReducer;

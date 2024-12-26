import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {Provider} from "react-redux";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "./store/store.js";

ReactDOM.createRoot(document.getElementById("root")).render(<Provider store={store}>
    <App/>
    <ToastContainer className="z-[9999]" position="top-center" autoClose={2000}/>
</Provider>);

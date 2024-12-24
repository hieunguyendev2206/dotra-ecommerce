/* eslint-disable no-unused-vars */
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {
    apply_coupons,
    decrease_quantity,
    delete_product_cart,
    get_cart,
    increase_quantity,
    message_clear,
} from "../../store/reducers/cart.reducers";
import {formateCurrency} from "../../utils/formate";
import Footer from "../../layouts/Footer";
import path from "../../constants/path";
import Header from "../../layouts/Header";
import icons from "../../assets/icons";
import {Button, Modal} from "flowbite-react";
import {toast} from "react-toastify";
import CartNone from "../../assets/img/cart-none.png"

const Cart = () => {
    const {MdOutlineKeyboardArrowRight, HiOutlineExclamationCircle, BsTrash} =
        icons;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const [couponsCode, setCouponsCode] = useState({
        coupons_code: "",
    });
    const [cartId, setCartId] = useState("");
    const {userInfo} = useSelector((state) => state.customer);
    const {
        cart,
        cart_product_count,
        buy_product_item,
        shipping_fee,
        total_price,
        coupons_price,
        out_of_stock,
        success_message,
        error_message,
    } = useSelector((state) => state.cart);

    const final_price = total_price - coupons_price;

    const redirect = () => {
        navigate("/shipping", {
            state: {
                cart: cart,
                price: total_price,
                shipping_fee: shipping_fee,
                items: buy_product_item,
                coupons_price: coupons_price,
            },
        });
    };

    const deleteProductInCart = (cartId) => {
        dispatch(delete_product_cart(cartId));
    };

    useEffect(() => {
        dispatch(get_cart(userInfo.id));
    }, [dispatch, userInfo.id]);

    useEffect(() => {
        if (success_message) {
            toast.success(success_message);
            dispatch(message_clear());
            dispatch(get_cart(userInfo.id));
            setCartId("");
            setCouponsCode({coupons_code: ""});
        }
        if (error_message) {
            if (error_message === "Mã giảm giá đã hết hạn") {
                toast.error("Mã giảm giá đã hết hạn");
            } else if (error_message === "Mã giảm giá không tồn tại") {
                toast.error("Mã giảm giá không tồn tại");
            } else {
                toast.error(error_message);
            }
            dispatch(message_clear());
        }
    }, [success_message, error_message, dispatch, userInfo.id]);

    const inc_quantity = (currentQuantity, quantity, cartId) => {
        const temp = currentQuantity + 1;
        if (temp <= quantity) {
            dispatch(increase_quantity(cartId));
        }
    };

    const dec_quantity = (currentQuantity, cartId) => {
        const temp = currentQuantity - 1;
        if (temp > 0) {
            dispatch(decrease_quantity(cartId));
        }
    };

    const handleInputCouponsCode = (event) => {
        event.preventDefault();
        setCouponsCode({coupons_code: event.target.value});
    };

    const handleSubmitCouponsCode = (event) => {
        event.preventDefault();
        if (!couponsCode.coupons_code) {
            toast.error("Bạn phải nhập mã giảm giá");
            return;
        }
        dispatch(apply_coupons(couponsCode));
    };

    return (
        <div className="bg-white">
            <Header />
            <section className='bg-[url("/src/assets/banners/1.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
                <div className="absolute left-0 top-0 w-full h-full bg-[#2422228a]">
                    <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto">
                        <div className="flex flex-col justify-center gap-1 items-center h-full w-full text-white">
                            <h2 className="text-3xl font-bold">Dotra.</h2>
                            <div className="flex justify-center items-center gap-2 text-2xl w-full">
                                <Link to={path.home}>Trang chủ</Link>
                                <span className="pt-2">
                                  <MdOutlineKeyboardArrowRight />
                                </span>
                                <span>Giỏ Hàng</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-[#eeeeee]">
                <div className="w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90] mx-auto py-16">
                    {cart.length > 0 || out_of_stock.length > 0 ? (
                        <div className="flex flex-wrap">
                            <div className="w-[67%] md-lg:w-full">
                                <div className="pr-3 md-lg:pr-0">
                                    <div className="flex flex-col gap-3">
                                        <div className="bg-white p-4 rounded-t-md">
                                            <h2 className="text-md text-green-500 font-semibold">
                                                Số lượng sản phẩm: {""}
                                                {cart_product_count}
                                            </h2>
                                        </div>
                                        {cart.map((c, index) => (
                                            <div
                                                key={index}
                                                className="flex bg-white p-4 flex-col gap-2 rounded-b-md"
                                            >
                                                <div className="flex justify-start items-center">
                                                    <h2 className="font-medium">
                                                        Cửa hàng:{" "}
                                                        <span className="text-red-600 font-medium">
                                                          {c.shop_name}
                                                        </span>
                                                    </h2>
                                                </div>
                                                {c.products.map((p) => {
                                                    return (
                                                        <div key={p._id} className="w-full flex flex-wrap">
                                                            <div className="flex sm:w-full gap-2 w-7/12 mb-3">
                                                                <div className="flex gap-2 justify-start items-center">
                                                                    <img
                                                                        className="w-[80px] h-[80px]"
                                                                        src={p.product_info.images[0]}
                                                                        alt="product image"
                                                                    />
                                                                    <div className="pr-4 text-slate-600">
                                                                        <h2 className="text-sm line-clamp-2">
                                                                            {p.product_info.product_name}
                                                                        </h2>
                                                                        <span
                                                                            className="text-sm font-semibold text-blue-500">
                                                                          {p.product_info.brand_name}.
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="flex justify-between w-5/12 sm:w-full sm:mt-3">
                                                                <div className="pl-4 sm:pl-0">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="mt-2">
                                                                          {formateCurrency(
                                                                              p.product_info.price - Math.floor(
                                                                                  (p.product_info.price * p.product_info.discount) / 100
                                                                              )
                                                                          )}
                                                                        </span>
                                                                        <span className="ml-5 mt-2 text-red-500">x{p.quantity}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <div
                                                                        className="flex bg-slate-200 h-[40px] justify-center items-center text-xl rounded-md">
                                                                        <div
                                                                            onClick={() =>
                                                                                dec_quantity(p.quantity, p._id)
                                                                            }
                                                                            className="px-3 cursor-pointer m-2"
                                                                        >
                                                                            -
                                                                        </div>
                                                                        <div className="text-base">
                                                                            {p.quantity}
                                                                        </div>
                                                                        <div
                                                                            onClick={() =>
                                                                                inc_quantity(
                                                                                    p.quantity,
                                                                                    p.product_info.quantity,
                                                                                    p._id
                                                                                )
                                                                            }
                                                                            className="px-3 cursor-pointer m-2"
                                                                        >
                                                                            +
                                                                        </div>
                                                                    </div>
                                                                    <BsTrash
                                                                        size={28}
                                                                        color="red"
                                                                        onClick={() => {
                                                                            setOpenModal(true);
                                                                            setCartId(p._id);
                                                                        }}
                                                                        className="cursor-pointer ml-2 mt-2"
                                                                    />
                                                                    <Modal
                                                                        show={openModal}
                                                                        size="md"
                                                                        onClose={() => setOpenModal(false)}
                                                                        popup
                                                                        style={{
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            justifyContent: "center",
                                                                        }}
                                                                    >
                                                                        <Modal.Header />
                                                                        <Modal.Body>
                                                                            <div className="text-center">
                                                                                <HiOutlineExclamationCircle
                                                                                    className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"
                                                                                />
                                                                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                                                                    Bạn muốn xóa sản phẩm này ra khỏi giỏ hàng?
                                                                                </h3>
                                                                                <div className="flex justify-center gap-4">
                                                                                    <Button
                                                                                        color="failure"
                                                                                        onClick={() => {
                                                                                            deleteProductInCart(cartId);
                                                                                            setOpenModal(false);
                                                                                        }}
                                                                                    >
                                                                                        Xác nhận
                                                                                    </Button>
                                                                                    <Button
                                                                                        color="gray"
                                                                                        onClick={() => setOpenModal(false)}
                                                                                    >
                                                                                        Hủy bỏ
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        </Modal.Body>
                                                                    </Modal>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ))}
                                        {out_of_stock.length > 0 && (
                                            <div className="flex flex-col gap-3">
                                                <div className="bg-white p-4">
                                                    <h2 className="text-md text-red-500 font-semibold">
                                                        Hết hàng: {out_of_stock.length}
                                                    </h2>
                                                </div>
                                                <div className="bg-white p-4">
                                                    {out_of_stock.map((p, index) => (
                                                        <div key={index} className="w-full flex flex-wrap">
                                                            <div className="flex sm:w-full gap-2 w-7/12 mb-3">
                                                                <div className="flex gap-2 justify-start items-center">
                                                                    <img
                                                                        className="w-[80px] h-[80px]"
                                                                        src={p.products[0].images[0]}
                                                                        alt="product image"
                                                                    />
                                                                    <div className="pr-4 text-slate-600">
                                                                        <h2 className="text-sm line-clamp-2">
                                                                            {p.products[0].product_name}
                                                                        </h2>
                                                                        <span
                                                                            className="text-sm font-semibold text-blue-500">
                                                                          {p.products[0].brand_name}.
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="flex justify-between w-5/12 sm:w-full sm:mt-3">
                                                                <div className="pl-4 sm:pl-0">
                                                                    <div className="flex justify-between">
                                                                        <span className="mt-2">
                                                                          {formateCurrency(
                                                                              p.products[0].price - Math.floor(
                                                                                  (p.products[0].price * p.products[0].discount) / 100
                                                                              )
                                                                          )}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <div
                                                                        className="flex bg-slate-200 h-[40px] justify-center items-center text-xl">
                                                                        <div className="px-3 cursor-pointer m-2">
                                                                            -
                                                                        </div>
                                                                        <div className="text-base">1</div>
                                                                        <div className="px-3 cursor-pointer m-2">
                                                                            +
                                                                        </div>
                                                                    </div>
                                                                    <BsTrash
                                                                        size={28}
                                                                        color="red"
                                                                        onClick={() => {
                                                                            setOpenModal(true);
                                                                            setCartId(p._id);
                                                                        }}
                                                                        className="cursor-pointer ml-2 mt-2"
                                                                    />
                                                                    <Modal
                                                                        show={openModal}
                                                                        size="md"
                                                                        onClose={() => setOpenModal(false)}
                                                                        popup
                                                                        style={{
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            justifyContent: "center",
                                                                        }}
                                                                    >
                                                                        <Modal.Header />
                                                                        <Modal.Body>
                                                                            <div className="text-center">
                                                                                <HiOutlineExclamationCircle
                                                                                    className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"
                                                                                />
                                                                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                                                                    Bạn muốn xóa sản phẩm này ra khỏi giỏ hàng?
                                                                                </h3>
                                                                                <div className="flex justify-center gap-4">
                                                                                    <Button
                                                                                        color="failure"
                                                                                        onClick={() => {
                                                                                            deleteProductInCart(cartId);
                                                                                            setOpenModal(false);
                                                                                        }}
                                                                                    >
                                                                                        Xác nhận
                                                                                    </Button>
                                                                                    <Button
                                                                                        color="gray"
                                                                                        onClick={() => setOpenModal(false)}
                                                                                    >
                                                                                        Hủy bỏ
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        </Modal.Body>
                                                                    </Modal>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="w-[33%] md-lg:w-full">
                                <div className="pl-3 md-lg:pl-0 md-lg:mt-5">
                                    {cart.length > 0 && (
                                        <div className="bg-white p-3 text-slate-600 flex flex-col gap-3 rounded-md">
                                            <h2 className="text-xl font-bold">Đơn hàng</h2>
                                            <div className="flex justify-between items-center">
                                                <span>Tạm tính {buy_product_item} sản phẩm</span>
                                                <span>{formateCurrency(total_price)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Phí vận chuyển</span>
                                                <span>{formateCurrency(shipping_fee)}</span>
                                            </div>
                                            <div>
                                                <form
                                                    onSubmit={handleSubmitCouponsCode}
                                                    className="flex gap-2"
                                                >
                                                    <input
                                                        className="w-full px-3 py-2 border border-slate-200 outline-0 focus:border-green-500 rounded-md"
                                                        type="text"
                                                        onChange={handleInputCouponsCode}
                                                        value={couponsCode.coupons_code}
                                                        placeholder="Nhập mã giảm giá"
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="px-8 py-[1px] bg-red-500 text-white rounded-md uppercase text-sm"
                                                    >
                                                        Apply
                                                    </button>
                                                </form>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Tổng tiền</span>
                                                <span className="text-lg text-orange-500">
                                                  {formateCurrency(final_price + shipping_fee)}
                                                </span>
                                            </div>
                                            <button
                                                onClick={redirect}
                                                className="px-5 py-[8px] rounded-md hover:shadow-orange-500/20 hover:shadow-lg bg-red-500 text-sm text-white uppercase"
                                            >
                                                Thanh toán {buy_product_item} sản phẩm
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center h-[400px]">
                            <img width="500px" height="500px" src={CartNone} alt="No-Item" className="mb-4"/>
                            <h2 className="text-xl font-medium mb-4 font-mono">
                                Chưa có sản phẩm nào trong giỏ hàng!
                            </h2>
                            <Link to={path.shop} className="px-4 py-2 bg-red-500 text-white rounded-md ">
                                Mua Ngay
                            </Link>
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Cart;

import {Link} from "react-router-dom";
import icons from "../../assets/icons";

const Footer = () => {
    const {FaFacebook, GrInstagram, BsTwitter, BsGithub} = icons;
    return (
        <footer className="bg-[#F3F6Fa]">
            <div className="w-[85%] flex flex-wrap mx-auto border-b py-16 md-lg:pb-10 sm:pb-6">
                <div className="w-3/12 lg:w-4/12 sm:w-full">
                    <div className="flex flex-col gap-3">
                        <Link to="/" className="w-[180px] h-[50px]">
                            <img
                                src="/src/assets/logo/logo.png"
                                alt="logo"
                                className="w-full h-full"
                            />
                        </Link>
                        <ul className="flex flex-col gap-2 text-slate-600">
                            <li>Địa chỉ: TP. Hồ Chí Minh</li>
                            <li>Điện thoại : 0939061835</li>
                            <li>Email : hieunguyendev2206@gmail.com</li>
                        </ul>
                    </div>
                </div>
                <div className="w-5/12 lg:w-8/12 sm:w-full">
                    <div className="flex justify-center sm:justify-start sm:mt-6 w-full">
                        <div>
                            <h2 className="font-bold text-lg mb-2">Thông Tin</h2>
                            <div className="flex justify-between gap-[80px] lg:gap-[40px]">
                                <ul className="flex flex-col gap-2 text-slate-600 text-sm">
                                    <li>
                                        <Link>Nền tảng mua sắm trực tuyến</Link>
                                    </li>
                                    <li>
                                        <Link>Sản phẩm chính hãng</Link>
                                    </li>
                                    <li>
                                        <Link>Vận chuyển</Link>
                                    </li>
                                    <li>
                                        <Link>Chính sách bảo mật</Link>
                                    </li>
                                    <li>
                                        <Link>Hoạt động gây quỹ</Link>
                                    </li>
                                </ul>
                                <ul className="flex flex-col gap-2 text-slate-600 text-sm">
                                    <li>
                                        <Link>Trang chủ</Link>
                                    </li>
                                    <li>
                                        <Link>Sản phẩm</Link>
                                    </li>
                                    <li>
                                        <Link>Cửa hàng</Link>
                                    </li>
                                    <li>
                                        <Link>Blogs</Link>
                                    </li>
                                    <li>
                                        <Link>Liên hệ</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-4/12 lg:w-full lg:mt-6">
                    <div className="w-full flex flex-col justify-start gap-5">
                        <h2 className="font-bold text-lg mb-2">Liên Hệ</h2>
                        <span>
                          Nhận thông tin qua Email về các ưu đãi đặc biệt và mới nhất của
                          chúng tôi
                        </span>
                        <div className="h-[50px] w-full relative">
                            <input
                                placeholder="Nhập email"
                                className="h-full bg-transparent w-full px-3 outline-0 rounded-md bg-white text-black"
                                type="text"
                            />
                            <button
                                className="h-full absolute right-0 bg-red-500 text-white uppercase px-4 font-bold text-sm rounded-md">
                                Subscribe
                            </button>
                        </div>
                        <ul className="flex justify-start items-center gap-3">
                            <li>
                                <a
                                    className="w-[38px] h-[38px] hover:bg-[#7fad39] hover:text-white flex justify-center items-center bg-white rounded-full"
                                    href="#"
                                >
                                    <FaFacebook/>
                                </a>
                            </li>
                            <li>
                                <a
                                    className="w-[38px] h-[38px] hover:bg-[#7fad39] hover:text-white flex justify-center items-center bg-white rounded-full"
                                    href="#"
                                >
                                    <GrInstagram/>
                                </a>
                            </li>
                            <li>
                                <a
                                    className="w-[38px] h-[38px] hover:bg-[#7fad39] hover:text-white flex justify-center items-center bg-white rounded-full"
                                    href="#"
                                >
                                    <BsTwitter/>
                                </a>
                            </li>
                            <li>
                                <a
                                    className="w-[38px] h-[38px] hover:bg-[#7fad39] hover:text-white flex justify-center items-center bg-white rounded-full"
                                    href="#"
                                >
                                    <BsGithub/>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

import AccountPeding from "../../assets/img/account_pending.jpg"

const Pending = () => {
    return (<div className="w-full flex justify-center items-center font-medium mt-10">
        <div className="bg-white p-10 md:mx-auto">
            <div className="flex justify-center items-center">
                <img
                    src={AccountPeding}
                    alt=""
                    className="w-[340px] h-[280px]"
                />
            </div>
            <svg
                fill="#ff0000"
                viewBox="-1.7 0 20.4 20.4"
                xmlns="http://www.w3.org/2000/svg"
                className="cf-icon-svg w-20 h-20 mx-auto my-6"
            >
                <g id="SVGRepo_bgCarrier" strokeWidth={0}/>
                <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier">
                    <path
                        d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z"/>
                </g>
            </svg>
            <div className="text-center">
                <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                    Tài khoản của bạn chưa được kích hoạt
                </h3>
                <p className="text-gray-600 my-2">
                    Vui lòng liên hệ với admin để giải quyết
                </p>
            </div>
        </div>
    </div>);
};

export default Pending;

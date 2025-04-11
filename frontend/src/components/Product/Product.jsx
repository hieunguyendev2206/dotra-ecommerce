/* eslint-disable react/prop-types */
import Carousel from "react-multi-carousel";
import {Link} from "react-router-dom";
import "react-multi-carousel/lib/styles.css";
import icons from "../../assets/icons";
import {formateCurrency} from "../../utils/formate";
import {useEffect, useState} from "react";

const Product = ({products, title}) => {
    const {FiChevronLeft, FiChevronRight} = icons;
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const responsive = {
        superLargeDesktop: {
            breakpoint: {max: 4000, min: 3000}, items: 1,
        }, desktop: {
            breakpoint: {max: 3000, min: 1024}, items: 1,
        }, tablet: {
            breakpoint: {max: 1024, min: 464}, items: 1,
        }, mobile: {
            breakpoint: {max: 464, min: 0}, items: 1,
        },
    };

    const ButtonGroup = ({next, previous}) => {
        return (<div className="flex justify-between items-center bg-white w-full py-2">
            <div className="text-xl md:text-lg sm:text-base font-mono font-semibold text-red-600 truncate pr-2">
                {title}
            </div>
            <div className="flex justify-center items-center gap-2 text-slate-600">
                <button
                    onClick={() => previous()}
                    className="w-[30px] h-[30px] sm:w-[25px] sm:h-[25px] flex justify-center rounded-md items-center bg-slate-300 border border-slate-200 hover:bg-slate-400 transition-colors"
                >
                    <span>
                        <FiChevronLeft/>
                    </span>
                </button>
                <button
                    onClick={() => next()}
                    className="w-[30px] h-[30px] sm:w-[25px] sm:h-[25px] flex justify-center rounded-md items-center bg-slate-300 border border-slate-200 hover:bg-slate-400 transition-colors"
                >
                    <span>
                        <FiChevronRight/>
                    </span>
                </button>
            </div>
        </div>);
    };

    return (
        <div className="flex gap-4 flex-col-reverse bg-white rounded-md shadow-sm p-2 w-full">
            <Carousel
                autoPlay={false}
                infinite={false}
                arrows={false}
                responsive={responsive}
                transitionDuration={500}
                renderButtonGroupOutside={true}
                customButtonGroup={<ButtonGroup/>}
                className="w-full"
            >
                {products.map((p, index) => {
                    return (
                        <div key={index} className="flex flex-col justify-start gap-3 w-full py-2">
                            {p.map((pl, j) => (
                                <Link
                                    key={j}
                                    className="flex justify-start items-start hover:bg-gray-50 p-2 rounded-md transition-colors w-full"
                                    to={`/home/product-details/${pl.slug}`}
                                >
                                    <div
                                        className="min-w-[80px] w-[80px] sm:min-w-[100px] sm:w-[100px] md:min-w-[115px] md:w-[115px]">
                                        <img
                                            className="w-full h-auto rounded-md object-cover"
                                            style={{aspectRatio: "1 / 1", objectPosition: "center"}}
                                            src={pl.images[0]}
                                            alt={pl.product_name}
                                            loading="lazy"
                                        />
                                    </div>

                                    <div
                                        className="px-3 flex justify-start items-start gap-1 flex-col text-slate-600 text-sm flex-1 overflow-hidden">
                                        <h2 className="font-bold text-blue-500 text-sm md:text-base w-full truncate">
                                            {pl.brand_name}
                                        </h2>
                                        <h2 className="line-clamp-2 text-sm md:text-base">{pl.product_name}</h2>
                                        <div className="flex flex-wrap justify-start items-center gap-2 my-1">
                                            {pl.discount > 0 ? (
                                                <>
                                                    <span className="font-bold line-through text-xs md:text-sm">
                                                        {formateCurrency(pl.price)}
                                                    </span>
                                                    <span className="text-sm md:text-base font-bold text-red-500">
                                                        {formateCurrency(pl.price - (pl.price * pl.discount) / 100)}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-sm md:text-base font-bold text-red-500">
                                                    {formateCurrency(pl.price)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex justify-start items-center gap-1">
                                            <span
                                                className={`text-xs md:text-sm ${pl.quantity === 0 ? 'text-red-500' : pl.quantity < 10 ? 'text-orange-500' : 'text-green-600'}`}>
                                                {pl.quantity === 0
                                                    ? 'Đã bán hết'
                                                    : isMobile
                                                        ? (pl.quantity < 10 ? 'Sắp hết' : 'Còn hàng')
                                                        : `Số lượng: ${pl.quantity} ${pl.quantity < 10 ? ' (Sắp hết)' : ''}`
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    );
                })}
            </Carousel>
        </div>
    );
};

export default Product;

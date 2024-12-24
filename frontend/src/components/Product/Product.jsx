/* eslint-disable react/prop-types */
import Carousel from "react-multi-carousel";
import {Link} from "react-router-dom";
import "react-multi-carousel/lib/styles.css";
import icons from "../../assets/icons";
import {formateCurrency} from "../../utils/formate";

const Product = ({products, title}) => {
    const {FiChevronLeft, FiChevronRight} = icons;

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
        return (<div className="flex justify-between items-center bg-white">
            <div className="text-xl  font-mono font-semibold text-red-600">
                {title}
            </div>
            <div className="flex justify-center items-center gap-3 text-slate-600">
                <button
                    onClick={() => previous()}
                    className="w-[30px] h-[30px] flex justify-center rounded-md items-center bg-slate-300 border border-slate-200"
                >
                    <span>
                        <FiChevronLeft/>
                    </span>
                </button>
                <button
                    onClick={() => next()}
                    className="w-[30px] h-[30px] flex justify-center rounded-md items-center bg-slate-300 border border-slate-200"
                >
                    <span>
                        <FiChevronRight/>
                    </span>
                </button>
            </div>
        </div>);
    };

    return (<div className="flex gap-8 flex-col-reverse bg-white">
        <Carousel
            autoPlay={false}
            infinite={false}
            arrows={false}
            responsive={responsive}
            transitionDuration={500}
            renderButtonGroupOutside={true}
            customButtonGroup={<ButtonGroup/>}
        >
            {products.map((p, index) => {
                return (<div key={index} className="flex flex-col justify-start gap-2">
                    {p.map((pl, j) => (
                        <Link key={j} className="flex justify-start items-start" to={`/home/product-details/${pl.slug}`}>
                            <img
                                className="w-[110px] h-[110px]"
                                src={pl.images[0]}
                                alt="images"
                            />

                            <div
                                className="px-3 flex justify-start items-start gap-1 flex-col text-slate-600 text-sm">
                                <h2 className="font-bold text-blue-500">
                                    {pl.brand_name}.
                                </h2>
                                <h2 className="line-clamp-2">{pl.product_name}</h2>
                                <div className="flex justify-start items-center gap-2 m-[2px]">
                                    {pl.discount > 0 ? (
                                        <>
                                            <span className="font-bold line-through">
                                                {formateCurrency(pl.price)}
                                            </span>
                                            <span className="text-base font-bold text-red-500">
                                                {formateCurrency(pl.price - (pl.price * pl.discount) / 100)}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-base font-bold text-red-500">
                                            {formateCurrency(pl.price)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>);
            })}
        </Carousel>
    </div>);
};

export default Product;

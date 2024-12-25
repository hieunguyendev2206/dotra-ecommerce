import Carousel from "react-multi-carousel";
import {Link} from "react-router-dom";
import "react-multi-carousel/lib/styles.css";
import banner1 from "../../assets/banners/1.png";
import banner2 from "../../assets/banners/2.png";
import banner3 from "../../assets/banners/3.png";
import banner4 from "../../assets/banners/4.png";
import banner5 from "../../assets/banners/5.png";
import banner6 from "../../assets/banners/6.png";
import banner7 from "../../assets/banners/7.png";
import banner8 from "../../assets/banners/8.png";


const Banner = () => {
    const responsive = {
        superLargeDesktop: {
            breakpoint: {max: 4000, min: 3000},
            items: 1,
        },
        desktop: {
            breakpoint: {max: 3000, min: 1024},
            items: 1,
        },
        tablet: {
            breakpoint: {max: 1024, min: 464},
            items: 1,
        },
        mobile: {
            breakpoint: {max: 464, min: 0},
            items: 1,
        },
    };

    const banners = [banner1, banner2, banner3, banner4, banner5, banner6, banner7, banner8];

    return (
        <div className="w-full md-lg:mt-6">
            <div className="w-[85%] lg:w-[90%] mx-auto">
                <div className="w-full flex flex-wrap md-lg:gap-8">
                    <div className="w-full">
                        <div className="my-8">
                            <Carousel
                                autoPlay={true}
                                infinite={true}
                                arrows={true}
                                showDots={true}
                                responsive={responsive}
                            >
                                {banners.map((img, i) => (
                                    <Link
                                        className="lg-md:h-[440px] h-auto w-full block rounded-md"
                                        key={i}
                                        to="#"
                                    >
                                        <img
                                            src={img}
                                            alt={`Banner ${i + 1}`}
                                            className="object-cover w-full h-auto rounded-md"
                                        />
                                    </Link>
                                ))}
                            </Carousel>

                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Banner;

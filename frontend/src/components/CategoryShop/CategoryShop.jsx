import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_products } from "../../store/reducers/home.reducers";
import ProductCard from "../ProductCard";
import Lottie from "react-lottie";
import animationData from "../../assets/img/searchNotFound.json";
import PropTypes from "prop-types";

const CategoryShop = ({ category }) => {
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.home);
    const [loading, setLoading] = useState(true);

    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    useEffect(() => {
        if (category) {
            setLoading(true);
            dispatch(get_products({ category }))
                .finally(() => setLoading(false));
        }
    }, [dispatch, category]);

    if (loading) {
        return (
            <div className="w-full min-h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="w-full min-h-[400px] flex flex-col items-center justify-center py-8">
                <Lottie options={defaultOptions} width={200} height={200} />
                <p className="text-center text-lg text-gray-600 mt-4">
                    Không có sản phẩm nào trong danh mục {category}
                </p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="w-[85%] lg:w-[90%] mx-auto">
                <div className="py-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Danh mục: {category}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

CategoryShop.propTypes = {
    category: PropTypes.string.isRequired
};

export default CategoryShop; 
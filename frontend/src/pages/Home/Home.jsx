/* eslint-disable no-unused-vars */
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {get_feature_products} from "../../store/reducers/home.reducers";
import Banner from "../../components/Banner/Banner";
import FeatureProduct from "../../components/FeatureProduct";
import Product from "../../components/Product";
import Footer from "../../layouts/Footer";
import Header from "../../layouts/Header";

const Home = () => {
    const dispatch = useDispatch();
    const {products, latest_products, top_rated_products, discount_products} =
        useSelector((state) => state.home);

    useEffect(() => {
        dispatch(get_feature_products());
    }, [dispatch]);

    return (
        <div className="w-full bg-white">
            <Header/>
            <Banner/>
            <div className="py-[45px]">
                <FeatureProduct products={products}/>
            </div>
            <div className="py-10">
                <div className="w-[85%] flex flex-wrap mx-auto">
                    <div className="grid w-full grid-cols-3 md-lg:grid-cols-2 md:grid-cols-1 gap-7">
                        <div className="overflow-hidden">
                            <Product products={latest_products} title="Sản phẩm mới nhất"/>
                        </div>
                        <div className="overflow-hidden">
                            <Product
                                products={top_rated_products}
                                title="Sản phẩm được đánh giá cao"
                            />
                        </div>
                        <div className="overflow-hidden">
                            <Product products={discount_products} title="Sản phẩm giảm giá"/>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default Home;

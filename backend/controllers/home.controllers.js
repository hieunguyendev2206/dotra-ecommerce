const httpStatusCode = require("../config/httpStatusCode");
const categoryModel = require("../database/models/category.models");
const productModel = require("../database/models/product.models");
const queryProducts = require("../utils/queryProducts");
const response = require("../utils/response");

class homeController {
    // Lấy danh mục sản phẩm
    get_categories = async (req, res) => {
        try {
            const categories = await categoryModel.find({});
            response(res, httpStatusCode.Ok, {
                data: categories,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Chia danh sách sản phẩm thành các nhóm, mỗi nhóm có tối đa 3 sản phẩm
    formateProducts = (products) => {
        const productArray = [];
        for (let i = 0; i < products.length; i += 3) {
            productArray.push(products.slice(i, i + 3));
        }
        return productArray;
    };

    // Lấy danh sách sản phẩm nổi bật
    get_feature_products = async (req, res) => {
        try {
            const products = await productModel
                .find({})
                .limit(30)
                .sort({createdAt: -1});

            const getLatestProducts = await productModel
                .find({})
                .limit(9)
                .sort({createdAt: -1});
            const latest_products = this.formateProducts(getLatestProducts);

            const getTopRatedProducts = await productModel
                .find({})
                .limit(9)
                .sort({rating: -1});
            const top_rated_products = this.formateProducts(getTopRatedProducts);

            const getDiscountProducts = await productModel
                .find({discount: {$gt: 0}})
                .limit(9)
                .sort({discount: -1});
            const discount_products = this.formateProducts(getDiscountProducts);

            response(res, httpStatusCode.Ok, {
                data: {
                    products, latest_products, top_rated_products, discount_products,
                },
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Truy vấn sản phẩm
    query_products = async (req, res) => {
        try {
            const products = await productModel.find({}).sort({createdAt: -1});
            const totalProducts = new queryProducts(products, req.query)
                .categoryQuery()
                .ratingQuery()
                .priceQuery()
                .searchQuery()
                .countProducts();

            const resultProducts = new queryProducts(products, req.query)
                .categoryQuery()
                .ratingQuery()
                .priceQuery()
                .sortByPrice()
                .searchQuery()
                .skip()
                .limit()
                .getProducts();

            response(res, httpStatusCode.Ok, {
                data: {
                    products: resultProducts, totalProducts,
                },
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Tìm kiếm sản phẩm
    search_product = async (req, res) => {
        const { category, searchValue } = req.query;

        const filter = {};
        if (category) filter.category_name = category;
        if (searchValue) filter.product_name = { $regex: searchValue, $options: 'i' };

        try {
            const products = await productModel.find(filter);
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error });
        }
    };

    // Lấy chi tiết sản phẩm theo id
    get_product_details = async (req, res) => {
        const {productId} = req.params;
        try {
            const product_details = await productModel.findById(productId);
            const related_products = await productModel
                .find({
                    $and: [{
                        _id: {
                            $ne: product_details._id,
                        },
                    }, {
                        category_name: {
                            $eq: product_details.category_name,
                        },
                    },],
                })
                .limit(20);

            const more_products = await productModel
                .find({
                    $and: [{
                        _id: {
                            $ne: product_details._id,
                        },
                    }, {
                        sellerId: {
                            $eq: product_details.sellerId,
                        },
                    },],
                })
                .limit(3);
            response(res, httpStatusCode.Ok, {
                data: {
                    product_details, related_products, more_products,
                },
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy chi tiết sản phẩm theo slug
    get_product_by_slug = async (req, res) => {
        const { slug } = req.params;
        try {
            const product_details = await productModel.findOne({ slug });
            if (!product_details) {
                return res.status(404).json({ message: "Sản phẩm không tồn tại." });
            }

            const related_products = await productModel.find({
                slug: { $ne: product_details.slug },
                category_name: product_details.category_name,
            }).limit(20);

            const more_products = await productModel.find({
                sellerId: product_details.sellerId,
            }).limit(3);

            response(res, httpStatusCode.Ok, {
                data: {
                    product_details,
                    related_products,
                    more_products,
                },
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };
}

module.exports = new homeController();

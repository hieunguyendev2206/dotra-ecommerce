const formidable = require("formidable");
const env = require("../config/env.config");
const cloudinary = require("cloudinary").v2;
const productModel = require("../database/models/product.models");
const response = require("../utils/response");
const httpStatusCode = require("../config/httpStatusCode");
const {successMessage, errorMessage} = require("../config/message.config");

class productController {
    // Thêm sản phẩm
    add_product = async (req, res) => {
        const {id} = req;
        const form = formidable({multiples: true});
        form.parse(req, async (err, field, files) => {
            let {
                product_name, brand_name, category_name, price, quantity, discount, description, shop_name,
                colors,
                sizes
            } = field;
            const {images} = files;

            // Parse colors và sizes từ JSON string sang object
            const parsedColors = JSON.parse(colors);
            const parsedSizes = JSON.parse(sizes);
            
            product_name = product_name.trim();
            const slug = product_name.split(" ").join("-");

            cloudinary.config({
                cloud_name: env.CLOUDINARY_CLOUD_NAME,
                api_key: env.CLOUDINARY_API_KEY,
                api_secret: env.CLOUDINARY_API_SECRET,
                secure: true,
            });

            try {
                let allImageUrl = [];
                for (let i = 0; i < images.length; i++) {
                    const uploadImage = await cloudinary.uploader.upload(images[i].filepath, {
                        folder: "dotra_product",
                    });
                    allImageUrl = [...allImageUrl, uploadImage.url];
                }

                const product = await productModel.create({
                    sellerId: id,
                    product_name,
                    brand_name: brand_name.trim(),
                    category_name: category_name.trim(),
                    price: parseInt(price),
                    quantity: parseInt(quantity),
                    discount: parseInt(discount),
                    description: description.trim(),
                    images: allImageUrl,
                    colors: parsedColors,
                    sizes: parsedSizes,
                    slug,
                    shop_name,
                });
                response(res, httpStatusCode.Created, {
                    message: successMessage.ADD_PRODUCT_SUCCESS, data: product,
                });
            } catch (error) {
                response(res, httpStatusCode.InternalServerError, {
                    message: error.message,
                });
            }
        });
    };

    // Lấy tất cả sản phẩm
    get_products = async (req, res) => {
        const {page, searchValue, parPage} = req.query;
        const {id} = req;
        try {
            let skipPage = "";
            if (page && parPage) {
                skipPage = (parseInt(page) - 1) * parseInt(parPage);
            }
            if (searchValue && page && parPage) {
                const products = await productModel
                    .find({
                        sellerId: id, $text: {$search: searchValue},
                    })
                    .skip(skipPage)
                    .limit(parseInt(parPage));

                const totalProduct = await productModel
                    .find({
                        sellerId: id, $text: {$search: searchValue},
                    })
                    .countDocuments();
                response(res, httpStatusCode.Ok, {
                    totalProduct, products,
                });
            } else if (searchValue === "" && page && parPage) {
                const products = await productModel
                    .find({sellerId: id})
                    .skip(skipPage)
                    .limit(parseInt(parPage));

                const totalProduct = await productModel
                    .find({sellerId: id})
                    .countDocuments();
                response(res, httpStatusCode.Ok, {
                    totalProduct, products,
                });
            } else {
                const products = await productModel.find({sellerId: id});

                const totalProduct = await productModel
                    .find({sellerId: id})
                    .countDocuments();
                response(res, httpStatusCode.Ok, {
                    totalProduct, products,
                });
            }
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy chi tiết sản phẩm
    get_product = async (req, res) => {
        const {productId} = req.params;
        try {
            const product = await productModel.findById(productId);
            response(res, httpStatusCode.Ok, {product});
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    get_shop_products = async (req, res) => {
        const { shopId } = req.params;
        try {
            const products = await productModel.find({ sellerId: shopId });
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error });
        }
    };

    // Cập nhật sản phẩm
    update_product = async (req, res) => {
        let {
            product_name, brand_name, price, quantity, discount, description, productId,
            colors,
            sizes
        } = req.body;

        let updateFields = {};

        if (product_name) {
            updateFields.product_name = product_name;
            updateFields.slug = product_name.split(" ").join("-");
        }

        if (brand_name) updateFields.brand_name = brand_name.trim();
        if (price) updateFields.price = parseInt(price);
        if (quantity) updateFields.quantity = parseInt(quantity);
        if (discount) updateFields.discount = parseInt(discount);
        if (description) updateFields.description = description.trim();
        if (colors) updateFields.colors = colors;
        if (sizes) updateFields.sizes = sizes;

        try {
            await productModel.findByIdAndUpdate(productId, updateFields);
            const product = await productModel.findById(productId);
            response(res, httpStatusCode.Ok, {
                message: successMessage.UPDATE_PRODUCT_SUCCESS, data: product,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Cập nhật ảnh sản phẩm
    update_product_image = async (req, res) => {
        const form = formidable({multiples: true});
        form.parse(req, async (err, field, files) => {
            const {old_image, productId} = field;
            const {new_image} = files;

            cloudinary.config({
                cloud_name: env.CLOUDINARY_CLOUD_NAME,
                api_key: env.CLOUDINARY_API_KEY,
                api_secret: env.CLOUDINARY_API_SECRET,
                secure: true,
            });
            try {
                const upload_update_image = await cloudinary.uploader.upload(new_image.filepath, {
                    folder: "dotra_product",
                });

                if (upload_update_image) {
                    let product_find = await productModel.findById(productId);
                    if (!product_find) {
                        response(res, httpStatusCode.NotFound, {
                            message: errorMessage.PRODUCT_NOT_FOUND,
                        });
                    } else {
                        let images = product_find.images;
                        const index = images.findIndex((img) => img === old_image);
                        images[index] = upload_update_image.url;

                        await productModel.findByIdAndUpdate(productId, {
                            images,
                        });

                        const product = await productModel.findById(productId);
                        response(res, httpStatusCode.Ok, {
                            data: product,
                        });
                    }
                }
            } catch (error) {
                response(res, httpStatusCode.InternalServerError, {
                    message: error.message,
                });
            }
        });
    };

    // Xóa sản phẩm
    delete_product = async (req, res) => {
        const {productIdDelete} = req.params;
        try {
            const product = await productModel.findByIdAndDelete(productIdDelete);
            if (!product) {
                response(res, httpStatusCode.NotFound, {
                    message: errorMessage.PRODUCT_NOT_FOUND,
                });
            } else {
                response(res, httpStatusCode.Ok, {
                    message: successMessage.DELETE_PRODUCT_SUCCESS, data: product,
                });
            }
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };
}

module.exports = new productController();

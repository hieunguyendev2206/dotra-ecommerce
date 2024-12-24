const {errorMessage, successMessage} = require("../config/message.config");
const formidable = require("formidable");
const response = require("../utils/response");
const httpStatusCode = require("../config/httpStatusCode");
const env = require("../config/env.config");
const cloudinary = require("cloudinary").v2;
const categoryModel = require("../database/models/category.models");

class categoryController {
    // Thêm danh mục sản phẩm
    add_category = async (req, res) => {
        const form = formidable();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                response(res, httpStatusCode.BadRequest, {
                    message: errorMessage.ADD_CATEGORY_FAIL,
                });
            } else {
                let {category_name} = fields;
                let {image} = files;
                category_name = category_name.trim();
                const slug = category_name.split(" ").join("-");

                cloudinary.config({
                    cloud_name: env.CLOUDINARY_CLOUD_NAME,
                    api_key: env.CLOUDINARY_API_KEY,
                    api_secret: env.CLOUDINARY_API_SECRET,
                    secure: true,
                });

                try {
                    const result = await cloudinary.uploader.upload(image.filepath, {
                        folder: "dotra_category",
                    });
                    if (result) {
                        const new_category = await categoryModel.create({
                            category_name, image: result.url, slug,
                        });
                        response(res, httpStatusCode.Created, {
                            message: successMessage.ADD_CATEGORY_SUCCESS, data: new_category,
                        });
                    } else {
                        response(res, httpStatusCode.BadRequest, {
                            message: errorMessage.UPLOAD_IMAGE_FAIL,
                        });
                    }
                } catch (error) {
                    response(res, httpStatusCode.InternalServerError, {
                        message: error.message,
                    });
                }
            }
        });
    };

    // Lấy danh sách danh mục sản phẩm
    get_categories = async (req, res) => {
        const {page, parPage, searchValue} = req.query;
        try {
            let skipPage = "";
            if (page && parPage) {
                skipPage = (parseInt(page) - 1) * parseInt(parPage);
            }
            if (searchValue && page && parPage) {
                const category = await categoryModel
                    .find({
                        $text: {$search: searchValue},
                    })
                    .skip(skipPage)
                    .limit(parPage)
                    .sort({createdAt: -1});
                const totalCategory = await categoryModel
                    .find({
                        $text: {$search: searchValue},
                    })
                    .countDocuments();
                response(res, httpStatusCode.Ok, {
                    totalCategory, category,
                });
            } else if (searchValue === "" && page && parPage) {
                const category = await categoryModel
                    .find({})
                    .skip(skipPage)
                    .limit(parPage)
                    .sort({createdAt: -1});
                const totalCategory = await categoryModel.find({}).countDocuments();
                response(res, httpStatusCode.Ok, {
                    totalCategory, category,
                });
            } else {
                const category = await categoryModel.find({}).sort({createdAt: -1});
                const totalCategory = await categoryModel.find({}).countDocuments();
                response(res, httpStatusCode.Ok, {
                    totalCategory, category,
                });
            }
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };
}

module.exports = new categoryController();

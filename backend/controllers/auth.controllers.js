const {errorMessage, successMessage} = require("../config/message.config");
const {createVerifyToken, createToken} = require("../utils/jwt");
const adminModel = require("../database/models/admin.models");
const sellerModel = require("../database/models/seller.models");
const sellerToCustomerModel = require("../database/models/sellerToCustomer.models");
const bcrypt = require("bcrypt");
const response = require("../utils/response");
const httpStatusCode = require("../config/httpStatusCode");
const sendMail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");
const env = require("../config/env.config");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;

class authController {
    //Đăng nhập admin
    admin_login = async (req, res) => {
        const {email, password} = req.body;
        try {
            const admin = await adminModel.findOne({email});
            if (admin) {
                const isMatch = await bcrypt.compare(password, admin.password);
                if (isMatch) {
                    const access_token = await createToken({
                        id: admin.id, role: admin.role,
                    });
                    res.cookie("access_token", access_token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    });
                    response(res, httpStatusCode.Ok, {
                        message: successMessage.LOGIN_SUCCESS, data: {
                            access_token
                        }
                    });
                } else {
                    response(res, httpStatusCode.BadRequest, {
                        message: errorMessage.PASSWORD_NOT_MATCH,
                    });
                }
            } else {
                response(res, httpStatusCode.NotFound, {
                    message: errorMessage.EMAIL_NOT_FOUND,
                });
            }
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Đăng ký seller
    seller_register = async (req, res) => {
        const {name, email, password} = req.body;
        try {
            const isEmailExist = await sellerModel.findOne({email});
            if (isEmailExist) {
                response(res, httpStatusCode.BadRequest, {
                    message: errorMessage.EMAIL_ALREADY_EXIST,
                });
            } else {
                const seller = {
                    name: name, email: email, password: password,
                };
                const email_token = await createVerifyToken(seller);
                await sendMail({
                    email: seller.email, // language=HTML
                    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
                            "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
                    <html lang="vi">
                    <head>                      <!-- Compiled with Bootstrap Email version: 1.3.1 -->
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
                        <meta http-equiv="x-ua-compatible" content="ie=edge"/>
                        <meta name="x-apple-disable-message-reformatting" content=""/>
                        <meta name="viewport" content="width=device-width, initial-scale=1"/>
                        <meta name="format-detection" content="telephone=no, date=no, address=no, email=no"/>
                        <style type="text/css">
                            body, table, td {
                                font-family: Helvetica, Arial, sans-serif !important;
                            }

                            .ExternalClass {
                                width: 100%;
                            }

                            .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
                                line-height: 150%;
                            }

                            a {
                                text-decoration: none;
                            }

                            * {
                                color: inherit;
                            }

                            a[x-apple-data-detectors], u + #body a, #MessageViewBody a {
                                color: inherit;
                                text-decoration: none;
                                font-size: inherit;
                                font-family: inherit;
                                font-weight: inherit;
                                line-height: inherit;
                            }

                            img {
                                -ms-interpolation-mode: bicubic;
                            }

                            table:not([class^='s-']) {
                                font-family: Helvetica, Arial, sans-serif;
                                mso-table-lspace: 0;
                                mso-table-rspace: 0;
                                border-spacing: 0;
                                border-collapse: collapse;
                            }

                            table:not([class^='s-']) td {
                                border-spacing: 0;
                                border-collapse: collapse;
                            }

                            @media screen and (max-width: 600px) {
                                .w-full, .w-full > tbody > tr > td {
                                    width: 100% !important;
                                }

                                .w-24, .w-24 > tbody > tr > td {
                                    width: 96px !important;
                                }

                                .w-40, .w-40 > tbody > tr > td {
                                    width: 160px !important;
                                }

                                .p-lg-10:not(table), .p-lg-10:not(.btn) > tbody > tr > td, .p-lg-10.btn td a {
                                    padding: 0 !important;
                                }

                                .p-3:not(table), .p-3:not(.btn) > tbody > tr > td, .p-3.btn td a {
                                    padding: 12px !important;
                                }

                                .p-6:not(table), .p-6:not(.btn) > tbody > tr > td, .p-6.btn td a {
                                    padding: 24px !important;
                                }

                                *[class*='s-lg-'] > tbody > tr > td {
                                    font-size: 0 !important;
                                    line-height: 0 !important;
                                    height: 0 !important;
                                }

                                .s-4 > tbody > tr > td {
                                    font-size: 16px !important;
                                    line-height: 16px !important;
                                    height: 16px !important;
                                }

                                .s-6 > tbody > tr > td {
                                    font-size: 24px !important;
                                    line-height: 24px !important;
                                    height: 24px !important;
                                }

                                .s-10 > tbody > tr > td {
                                    font-size: 40px !important;
                                    line-height: 40px !important;
                                    height: 40px !important;
                                }
                            }
                        </style>
                        <title></title>
                    </head>
                    <body class="bg-light"
                          style="\n      outline: 0;\n      width: 100%;\n      min-width: 100%;\n      height: 100%;\n      -webkit-text-size-adjust: 100%;\n      -ms-text-size-adjust: 100%;\n      font-family: Helvetica, Arial, sans-serif;\n      line-height: 24px;\n      font-weight: normal;\n      font-size: 16px;\n      -moz-box-sizing: border-box;\n      -webkit-box-sizing: border-box;\n      box-sizing: border-box;\n      color: #000000;\n      margin: 0;\n      padding: 0;\n      border-width: 0;\n    "
                          bgcolor="#f7fafc">
                    <table class="bg-light body" valign="top" role="presentation" border="0" cellpadding="0"
                           cellspacing="0"
                           style="\n        outline: 0;\n        width: 100%;\n        min-width: 100%;\n        height: 100%;\n        -webkit-text-size-adjust: 100%;\n        -ms-text-size-adjust: 100%;\n        font-family: Helvetica, Arial, sans-serif;\n        line-height: 24px;\n        font-weight: normal;\n        font-size: 16px;\n        -moz-box-sizing: border-box;\n        -webkit-box-sizing: border-box;\n        box-sizing: border-box;\n        color: #000000;\n        margin: 0;\n        padding: 0;\n        border-width: 0;\n      "
                           bgcolor="#f7fafc">
                        <tbody>
                        <tr>
                            <td valign="top" style="line-height: 24px; font-size: 16px; margin: 0" align="left"
                                bgcolor="#f7fafc">
                                <table class="container" role="presentation" border="0" cellpadding="0" cellspacing="0"
                                       style="width: 100%">
                                    <tbody>
                                    <tr>
                                        <td align="center"
                                            style="line-height: 24px; font-size: 16px; margin: 0; padding: 0 16px">
                                            <!--[if (gte mso 9)|(IE)]>\n                                <table align="center" role="presentation">\n                                  <tbody>\n                                    <tr>\n                                      <td width="600">\n                              <![endif]-->
                                            <table align="center" role="presentation" border="0" cellpadding="0"
                                                   cellspacing="0"
                                                   style="width: 100%; max-width: 600px; margin: 0 auto">
                                                <tbody>
                                                <tr>
                                                    <td style="line-height: 24px; font-size: 16px; margin: 0"
                                                        align="left">
                                                        <table class="s-10 w-full" role="presentation" border="0"
                                                               cellpadding="0" cellspacing="0" style="width: 100%"
                                                               width="100%">
                                                            <tbody>
                                                            <tr>
                                                                <td style="line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0"
                                                                    align="left" width="100%" height="40"> &#160;
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <table class="ax-center" role="presentation" align="center"
                                                               border="0" cellpadding="0" cellspacing="0"
                                                               style="margin: 0 auto">
                                                            <tbody>
                                                            <tr>
                                                                <td style="line-height: 24px; font-size: 16px; margin: 0"
                                                                    align="left"><img class="w-24"
                                                                                      src="https://res.cloudinary.com/damiapdnh/image/upload/v1714124119/logo/logo_di1oyf.png"
                                                                                      style="\n                                        height: 50px;\n                                        line-height: 100%;\n                                        outline: none;\n                                        text-decoration: none;\n                                        display: block;\n                                        width: 220px;\n                                        border-style: none;\n                                        border-width: 0;\n                                      "
                                                                                      width="96" alt=""/></td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <table class="s-10 w-full" role="presentation" border="0"
                                                               cellpadding="0" cellspacing="0" style="width: 100%"
                                                               width="100%">
                                                            <tbody>
                                                            <tr>
                                                                <td style="line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0"
                                                                    align="left" width="100%" height="40"> &#160;
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <table class="card p-6 p-lg-10 space-y-4" role="presentation"
                                                               border="0" cellpadding="0" cellspacing="0"
                                                               style="\n                                border-radius: 6px;\n                                border-collapse: separate !important;\n                                width: 100%;\n                                overflow: hidden;\n                                border: 1px solid #e2e8f0;\n                              "
                                                               bgcolor="#ffffff">
                                                            <tbody>
                                                            <tr>
                                                                <td style="line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 40px"
                                                                    align="left" bgcolor="#ffffff"><h1 class="h3 fw-700"
                                                                                                       style="\n                                        padding-top: 0;\n                                        padding-bottom: 0;\n                                        font-weight: 700 !important;\n                                        vertical-align: baseline;\n                                        font-size: 28px;\n                                        line-height: 34px;\n                                        margin: 0;\n                                      "
                                                                                                       align="left"> XÁC
                                                                    THỰC TÀI KHOẢN </h1>
                                                                    <table class="s-4 w-full" role="presentation"
                                                                           border="0" cellpadding="0" cellspacing="0"
                                                                           style="width: 100%" width="100%">
                                                                        <tbody>
                                                                        <tr>
                                                                            <td style="\n                                              line-height: 16px;\n                                              font-size: 16px;\n                                              width: 100%;\n                                              height: 16px;\n                                              margin: 0;\n                                            "
                                                                                align="left" width="100%" height="16">
                                                                                &#160;
                                                                            </td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>
                                                                    <p class=""
                                                                       style="line-height: 24px; font-size: 16px; width: 100%; margin: 0"
                                                                       align="left"> Xin chào ${seller.name}, Chào mừng
                                                                        bạn đến với Dotra Ecommerce, vui lòng nhấn vào
                                                                        nút bên dưới để xác thực tài khoản </p>
                                                                    <table class="s-4 w-full" role="presentation"
                                                                           border="0" cellpadding="0" cellspacing="0"
                                                                           style="width: 100%" width="100%">
                                                                        <tbody>
                                                                        <tr>
                                                                            <td style="\n                                              line-height: 16px;\n                                              font-size: 16px;\n                                              width: 100%;\n                                              height: 16px;\n                                              margin: 0;\n                                            "
                                                                                align="left" width="100%" height="16">
                                                                                &#160;
                                                                            </td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>
                                                                    <table class="btn btn-primary p-3 fw-700"
                                                                           role="presentation" border="0"
                                                                           cellpadding="0" cellspacing="0"
                                                                           style="\n                                        border-radius: 6px;\n                                        border-collapse: separate !important;\n                                        font-weight: 700 !important;\n                                      ">
                                                                        <tbody>
                                                                        <tr>
                                                                            <td style="\n                                              line-height: 24px;\n                                              font-size: 16px;\n                                              border-radius: 6px;\n                                              font-weight: 700 !important;\n                                              margin: 0;\n                                            "
                                                                                align="center" bgcolor="#0d6efd"><a
                                                                                    href="http://localhost:3000/verify-email/${email_token}"
                                                                                    style="\n                                                color: #ffffff;\n                                                font-size: 16px;\n                                                font-family: Helvetica, Arial, sans-serif;\n                                                text-decoration: none;\n                                                border-radius: 6px;\n                                                line-height: 20px;\n                                                display: block;\n                                                font-weight: 700 !important;\n                                                white-space: nowrap;\n                                                background-color: #0d6efd;\n                                                padding: 12px;\n                                                border: 1px solid #0d6efd;\n                                              ">Xác
                                                                                thực tài khoản</a></td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <table class="s-10 w-full" role="presentation" border="0"
                                                               cellpadding="0" cellspacing="0" style="width: 100%"
                                                               width="100%">
                                                            <tbody>
                                                            <tr>
                                                                <td style="line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0"
                                                                    align="left" width="100%" height="40"> &#160;
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <table class="s-6 w-full" role="presentation" border="0"
                                                               cellpadding="0" cellspacing="0" style="width: 100%"
                                                               width="100%">
                                                            <tbody>
                                                            <tr>
                                                                <td style="line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0"
                                                                    align="left" width="100%" height="24"> &#160;
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <table class="s-6 w-full" role="presentation" border="0"
                                                               cellpadding="0" cellspacing="0" style="width: 100%"
                                                               width="100%">
                                                            <tbody>
                                                            <tr>
                                                                <td style="line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0"
                                                                    align="left" width="100%" height="24"> &#160;
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (gte mso 9)|(IE)]>\n                              </td>\n                            </tr>\n                          </tbody>\n                        </table>\n                              <![endif]-->
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </body>
                    </html>                    `,
                });
                response(res, httpStatusCode.Ok, {
                    message: successMessage.VERIFY_EMAIL,
                });
            }
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Xác thực email seller và lưu thông tin seller vào database
    verify_email = async (req, res) => {
        const {emailToken} = req.params;
        try {
            const seller = jwt.verify(emailToken, env.VERIFY_EMAIL_SECRET_KEY);
            if (seller) {
                const {name, email, password} = seller;
                const salt = await bcrypt.genSalt(10);
                const new_seller = await sellerModel.create({
                    name: name,
                    email: email,
                    password: await bcrypt.hash(password, salt),
                    isVerified: true,
                    shopInfo: {},
                });
                await sellerToCustomerModel.create({
                    myId: new_seller.id, myFriends: [],
                });
                response(res, httpStatusCode.Created, {
                    message: successMessage.REGISTER_SUCCESS,
                });
            }
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Seller đăng nhập
    seller_login = async (req, res) => {
        const {email, password} = req.body;
        try {
            const seller = await sellerModel.findOne({email});
            if (seller) {
                const isMatch = await bcrypt.compare(password, seller.password);
                if (isMatch) {
                    const access_token = await createToken({
                        id: seller.id, role: seller.role,
                    });
                    res.cookie("access_token", access_token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    });
                    response(res, httpStatusCode.Ok, {
                        message: successMessage.LOGIN_SUCCESS, data: {
                            access_token,
                        },
                    });
                } else {
                    response(res, httpStatusCode.BadRequest, {
                        message: errorMessage.PASSWORD_NOT_MATCH,
                    });
                }
            } else {
                response(res, httpStatusCode.NotFound, {
                    message: errorMessage.EMAIL_NOT_FOUND,
                });
            }
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // lấy thông tin user
    get_user_info = async (req, res) => {
        const { id, role } = req;

        try {
            if (role === "admin") {
                const admin = await adminModel.findById(id);
                response(res, httpStatusCode.Ok, {
                  data: admin,
                });
            } else {
                const seller = await  sellerModel.findById(id);
                response(res, httpStatusCode.Ok, {
                  data: seller,
                });
            }
        } catch (error) {
            response(res, httpStatusCode.NotFound, {
                message: errorMessage.USER_NOT_FOUND,
            });
        }
    };

    // Đăng xuất
    logout = async (req, res) => {
        res.clearCookie("access_token");
        response(res, httpStatusCode.Ok, {
            message: successMessage.LOGOUT_SUCCESS,
        });
    };

    // Upload ảnh profile
    upload_profile_image = async (req, res) => {
        const {id} = req;
        const form = formidable({multiples: true});
        form.parse(req, async (err, _, files) => {
            const {image} = files;
            cloudinary.config({
                cloud_name: env.CLOUDINARY_CLOUD_NAME,
                api_key: env.CLOUDINARY_API_KEY,
                api_secret: env.CLOUDINARY_API_SECRET,
                secure: true,
            });
            try {
                const upload_image = await cloudinary.uploader.upload(image.filepath, {
                    folder: "dotra_profile",
                });

                if (upload_image) {
                    await sellerModel.findByIdAndUpdate(id, {
                        image: upload_image.url,
                    });

                    const user_info = await sellerModel.findById(id);
                    response(res, httpStatusCode.Ok, {
                        message: successMessage.UPLOAD_IMAGE_SUCCESS, data: user_info,
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
        });
    };

    // Thêm thông tin profile
    add_profile_info = async (req, res) => {
        const {shop_name, province, district, ward} = req.body;
        const {id} = req;

        try {
            await sellerModel.findByIdAndUpdate(id, {
                shop_info: {
                    shop_name, province, district, ward,
                },
            });
            const user_info = await sellerModel.findById(id);
            response(res, httpStatusCode.Created, {
                message: successMessage.ADD_PROFILE_SUCCESS, data: user_info,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Thay đổi mật khẩu
    change_password = async (req, res) => {
        const {old_password, new_password} = req.body;
        const {id} = req;
        try {
            const seller = await sellerModel.findById(id);
            const isMatch = await bcrypt.compare(old_password, seller.password);
            if (isMatch) {
                const salt = await bcrypt.genSalt(10);
                await sellerModel.findByIdAndUpdate(id, {
                    password: await bcrypt.hash(new_password, salt),
                });
                response(res, httpStatusCode.Ok, {
                    message: successMessage.CHANGE_PASSWORD_SUCCESS,
                });
            } else {
                response(res, httpStatusCode.BadRequest, {
                    message: errorMessage.OLD_PASSWORD_NOT_MATCH,
                });
            }
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Quên mật khẩu
    forgot_password = async (req, res) => {
        const {email, name} = req.body;
        try {
            const isEmailExist = await sellerModel.findOne({email});
            if (!isEmailExist) {
                response(res, httpStatusCode.BadRequest, {
                    message: errorMessage.EMAIL_NOT_FOUND,
                });
            } else {
                const seller = {
                    name: name, email: email,
                };
                const email_token = await createVerifyToken(seller);
                await sendMail({
                    email: seller.email, // language=HTML
                    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
                            "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
                    <html lang="">
                    <head>
                        <!-- Compiled with Bootstrap Email version: 1.3.1 -->
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
                        <meta http-equiv="x-ua-compatible" content="ie=edge"/>
                        <meta name="x-apple-disable-message-reformatting" content=""/>
                        <meta name="viewport" content="width=device-width, initial-scale=1"/>
                        <meta name="format-detection" content="telephone=no, date=no, address=no, email=no"/>
                        <style type="text/css">
                            body,
                            table,
                            td {
                                font-family: Helvetica, Arial, sans-serif !important;
                            }

                            .ExternalClass {
                                width: 100%;
                            }

                            .ExternalClass,
                            .ExternalClass p,
                            .ExternalClass span,
                            .ExternalClass font,
                            .ExternalClass td,
                            .ExternalClass div {
                                line-height: 150%;
                            }

                            a {
                                text-decoration: none;
                            }

                            * {
                                color: inherit;
                            }

                            a[x-apple-data-detectors],
                            u + #body a,
                            #MessageViewBody a {
                                color: inherit;
                                text-decoration: none;
                                font-size: inherit;
                                font-family: inherit;
                                font-weight: inherit;
                                line-height: inherit;
                            }

                            img {
                                -ms-interpolation-mode: bicubic;
                            }

                            table:not([class^='s-']) {
                                font-family: Helvetica, Arial, sans-serif;
                                mso-table-lspace: 0;
                                mso-table-rspace: 0;
                                border-spacing: 0;
                                border-collapse: collapse;
                            }

                            table:not([class^='s-']) td {
                                border-spacing: 0;
                                border-collapse: collapse;
                            }

                            @media screen and (max-width: 600px) {
                                .w-full,
                                .w-full > tbody > tr > td {
                                    width: 100% !important;
                                }

                                .w-24,
                                .w-24 > tbody > tr > td {
                                    width: 96px !important;
                                }

                                .w-40,
                                .w-40 > tbody > tr > td {
                                    width: 160px !important;
                                }

                                .p-lg-10:not(table),
                                .p-lg-10:not(.btn) > tbody > tr > td,
                                .p-lg-10.btn td a {
                                    padding: 0 !important;
                                }

                                .p-3:not(table),
                                .p-3:not(.btn) > tbody > tr > td,
                                .p-3.btn td a {
                                    padding: 12px !important;
                                }

                                .p-6:not(table),
                                .p-6:not(.btn) > tbody > tr > td,
                                .p-6.btn td a {
                                    padding: 24px !important;
                                }

                                *[class*='s-lg-'] > tbody > tr > td {
                                    font-size: 0 !important;
                                    line-height: 0 !important;
                                    height: 0 !important;
                                }

                                .s-4 > tbody > tr > td {
                                    font-size: 16px !important;
                                    line-height: 16px !important;
                                    height: 16px !important;
                                }

                                .s-6 > tbody > tr > td {
                                    font-size: 24px !important;
                                    line-height: 24px !important;
                                    height: 24px !important;
                                }

                                .s-10 > tbody > tr > td {
                                    font-size: 40px !important;
                                    line-height: 40px !important;
                                    height: 40px !important;
                                }
                            }
                        </style>
                        <title></title>
                    </head>
                    <body
                            class="bg-light"
                            style="
                                  outline: 0;
                                  width: 100%;
                                  min-width: 100%;
                                  height: 100%;
                                  -webkit-text-size-adjust: 100%;
                                  -ms-text-size-adjust: 100%;
                                  font-family: Helvetica, Arial, sans-serif;
                                  line-height: 24px;
                                  font-weight: normal;
                                  font-size: 16px;
                                  -moz-box-sizing: border-box;
                                  -webkit-box-sizing: border-box;
                                  box-sizing: border-box;
                                  color: #000000;
                                  margin: 0;
                                  padding: 0;
                                  border-width: 0;
                                "
                            bgcolor="#f7fafc"
                    >
                    <table
                            class="bg-light body"
                            valign="top"
                            role="presentation"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            style="
                                    outline: 0;
                                    width: 100%;
                                    min-width: 100%;
                                    height: 100%;
                                    -webkit-text-size-adjust: 100%;
                                    -ms-text-size-adjust: 100%;
                                    font-family: Helvetica, Arial, sans-serif;
                                    line-height: 24px;
                                    font-weight: normal;
                                    font-size: 16px;
                                    -moz-box-sizing: border-box;
                                    -webkit-box-sizing: border-box;
                                    box-sizing: border-box;
                                    color: #000000;
                                    margin: 0;
                                    padding: 0;
                                    border-width: 0;
                                  "
                            bgcolor="#f7fafc"
                    >
                        <tbody>
                        <tr>
                            <td valign="top" style="line-height: 24px; font-size: 16px; margin: 0" align="left"
                                bgcolor="#f7fafc">
                                <table class="container" role="presentation" border="0" cellpadding="0" cellspacing="0"
                                       style="width: 100%">
                                    <tbody>
                                    <tr>
                                        <td align="center"
                                            style="line-height: 24px; font-size: 16px; margin: 0; padding: 0 16px">
                                            <!--[if (gte mso 9)|(IE)]>
                                              <table align="center" role="presentation">
                                                <tbody>
                                                  <tr>
                                                    <td width="600">
                                            <![endif]-->
                                            <table
                                                    align="center"
                                                    role="presentation"
                                                    border="0"
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                    style="width: 100%; max-width: 600px; margin: 0 auto"
                                            >
                                                <tbody>
                                                <tr>
                                                    <td style="line-height: 24px; font-size: 16px; margin: 0"
                                                        align="left">
                                                        <table
                                                                class="s-10 w-full"
                                                                role="presentation"
                                                                border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                style="width: 100%"
                                                                width="100%"
                                                        >
                                                            <tbody>
                                                            <tr>
                                                                <td
                                                                        style="line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0"
                                                                        align="left"
                                                                        width="100%"
                                                                        height="40"
                                                                >
                                                                    &#160;
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <table
                                                                class="ax-center"
                                                                role="presentation"
                                                                align="center"
                                                                border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                style="margin: 0 auto"
                                                        >
                                                            <tbody>
                                                            <tr>
                                                                <td style="line-height: 24px; font-size: 16px; margin: 0"
                                                                    align="left">
                                                                    <img
                                                                            class="w-24"
                                                                            src="https://res.cloudinary.com/damiapdnh/image/upload/v1714124119/logo/logo_di1oyf.png"
                                                                            style="
                                                                    height: 50px;
                                                                    line-height: 100%;
                                                                    outline: none;
                                                                    text-decoration: none;
                                                                    display: block;
                                                                    width: 220px;
                                                                    border-style: none;
                                                                    border-width: 0;
                                                                  "
                                                                            width="96"
                                                                            alt=""/>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <table
                                                                class="s-10 w-full"
                                                                role="presentation"
                                                                border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                style="width: 100%"
                                                                width="100%"
                                                        >
                                                            <tbody>
                                                            <tr>
                                                                <td
                                                                        style="line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0"
                                                                        align="left"
                                                                        width="100%"
                                                                        height="40"
                                                                >
                                                                    &#160;
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <table
                                                                class="card p-6 p-lg-10 space-y-4"
                                                                role="presentation"
                                                                border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                style="
                                                            border-radius: 6px;
                                                            border-collapse: separate !important;
                                                            width: 100%;
                                                            overflow: hidden;
                                                            border: 1px solid #e2e8f0;
                                                          "
                                                                bgcolor="#ffffff"
                                                        >
                                                            <tbody>
                                                            <tr>
                                                                <td
                                                                        style="line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 40px"
                                                                        align="left"
                                                                        bgcolor="#ffffff"
                                                                >
                                                                    <h1
                                                                            class="h3 fw-700"
                                                                            style="
                                                                    padding-top: 0;
                                                                    padding-bottom: 0;
                                                                    font-weight: 700 !important;
                                                                    vertical-align: baseline;
                                                                    font-size: 28px;
                                                                    line-height: 34px;
                                                                    margin: 0;
                                                                  "
                                                                            align="left"
                                                                    >
                                                                        XÁC THỰC TÀI KHOẢN
                                                                    </h1>
                                                                    <table
                                                                            class="s-4 w-full"
                                                                            role="presentation"
                                                                            border="0"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            style="width: 100%"
                                                                            width="100%"
                                                                    >
                                                                        <tbody>
                                                                        <tr>
                                                                            <td
                                                                                    style="
                                                                          line-height: 16px;
                                                                          font-size: 16px;
                                                                          width: 100%;
                                                                          height: 16px;
                                                                          margin: 0;
                                                                        "
                                                                                    align="left"
                                                                                    width="100%"
                                                                                    height="16"
                                                                            >
                                                                                &#160;
                                                                            </td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>
                                                                    <p
                                                                            class=""
                                                                            style="line-height: 24px; font-size: 16px; width: 100%; margin: 0"
                                                                            align="left"
                                                                    >
                                                                        Xin chào ${seller.name}, Bạn đã yêu cầu đổi mật
                                                                        khẩu, vui lòng nhấn vào nút bên dưới để xác nhận
                                                                        đổi mật khẩu
                                                                    </p>
                                                                    <table
                                                                            class="s-4 w-full"
                                                                            role="presentation"
                                                                            border="0"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            style="width: 100%"
                                                                            width="100%"
                                                                    >
                                                                        <tbody>
                                                                        <tr>
                                                                            <td
                                                                                    style="
                                                                          line-height: 16px;
                                                                          font-size: 16px;
                                                                          width: 100%;
                                                                          height: 16px;
                                                                          margin: 0;
                                                                        "
                                                                                    align="left"
                                                                                    width="100%"
                                                                                    height="16"
                                                                            >
                                                                                &#160;
                                                                            </td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>
                                                                    <table
                                                                            class="btn btn-primary p-3 fw-700"
                                                                            role="presentation"
                                                                            border="0"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            style="
                                                                    border-radius: 6px;
                                                                    border-collapse: separate !important;
                                                                    font-weight: 700 !important;
                                                                  "
                                                                    >
                                                                        <tbody>
                                                                        <tr>
                                                                            <td
                                                                                    style="
                                                                          line-height: 24px;
                                                                          font-size: 16px;
                                                                          border-radius: 6px;
                                                                          font-weight: 700 !important;
                                                                          margin: 0;
                                                                        "
                                                                                    align="center"
                                                                                    bgcolor="#0d6efd"
                                                                            >
                                                                                <a
                                                                                        href="http://localhost:3000/reset-password/${email_token}"
                                                                                        style="
                                                                            color: #ffffff;
                                                                            font-size: 16px;
                                                                            font-family: Helvetica, Arial, sans-serif;
                                                                            text-decoration: none;
                                                                            border-radius: 6px;
                                                                            line-height: 20px;
                                                                            display: block;
                                                                            font-weight: 700 !important;
                                                                            white-space: nowrap;
                                                                            background-color: #0d6efd;
                                                                            padding: 12px;
                                                                            border: 1px solid #0d6efd;
                                                                          "
                                                                                >Xác nhận đổi mật khẩu</a
                                                                                >
                                                                            </td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <table
                                                                class="s-10 w-full"
                                                                role="presentation"
                                                                border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                style="width: 100%"
                                                                width="100%"
                                                        >
                                                            <tbody>
                                                            <tr>
                                                                <td
                                                                        style="line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0"
                                                                        align="left"
                                                                        width="100%"
                                                                        height="40"
                                                                >
                                                                    &#160;
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <table
                                                                class="s-6 w-full"
                                                                role="presentation"
                                                                border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                style="width: 100%"
                                                                width="100%"
                                                        >
                                                            <tbody>
                                                            <tr>
                                                                <td
                                                                        style="line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0"
                                                                        align="left"
                                                                        width="100%"
                                                                        height="24"
                                                                >
                                                                    &#160;
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <table
                                                                class="s-6 w-full"
                                                                role="presentation"
                                                                border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                style="width: 100%"
                                                                width="100%"
                                                        >
                                                            <tbody>
                                                            <tr>
                                                                <td
                                                                        style="line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0"
                                                                        align="left"
                                                                        width="100%"
                                                                        height="24"
                                                                >
                                                                    &#160;
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (gte mso 9)|(IE)]>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                            <![endif]-->
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </body>
                    </html>`,
                });
                response(res, httpStatusCode.Ok, {
                    message: successMessage.VERIFY_EMAIL,
                });
            }
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Reset mật khẩu
    reset_password = async (req, res) => {
        const {new_password, confirm_password, emailToken} = req.body;
        try {
            const seller = jwt.verify(emailToken, env.VERIFY_EMAIL_SECRET_KEY);
            if (seller) {
                if (new_password === confirm_password) {
                    const salt = await bcrypt.genSalt(10);
                    await sellerModel.findOneAndUpdate({email: seller.email}, {
                        password: await bcrypt.hash(new_password, salt),
                    });
                    response(res, httpStatusCode.Ok, {
                        message: successMessage.CHANGE_PASSWORD_SUCCESS,
                    });
                } else {
                    response(res, httpStatusCode.BadRequest, {
                        message: errorMessage.PASSWORD_AND_CONFIRM_PASSWORD_NOT_MATCH,
                    });
                }
            }
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };
}

module.exports = new authController();

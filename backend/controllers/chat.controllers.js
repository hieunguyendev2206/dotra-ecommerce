const sellerModel = require("../database/models/seller.models");
const customerModel = require("../database/models/customer.models");
const sellerToCustomerModel = require("../database/models/sellerToCustomer.models");
const messageSellerAndCustomer = require("../database/models/messageSellerAndCustomer");
const messageSellerAndAdmin = require("../database/models/messageSellerAndAdmin");
const response = require("../utils/response");
const httpStatusCode = require("../config/httpStatusCode");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const env = require("../config/env.config");
const path = require("path");
const {successMessage} = require("../config/message.config");

class chatController {
    // Lấy danh sách hiển thị seller và customer chat
    add_chat_friend = async (req, res) => {
        const {sellerId, customerId} = req.body;
        try {
            if (sellerId !== "") {
                // Lấy thông tin seller và customer từ database
                const seller = await sellerModel.findById(sellerId);
                const customer = await customerModel.findById(customerId);

                // Kiểm tra xem seller đã là bạn bè của customer chưa
                const checkSeller = await sellerToCustomerModel.findOne({
                    myId: customerId, myFriends: {$elemMatch: {friendId: sellerId}},
                });

                // Nếu seller chưa là bạn bè của customer, thêm seller vào danh sách bạn bè của customer
                if (!checkSeller) {
                    await sellerToCustomerModel.updateOne({myId: customerId}, {
                        $push: {
                            myFriends: {
                                friendId: sellerId, shop_name: seller.shop_info?.shop_name, avatar: seller.image,
                            },
                        },
                    });
                }

                // Kiểm tra xem customer đã là bạn bè của seller chưa
                const checkCustomer = await sellerToCustomerModel.findOne({
                    myId: sellerId, myFriends: {$elemMatch: {friendId: customerId}},
                });

                // Nếu customer chưa là bạn bè của seller, thêm customer vào danh sách bạn bè của seller
                if (!checkCustomer) {
                    await sellerToCustomerModel.updateOne({myId: sellerId}, {
                        $push: {
                            myFriends: {
                                friendId: customerId, customer_name: customer.name, avatar: customer.avatar,
                            },
                        },
                    });
                }

                // Lấy tất cả tin nhắn giữa seller và customer
                const messages = await messageSellerAndCustomer.find({
                    $or: [{receiverId: sellerId, senderId: customerId}, {receiverId: customerId, senderId: sellerId},],
                });

                // Lấy danh sách bạn bè của customer
                const my_friends = await sellerToCustomerModel.findOne({
                    myId: customerId,
                });

                // Tìm bạn bè hiện tại
                const current_friend = my_friends.myFriends.find((friend) => friend.friendId === sellerId);
                response(res, httpStatusCode.Ok, {
                    messages, current_friend, my_friends: my_friends.myFriends,
                });
            } else {
                const my_friends = await sellerToCustomerModel.findOne({
                    myId: customerId,
                });
                response(res, httpStatusCode.Ok, {
                    my_friends: my_friends.myFriends,
                });
            }
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Gửi tin nhắn từ khách hàng sang seller
    send_message = async (req, res) => {
        const form = formidable({multiples: true});
        form.parse(req, async (err, field, files) => {
            const {file} = files;
            const {customerId, customer_name, message, sellerId} = field;

            cloudinary.config({
                cloud_name: env.CLOUDINARY_CLOUD_NAME,
                api_key: env.CLOUDINARY_API_KEY,
                api_secret: env.CLOUDINARY_API_SECRET,
                secure: true,
            });

            let fileUrl = null;
            if (file) {
                try {
                    const extension = path.extname(file.originalFilename).toLowerCase();
                    let resource_type = "raw";
                    if ([".png", ".jpg", ".jpeg"].includes(extension)) {
                        resource_type = "image";
                    }

                    const result = await cloudinary.uploader.upload(file.filepath, {
                        resource_type: resource_type, folder: "dotra_chat",
                    });
                    console.log(result);
                    fileUrl = result.url;
                } catch (error) {
                    response(res, httpStatusCode.InternalServerError, {
                        message: error.message,
                    });
                    return;
                }
            }

            try {
                const messages = await messageSellerAndCustomer.create({
                    senderId: customerId,
                    senderName: customer_name,
                    receiverId: sellerId,
                    message: message,
                    file: fileUrl,
                    status: 'sent'
                });

                const data = await sellerToCustomerModel.findOne({
                    myId: customerId,
                });
                let my_friends = data.myFriends;
                let index = my_friends.findIndex((friend) => friend.friendId === sellerId);
                while (index > 0) {
                    let temp = my_friends[index];
                    my_friends[index] = my_friends[index - 1];
                    my_friends[index - 1] = temp;
                    index--;
                }
                await sellerToCustomerModel.updateOne({
                    myId: customerId,
                }, {myFriends: my_friends});

                const data1 = await sellerToCustomerModel.findOne({
                    myId: sellerId,
                });

                let my_friends1 = data1.myFriends;
                let index1 = my_friends1.findIndex((friend) => friend.friendId === customerId);
                while (index1 > 0) {
                    let temp = my_friends1[index1];
                    my_friends1[index1] = my_friends1[index1 - 1];
                    my_friends1[index1 - 1] = temp;
                    index1--;
                }
                await sellerToCustomerModel.updateOne({
                    myId: sellerId,
                }, {myFriends: my_friends1});
                response(res, httpStatusCode.Created, {
                    message: successMessage.SEND_MESSAGE_SUCCESS, messages,
                });
            } catch (error) {
                response(res, httpStatusCode.InternalServerError, {
                    message: error.message,
                });
            }
        });
    };

    // Lấy customer đang trò chuyện trả về seller
    get_customers_chat = async (req, res) => {
        const {sellerId} = req.params;
        try {
            const customer = await sellerToCustomerModel.findOne({myId: sellerId});
            response(res, httpStatusCode.Ok, {
                data: customer.myFriends,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy tin nhắn customer trả về seller
    get_customer_seller_messages = async (req, res) => {
        const {
            params: {customerId}, id,
        } = req;
        try {
            const messages = await messageSellerAndCustomer.find({
                $or: [{
                    $and: [{receiverId: {$eq: customerId}}, {senderId: {$eq: id}},],
                }, {
                    $and: [{receiverId: {$eq: id}}, {senderId: {$eq: customerId}},],
                },],
            });

            const customer = await customerModel.findById(customerId);
            response(res, httpStatusCode.Ok, {
                data: {
                    messages, customer,
                },
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Gửi tin nhắn từ seller đến customer
    send_message_seller_customer = async (req, res) => {
        const form = formidable({multiples: true});
        form.parse(req, async (err, field, files) => {
            const {sellerId, seller_name, message, customerId} = field;
            const {file} = files;

            cloudinary.config({
                cloud_name: env.CLOUDINARY_CLOUD_NAME,
                api_key: env.CLOUDINARY_API_KEY,
                api_secret: env.CLOUDINARY_API_SECRET,
                secure: true,
            });

            let fileUrl = null;
            if (file) {
                try {
                    const extension = path.extname(file.originalFilename).toLowerCase();
                    let resource_type = "raw";
                    if ([".png", ".jpg", ".jpeg"].includes(extension)) {
                        resource_type = "image";
                    }

                    const result = await cloudinary.uploader.upload(file.filepath, {
                        resource_type: resource_type, folder: "dotra_chat",
                    });
                    fileUrl = result.url;
                } catch (error) {
                    response(res, httpStatusCode.InternalServerError, {
                        message: error.message,
                    });
                    return;
                }
            }

            try {
                const messages = await messageSellerAndCustomer.create({
                    senderId: sellerId,
                    senderName: seller_name,
                    receiverId: customerId,
                    message: message,
                    file: fileUrl,
                    status: 'sent'
                });

                const data = await sellerToCustomerModel.findOne({
                    myId: sellerId,
                });

                let my_friends = data.myFriends;
                let index = my_friends.findIndex((friend) => friend.friendId === customerId);

                while (index > 0) {
                    let temp = my_friends[index];
                    my_friends[index] = my_friends[index - 1];
                    my_friends[index - 1] = temp;
                    index--;
                }

                await sellerToCustomerModel.updateOne({
                    myId: sellerId,
                }, {myFriends: my_friends});

                const data1 = await sellerToCustomerModel.findOne({
                    myId: customerId,
                });

                let my_friends1 = data1.myFriends;
                let index1 = my_friends1.findIndex((friend) => friend.friendId === sellerId);

                while (index1 > 0) {
                    let temp = my_friends1[index1];
                    my_friends1[index1] = my_friends1[index1 - 1];
                    my_friends1[index1 - 1] = temp;
                    index1--;
                }

                await sellerToCustomerModel.updateOne({
                    myId: customerId,
                }, {myFriends: my_friends1});
                response(res, httpStatusCode.Created, {
                    message: successMessage.SEND_MESSAGE_SUCCESS, messages,
                });
            } catch (error) {
                response(res, httpStatusCode.InternalServerError, {
                    message: error.message,
                });
            }
        });
    };

    // Gửi tin nhắn từ seller sang admin vaf admin sang seller
    send_message_admin_and_seller = async (req, res) => {
        const form = formidable({multiples: true});
        form.parse(req, async (err, field, files) => {
            const {file} = files;
            const {message, senderId, senderName, receiverId} = field;

            cloudinary.config({
                cloud_name: env.CLOUDINARY_CLOUD_NAME,
                api_key: env.CLOUDINARY_API_KEY,
                api_secret: env.CLOUDINARY_API_SECRET,
                secure: true,
            });

            let fileUrl = null;
            if (file) {
                try {
                    const extension = path.extname(file.originalFilename).toLowerCase();
                    let resource_type = "raw";
                    if ([".png", ".jpg", ".jpeg"].includes(extension)) {
                        resource_type = "image";
                    }

                    const result = await cloudinary.uploader.upload(file.filepath, {
                        resource_type: resource_type, folder: "dotra_chat",
                    });
                    fileUrl = result.url;
                } catch (error) {
                    response(res, httpStatusCode.InternalServerError, {
                        message: error.message,
                    });
                    return;
                }
            }
            try {
                const messages = await messageSellerAndAdmin.create({
                    senderId: senderId, senderName: senderName, receiverId: receiverId, message: message, file: fileUrl,
                });
                response(res, httpStatusCode.Created, {
                    message: successMessage.SEND_MESSAGE_SUCCESS, messages,
                });
            } catch (error) {
                response(res, httpStatusCode.InternalServerError, {
                    message: error.message,
                });
            }
        });
    };

    // Lấy tin nhắn của admin đã nhắn cho seller
    get_seller_messages = async (req, res) => {
        const receiverId = "";
        const {id} = req;
        try {
            const messages = await messageSellerAndAdmin.find({
                $or: [{
                    $and: [{receiverId: {$eq: receiverId}}, {senderId: {$eq: id}},],
                }, {
                    $and: [{receiverId: {$eq: id}}, {senderId: {$eq: receiverId}},],
                },],
            });

            response(res, httpStatusCode.Ok, {
                messages,
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy danh sách seller đang chat
    get_sellers_chat = async (req, res) => {
        try {
            const sellers = await sellerModel.find({});
            response(res, httpStatusCode.Ok, {
                data: sellers,
            });
        } catch (error) {
            response(req, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };

    // Lấy tin nhắn của seller đã nhắn cho admin
    get_admin_messages = async (req, res) => {
        const {receiverId} = req.params;
        const id = "";
        try {
            const messages = await messageSellerAndAdmin.find({
                $or: [{
                    $and: [{receiverId: {$eq: receiverId}}, {senderId: {$eq: id}},],
                }, {
                    $and: [{receiverId: {$eq: id}}, {senderId: {$eq: receiverId}},],
                },],
            });

            const seller = await sellerModel.findById(receiverId);

            response(res, httpStatusCode.Ok, {
                data: {
                    messages, seller,
                },
            });
        } catch (error) {
            response(res, httpStatusCode.InternalServerError, {
                message: error.message,
            });
        }
    };
}

module.exports = new chatController();

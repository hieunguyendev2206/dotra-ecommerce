const { Schema, model } = require("mongoose");

const sellerSchema = new Schema({
    name: {
        type: String, required: true,
    },
    email: {
        type: String, required: true, unique: true,
    },
    password: {
        type: String, required: true,
    },
    role: {
        type: String, default: "seller",
    },
    isVerified: {
        type: Boolean, default: false,
    },
    status: {
        type: String, default: "pending",
    },
    payment: {
        type: String, default: "unactive",
    },
    shop_info: {
        type: Object, default: {},
    },
    image: {
        type: String, default: "",
    },
    rating: { // Thêm rating trung bình
        type: Number, default: 0,
    },
    total_reviews: { // Thêm tổng số đánh giá
        type: Number, default: 0,
    }
}, { timestamps: true });

sellerSchema.index({ name: "text" });

module.exports = model("seller", sellerSchema);

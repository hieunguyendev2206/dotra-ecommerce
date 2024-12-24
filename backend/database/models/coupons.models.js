const {Schema, model} = require("mongoose");

const couponSchema = new Schema({
    coupons_name: {
        type: String, required: true,
    }, coupons_code: {
        type: String, required: true,
    }, coupons_price: {
        type: Number, required: true,
    }, start_day: {
        type: Date, required: true,
    }, end_date: {
        type: Date, required: true,
    }, isExpired: {
        type: Boolean, default: false,
    },
}, {timestamps: true});

couponSchema.index({
    coupons_name: "text", coupons_code: "text",
}, {
    weights: {
        coupons_name: 5, coupons_code: 1,
    },
});

module.exports = model("coupons", couponSchema);

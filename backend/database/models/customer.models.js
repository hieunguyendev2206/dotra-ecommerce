const {Schema, model} = require("mongoose");

const customerSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String},
    isVerified: {type: Boolean, default: false},
    avatar: {type: String, default: ""},
    cover: {type: String, default: ""},
    gender: {type: String, enum: ["male", "female"], default: undefined},
    dob: {type: Date, default: null},
    bio: {type: String, default: ""},
    customerInfo: {type: Object, default: {}},
    isGoogleAccount: {type: Boolean, default: false},
}, {timestamps: true});

module.exports = model("customer", customerSchema);

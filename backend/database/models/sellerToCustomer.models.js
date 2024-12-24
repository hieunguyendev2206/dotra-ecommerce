const {Schema, model} = require("mongoose");

const sellerToCustomerSchema = new Schema({
    myId: {
        type: String, required: true,
    }, myFriends: {
        type: Array, default: [],
    },
}, {timestamps: true});

module.exports = model("sellerToCustomer", sellerToCustomerSchema);

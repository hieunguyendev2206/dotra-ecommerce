const {Schema, model} = require("mongoose");

const cartSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId, required: true,
    }, 
    productId: {
        type: Schema.Types.ObjectId, required: true,
    }, 
    quantity: {
        type: Number, required: true,
    },
    color: {
        name: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true
        }
    },
    size: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = model("cart", cartSchema);

  

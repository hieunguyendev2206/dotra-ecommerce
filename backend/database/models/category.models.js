const {Schema, model} = require("mongoose");

const categorySchema = new Schema({
    category_name: {
        type: String, required: true,
    }, image: {
        type: String, required: true,
    }, slug: {
        type: String, required: true,
    },
}, {timestamps: true});

categorySchema.index({
    category_name: "text",
});

module.exports = model("category", categorySchema);

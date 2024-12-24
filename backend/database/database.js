const mongoose = require("mongoose");
const env = require("../config/env.config");

const uri = env.MONGODB_URI;
module.exports.databaseConnect = async () => {
    try {
        await mongoose.connect(uri).then((data) => {
            console.log(`Mongodb connected with server: ${data.connection.host}`);
        });
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};

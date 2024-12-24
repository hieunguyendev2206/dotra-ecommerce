const jwt = require("jsonwebtoken");
const env = require("../config/env.config");

const createToken = async (payload) => {
    return await jwt.sign(payload, env.JWT_SECRET_KEY, {
        expiresIn: "7d",
    });
};

const createVerifyToken = async (payload) => {
    return await jwt.sign(payload, env.VERIFY_EMAIL_SECRET_KEY, {
        expiresIn: "7d",
    });
};

module.exports = {createToken, createVerifyToken};

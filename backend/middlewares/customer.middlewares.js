const jwt = require("jsonwebtoken");
const env = require("../config/env.config");

const authMiddlewares_customer = (req, res, next) => {
    const access_token = req.cookies.customer_access_token;
    if (!access_token) {
        return res.status(401).json({ message: "Chưa đăng nhập hoặc token không hợp lệ." });
    }

    try {
        const decodedToken = jwt.verify(access_token, env.JWT_SECRET_KEY);
        req.id = decodedToken.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token hết hạn hoặc không hợp lệ." });
    }
};

module.exports = authMiddlewares_customer;
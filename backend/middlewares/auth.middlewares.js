const {errorMessage} = require("../config/message.config");
const HttpStatusCode = require("../config/httpStatusCode");
const jwt = require("jsonwebtoken");
const env = require("../config/env.config");

const authMiddlewares = async (req, res, next) => {
    const {access_token} = req.cookies;
    if (!access_token) {
        return res.status(HttpStatusCode.Unauthorized).json({
            message: errorMessage.UNAUTHORIZED,
        });
    } else {
        try {
            const decodedToken = await jwt.verify(access_token, env.JWT_SECRET_KEY);
            req.id = decodedToken.id;
            req.role = decodedToken.role;
            next();
        } catch (error) {
            return res.status(HttpStatusCode.Unauthorized).json({
                message: errorMessage.TOKEN_EXPIRED,
            });
        }
    }
};

module.exports = authMiddlewares;


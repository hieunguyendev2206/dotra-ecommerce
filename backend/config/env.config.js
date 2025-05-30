require("dotenv").config();

const env = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    SALT_PASSWORD: process.env.SALT_PASSWORD,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_MAIL: process.env.SMTP_MAIL,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    VERIFY_EMAIL_SECRET_KEY: process.env.VERIFY_EMAIL_SECRET_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    CLIENT_REDIRECT_CALLBACK: process.env.CLIENT_REDIRECT_CALLBACK,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    VNP_TMN_CODE: process.env.VNP_TMN_CODE,
    VNP_HASH_SECRET: process.env.VNP_HASH_SECRET,
    VNP_API_URL: process.env.VNP_API_URL,
    VNP_RETURN_URL: process.env.VNP_RETURN_URL,
    VNP_VERSION: process.env.VNP_VERSION,
    VNP_COMMAND: process.env.VNP_COMMAND,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    PAYPAL_SECRET: process.env.PAYPAL_SECRET,
    PAYPAL_API_URL: process.env.PAYPAL_API_URL,
    ZALOPAY_APP_ID: process.env.ZALOPAY_APP_ID,
    ZALOPAY_KEY1: process.env.ZALOPAY_KEY1,
    ZALO_RETURN_URL: process.env.ZALO_RETURN_URL,
    ZALOPAY_ENDPOINT: process.env.ZALOPAY_ENDPOINT,
    ZALOPAY_PARTNER_CODE: process.env.ZALOPAY_PARTNER_CODE,
    ZALOPAY_ACCESS_KEY: process.env.ZALOPAY_ACCESS_KEY,
    ZALOPAY_SECRET_KEY: process.env.ZALOPAY_SECRET_KEY,
    SERVER_URL: process.env.SERVER_URL,
    MOMO_PARTNER_CODE: process.env.MOMO_PARTNER_CODE,
    MOMO_ACCESS_KEY: process.env.MOMO_ACCESS_KEY,
    MOMO_SECRET_KEY: process.env.MOMO_SECRET_KEY,
    MOMO_ENDPOINT: process.env.MOMO_ENDPOINT,
    MOMO_RETURN_URL: process.env.MOMO_RETURN_URL,
    MOMO_NOTIFY_URL: process.env.MOMO_NOTIFY_URL



};

module.exports = env;

const env = require("../config/env.config");
const axios = require("axios");
const qs = require("qs"); // Thư viện để encode dữ liệu dạng URL

class oauthGoogle {
    getOauthGoogleToken = async (code) => {
        const body = qs.stringify({
            code: code,
            client_id: env.GOOGLE_CLIENT_ID,
            client_secret: env.GOOGLE_CLIENT_SECRET,
            redirect_uri: env.GOOGLE_REDIRECT_URI,
            grant_type: "authorization_code",
        });

        try {
            const { data } = await axios.post("https://oauth2.googleapis.com/token", body, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            return data;
        } catch (error) {
            console.error("Error getting Google OAuth token:", error.response?.data || error.message);
            throw new Error("Failed to retrieve OAuth token from Google.");
        }
    };

    getOauthGoogleUserInfo = async (access_token) => {
        try {
            const { data } = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo", {
                params: {
                    access_token: access_token,
                    alt: "json",
                },
            });
            return data;
        } catch (error) {
            console.error("Error getting Google user info:", error.response?.data || error.message);
            throw new Error("Failed to retrieve user info from Google.");
        }
    };

    loginWithGoogle = async (code) => {
        try {
            const { access_token } = await this.getOauthGoogleToken(code);
            return await this.getOauthGoogleUserInfo(access_token);
        } catch (error) {
            console.error("Error during Google login:", error.message);
            throw new Error("Google login failed.");
        }
    };
}

module.exports = new oauthGoogle();

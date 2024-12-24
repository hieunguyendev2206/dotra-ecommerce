const env = require("../config/env.config");
const axios = require("axios");

class oauthGoogle {
    getOauthGoogleToken = async (code) => {
        const body = {
            code: code,
            client_id: env.GOOGLE_CLIENT_ID,
            client_secret: env.GOOGLE_CLIENT_SECRET,
            redirect_uri: env.GOOGLE_REDIRECT_URI,
            grant_type: "authorization_code",
        };
        const {data} = await axios.post("https://oauth2.googleapis.com/token", body, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        return data;
    };

    getOauthGoogleUserInfo = async (access_token, id_token) => {
        const {data} = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo", {
            params: {
                access_token: access_token, alt: "json",
            }, headers: {
                Authorization: id_token,
            },
        });
        return data;
    };

    loginWithGoogle = async (code) => {
        const {access_token, id_token} = await this.getOauthGoogleToken(code);
        return await this.getOauthGoogleUserInfo(access_token, id_token);
    };
}

module.exports = new oauthGoogle();

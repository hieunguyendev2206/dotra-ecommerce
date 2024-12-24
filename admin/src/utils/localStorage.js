export const setAccessTokenToLS = (access_token) => {
    localStorage.setItem("access_token", access_token);
};

export const getAccessTokenFromLS = () => {
    return localStorage.getItem("access_token");
};

export const removeAccessTokenFromLS = () => {
    localStorage.removeItem("access_token");
};

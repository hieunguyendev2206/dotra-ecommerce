export const setCustomerAccessTokenToLS = (customer_access_token) => {
    localStorage.setItem("customer_access_token", customer_access_token);
};

export const getCustomerAccessTokenFromLS = () => {
    return localStorage.getItem("customer_access_token");
};

export const removeCustomerAccessTokenFromLS = () => {
    localStorage.removeItem("customer_access_token");
};

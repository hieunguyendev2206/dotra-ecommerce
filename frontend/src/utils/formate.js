export const formatDate = (timestamp) => {
    const dateObject = new Date(timestamp);
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const formateCurrency = (price) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency", currency: "VND",
    }).format(price);
};

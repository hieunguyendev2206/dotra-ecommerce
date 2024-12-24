export const formatDate = (timestamp) => {
    const dateObject = new Date(timestamp);
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();
    const hours = dateObject.getHours();
    let minutes = dateObject.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const formateCurrency = (price) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
};

export const formatDateTimeLocal = (dateString) => {
    const date = new Date(dateString);
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 16);
};

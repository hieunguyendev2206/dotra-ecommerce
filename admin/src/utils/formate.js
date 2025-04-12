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

import {addressCodeMap} from '../constants/addressData';

/**
 * Định dạng mã địa chỉ thành tên đầy đủ
 * @param {Object} address - Đối tượng chứa thông tin địa chỉ
 * @returns {string} - Chuỗi địa chỉ đầy đủ
 */
export const formatAddress = (address) => {
    if (!address) return '';
    
    let formattedAddress = address.address || '';
    
    // Xử lý ward (phường/xã)
    if (address.ward) {
        if (address.ward.name) {
            formattedAddress += `, ${address.ward.name}`;
        } else if (typeof address.ward === 'string') {
            formattedAddress += `, ${address.ward}`;
        } else if (address.ward.code) {
            // Kiểm tra trong dữ liệu địa chỉ
            if (addressCodeMap[address.ward.code]) {
                formattedAddress += `, ${addressCodeMap[address.ward.code]}`;
            } else {
                formattedAddress += `, Phường/Xã (${address.ward.code})`;
            }
        }
    }
    
    // Xử lý district (quận/huyện)
    if (address.district) {
        if (address.district.name) {
            formattedAddress += `, ${address.district.name}`;
        } else if (typeof address.district === 'string') {
            formattedAddress += `, ${address.district}`;
        } else if (address.district.code) {
            // Kiểm tra trong dữ liệu địa chỉ
            if (addressCodeMap[address.district.code]) {
                formattedAddress += `, ${addressCodeMap[address.district.code]}`;
            } else {
                formattedAddress += `, Quận/Huyện (${address.district.code})`;
            }
        }
    }
    
    // Xử lý province (tỉnh/thành phố)
    if (address.province) {
        if (address.province.name) {
            formattedAddress += `, ${address.province.name}`;
        } else if (typeof address.province === 'string') {
            formattedAddress += `, ${address.province}`;
        } else if (address.province.code) {
            // Kiểm tra trong dữ liệu địa chỉ
            if (addressCodeMap[address.province.code]) {
                formattedAddress += `, ${addressCodeMap[address.province.code]}`;
            } else {
                formattedAddress += `, Tỉnh/Thành phố (${address.province.code})`;
            }
        }
    }
    
    return formattedAddress;
};

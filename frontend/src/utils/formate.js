import {addressCodeMap} from '../constants/addressData';

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

// Dữ liệu địa chỉ phổ biến
const commonProvinces = {
    '27': 'Tỉnh Bắc Ninh',
    '79': 'Thành phố Hồ Chí Minh',
    '01': 'Thành phố Hà Nội',
    '48': 'Thành phố Đà Nẵng',
    '92': 'Thành phố Cần Thơ',
};

const commonDistricts = {
    '259': 'Thị xã Quế Võ',
    '761': 'Quận 12',
    '760': 'Quận 1',
    '762': 'Quận Tân Bình',
    '764': 'Quận Gò Vấp',
};

const commonWards = {
    '9253': 'Phường Đại Xuân',
    '26779': 'Phường An Phú Đông',
    '26767': 'Phường Tân Chánh Hiệp',
    '11104': 'Phường Xuân Khanh',
};

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
            }
            // Kiểm tra trong danh sách phổ biến (để tương thích với dữ liệu cũ)
            else if (commonWards[address.ward.code]) {
                formattedAddress += `, ${commonWards[address.ward.code]}`;
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
            }
            // Kiểm tra trong danh sách phổ biến (để tương thích với dữ liệu cũ)
            else if (commonDistricts[address.district.code]) {
                formattedAddress += `, ${commonDistricts[address.district.code]}`;
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
            }
            // Kiểm tra trong danh sách phổ biến (để tương thích với dữ liệu cũ)
            else if (commonProvinces[address.province.code]) {
                formattedAddress += `, ${commonProvinces[address.province.code]}`;
            } else {
                formattedAddress += `, Tỉnh/Thành phố (${address.province.code})`;
            }
        }
    }
    
    return formattedAddress;
};

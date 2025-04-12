import axios from 'axios';
import {addressCodeMap} from '../constants/addressData';

// Cache dữ liệu đã lấy được
const addressCache = {
    provinces: {...addressCodeMap},
    districts: {},
    wards: {}
};

/**
 * Lấy tên địa chỉ theo mã code
 * @param {string} code - Mã code
 * @returns {string} - Tên địa điểm hoặc undefined nếu không tìm thấy
 */
const getNameFromCache = (code) => {
    return addressCache.provinces[code] || 
           addressCache.districts[code] || 
           addressCache.wards[code];
};

/**
 * Cập nhật cache với dữ liệu mới
 * @param {string} code - Mã code
 * @param {string} name - Tên địa điểm
 * @param {string} type - Loại địa điểm (province, district, ward)
 */
const updateCache = (code, name, type) => {
    if (!code || !name) return;
    
    switch (type) {
        case 'province':
            addressCache.provinces[code] = name;
            break;
        case 'district':
            addressCache.districts[code] = name;
            break;
        case 'ward':
            addressCache.wards[code] = name;
            break;
        default:
            // Nếu không xác định được loại, lưu vào cả ba cache
            addressCache.provinces[code] = name;
            addressCache.districts[code] = name;
            addressCache.wards[code] = name;
    }
};

/**
 * Lấy tên địa điểm từ API hoặc cache
 * @param {string} code - Mã code
 * @param {string} apiPath - Đường dẫn API (p, d, w)
 * @param {string} type - Loại địa điểm (province, district, ward)
 * @returns {Promise<string>} - Tên địa điểm
 */
const getNameByCode = async (code, apiPath, type) => {
    if (!code) return '';
    
    // Kiểm tra trong cache trước
    const cachedName = getNameFromCache(code);
    if (cachedName) return cachedName;
    
    try {
        const response = await axios.get(`/api-provinces/api/${apiPath}/${code}`);
        if (response.data?.name) {
            const name = response.data.name;
            updateCache(code, name, type);
            return name;
        }
    } catch (error) {
        console.error(`Lỗi khi lấy thông tin ${type} với mã ${code}:`, error);
    }
    
    // Trả về định dạng mặc định nếu không lấy được
    return type === 'province' ? `Tỉnh/Thành phố (${code})` :
           type === 'district' ? `Quận/Huyện (${code})` :
           `Phường/Xã (${code})`;
};

/**
 * Lấy tên tỉnh/thành phố theo mã
 * @param {string} code - Mã tỉnh/thành phố
 * @returns {Promise<string>} - Tên tỉnh/thành phố
 */
export const getProvinceNameByCode = async (code) => {
    return getNameByCode(code, 'p', 'province');
};

/**
 * Lấy tên quận/huyện theo mã
 * @param {string} code - Mã quận/huyện
 * @returns {Promise<string>} - Tên quận/huyện
 */
export const getDistrictNameByCode = async (code) => {
    return getNameByCode(code, 'd', 'district');
};

/**
 * Lấy tên phường/xã theo mã
 * @param {string} code - Mã phường/xã
 * @returns {Promise<string>} - Tên phường/xã
 */
export const getWardNameByCode = async (code) => {
    return getNameByCode(code, 'w', 'ward');
};

/**
 * Định dạng địa chỉ đầy đủ với hỗ trợ API
 * @param {Object} address - Đối tượng chứa thông tin địa chỉ
 * @returns {Promise<string>} - Chuỗi địa chỉ đầy đủ
 */
export const formatAddressWithAPI = async (address) => {
    if (!address) return '';
    
    let formattedAddress = address.address || '';
    
    // Xử lý ward (phường/xã)
    if (address.ward) {
        if (address.ward.name) {
            formattedAddress += `, ${address.ward.name}`;
        } else if (typeof address.ward === 'string') {
            formattedAddress += `, ${address.ward}`;
        } else if (address.ward.code) {
            const wardName = await getWardNameByCode(address.ward.code);
            formattedAddress += `, ${wardName}`;
        }
    }
    
    // Xử lý district (quận/huyện)
    if (address.district) {
        if (address.district.name) {
            formattedAddress += `, ${address.district.name}`;
        } else if (typeof address.district === 'string') {
            formattedAddress += `, ${address.district}`;
        } else if (address.district.code) {
            const districtName = await getDistrictNameByCode(address.district.code);
            formattedAddress += `, ${districtName}`;
        }
    }
    
    // Xử lý province (tỉnh/thành phố)
    if (address.province) {
        if (address.province.name) {
            formattedAddress += `, ${address.province.name}`;
        } else if (typeof address.province === 'string') {
            formattedAddress += `, ${address.province}`;
        } else if (address.province.code) {
            const provinceName = await getProvinceNameByCode(address.province.code);
            formattedAddress += `, ${provinceName}`;
        }
    }
    
    return formattedAddress;
};

/**
 * Lấy danh sách tất cả các tỉnh/thành phố
 * @returns {Promise<Object>} - Danh sách tỉnh/thành phố
 */
export const getAllProvinces = async () => {
    try {
        const response = await axios.get('/api-provinces/api/p');
        if (response.data) {
            const provinces = {};
            response.data.forEach(province => {
                provinces[province.code] = province.name;
                updateCache(province.code, province.name, 'province');
            });
            return provinces;
        }
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', error);
    }
    return null;
};

/**
 * Lấy danh sách quận/huyện theo mã tỉnh/thành phố
 * @param {string} provinceCode - Mã tỉnh/thành phố
 * @returns {Promise<Object>} - Danh sách quận/huyện
 */
export const getDistrictsByProvince = async (provinceCode) => {
    try {
        const response = await axios.get(`/api-provinces/api/p/${provinceCode}?depth=2`);
        if (response.data?.districts) {
            const districts = {};
            response.data.districts.forEach(district => {
                districts[district.code] = district.name;
                updateCache(district.code, district.name, 'district');
            });
            return districts;
        }
    } catch (error) {
        console.error('Lỗi khi lấy danh sách quận/huyện:', error);
    }
    return null;
};

/**
 * Lấy danh sách phường/xã theo mã quận/huyện
 * @param {string} districtCode - Mã quận/huyện
 * @returns {Promise<Object>} - Danh sách phường/xã
 */
export const getWardsByDistrict = async (districtCode) => {
    try {
        const response = await axios.get(`/api-provinces/api/d/${districtCode}?depth=2`);
        if (response.data?.wards) {
            const wards = {};
            response.data.wards.forEach(ward => {
                wards[ward.code] = ward.name;
                updateCache(ward.code, ward.name, 'ward');
            });
            return wards;
        }
    } catch (error) {
        console.error('Lỗi khi lấy danh sách phường/xã:', error);
    }
    return null;
}; 
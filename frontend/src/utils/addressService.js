import axios from 'axios';
import {addressCodeMap} from '../constants/addressData';

// Cache dữ liệu đã lấy được
const addressCache = {
    provinces: {...addressCodeMap.provinces},
    districts: {...addressCodeMap.districts},
    wards: {...addressCodeMap.wards}
};

/**
 * Lấy tên địa chỉ theo mã code
 * @param {string} code - Mã code
 * @param {string} type - Loại địa điểm (province, district, ward)
 * @returns {string} - Tên địa điểm hoặc undefined nếu không tìm thấy
 */
const getNameFromCache = (code, type) => {
    if (type && addressCache[type] && addressCache[type][code]) {
        return addressCache[type][code];
    }
    
    // Tìm kiếm trong tất cả các loại nếu không chỉ định type
    return addressCache.provinces[code] || 
           addressCache.districts[code] || 
           addressCache.wards[code];
};

/**
 * Cập nhật cache với dữ liệu mới
 * @param {string} code - Mã code
 * @param {string} name - Tên địa điểm
 * @param {string} type - Loại địa điểm (provinces, districts, wards)
 */
const updateCache = (code, name, type) => {
    if (!code || !name || !type || !addressCache[type]) return;
    addressCache[type][code] = name;
};

/**
 * Lấy tên địa điểm từ API hoặc cache
 * @param {string} code - Mã code
 * @param {string} apiPath - Đường dẫn API (p, d, w)
 * @param {string} type - Loại địa điểm (provinces, districts, wards)
 * @returns {Promise<string>} - Tên địa điểm
 */
const getNameByCode = async (code, apiPath, type) => {
    if (!code) return '';
    
    // Kiểm tra trong cache trước
    const cachedName = getNameFromCache(code, type);
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
    return type === 'provinces' ? `Tỉnh/Thành phố (${code})` :
           type === 'districts' ? `Quận/Huyện (${code})` :
           `Phường/Xã (${code})`;
};

/**
 * Lấy tên tỉnh/thành phố theo mã
 * @param {string} code - Mã tỉnh/thành phố
 * @returns {Promise<string>} - Tên tỉnh/thành phố
 */
export const getProvinceNameByCode = async (code) => {
    return getNameByCode(code, 'p', 'provinces');
};

/**
 * Lấy tên quận/huyện theo mã
 * @param {string} code - Mã quận/huyện
 * @returns {Promise<string>} - Tên quận/huyện
 */
export const getDistrictNameByCode = async (code) => {
    return getNameByCode(code, 'd', 'districts');
};

/**
 * Lấy tên phường/xã theo mã
 * @param {string} code - Mã phường/xã
 * @returns {Promise<string>} - Tên phường/xã
 */
export const getWardNameByCode = async (code) => {
    return getNameByCode(code, 'w', 'wards');
};

/**
 * Định dạng địa chỉ đầy đủ sử dụng cache mà không cần API
 * @param {Object} addressObj - Đối tượng chứa thông tin địa chỉ
 * @returns {string} - Chuỗi địa chỉ đầy đủ
 */
export const formatAddress = (addressObj) => {
    if (!addressObj) return '';
    
    const parts = [];
    
    // Thêm địa chỉ chi tiết (số nhà, đường, etc.)
    if (addressObj.address || addressObj.street) {
        parts.push(addressObj.address || addressObj.street);
    }
    
    // Thêm phường/xã
    if (addressObj.ward) {
        if (addressObj.ward.name) {
            parts.push(addressObj.ward.name);
        } else if (addressObj.ward.code) {
            const wardName = getNameFromCache(addressObj.ward.code, 'wards');
            if (wardName) {
                parts.push(wardName);
            } else {
                parts.push(`Phường/Xã (${addressObj.ward.code})`);
            }
        }
    }
    
    // Thêm quận/huyện
    if (addressObj.district) {
        if (addressObj.district.name) {
            parts.push(addressObj.district.name);
        } else if (addressObj.district.code) {
            const districtName = getNameFromCache(addressObj.district.code, 'districts');
            if (districtName) {
                parts.push(districtName);
            } else {
                parts.push(`Quận/Huyện (${addressObj.district.code})`);
            }
        }
    }
    
    // Thêm tỉnh/thành phố
    if (addressObj.province) {
        if (addressObj.province.name) {
            parts.push(addressObj.province.name);
        } else if (addressObj.province.code) {
            const provinceName = getNameFromCache(addressObj.province.code, 'provinces');
            if (provinceName) {
                parts.push(provinceName);
            } else {
                parts.push(`Tỉnh/Thành phố (${addressObj.province.code})`);
            }
        }
    }
    
    if (parts.length === 0) {
        return 'Không có thông tin địa chỉ';
    }
    
    return parts.join(', ');
};

/**
 * Định dạng địa chỉ đầy đủ với hỗ trợ API
 * @param {Object} addressObj - Đối tượng chứa thông tin địa chỉ
 * @returns {Promise<string>} - Chuỗi địa chỉ đầy đủ
 */
export const formatAddressWithAPI = async (addressObj) => {
    if (!addressObj) return '';
    
    try {
        // Lấy tên tỉnh/thành phố
        let provinceName = '';
        if (addressObj.province?.name) {
            provinceName = addressObj.province.name;
        } else if (addressObj.province?.code) {
            provinceName = await getProvinceNameByCode(addressObj.province.code);
        }
        
        // Lấy tên quận/huyện
        let districtName = '';
        if (addressObj.district?.name) {
            districtName = addressObj.district.name;
        } else if (addressObj.district?.code) {
            districtName = await getDistrictNameByCode(addressObj.district.code);
        }
        
        // Lấy tên phường/xã
        let wardName = '';
        if (addressObj.ward?.name) {
            wardName = addressObj.ward.name;
        } else if (addressObj.ward?.code) {
            wardName = await getWardNameByCode(addressObj.ward.code);
        }
        
        // Ghép các phần thành địa chỉ đầy đủ
        const parts = [];
        
        if (addressObj.address || addressObj.street) {
            parts.push(addressObj.address || addressObj.street);
        }
        
        if (wardName) {
            parts.push(wardName);
        }
        
        if (districtName) {
            parts.push(districtName);
        }
        
        if (provinceName) {
            parts.push(provinceName);
        }
        
        if (parts.length === 0) {
            return formatAddress(addressObj);
        }
        
        return parts.join(', ');
    } catch (error) {
        console.error('Lỗi khi định dạng địa chỉ:', error);
        // Fallback về phương pháp không sử dụng API
        return formatAddress(addressObj);
    }
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
                updateCache(province.code, province.name, 'provinces');
            });
            return provinces;
        }
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', error);
        return addressCache.provinces;
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
        if (response.data && response.data.districts) {
            const districts = {};
            response.data.districts.forEach(district => {
                districts[district.code] = district.name;
                updateCache(district.code, district.name, 'districts');
            });
            return districts;
        }
    } catch (error) {
        console.error(`Lỗi khi lấy danh sách quận/huyện cho tỉnh/thành phố ${provinceCode}:`, error);
        // Lọc các quận/huyện thuộc tỉnh/thành phố từ cache
        const provinceDistricts = {};
        Object.keys(addressCache.districts).forEach(code => {
            if (code.startsWith(provinceCode.substring(0, 1))) {
                provinceDistricts[code] = addressCache.districts[code];
            }
        });
        return provinceDistricts;
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
        if (response.data && response.data.wards) {
            const wards = {};
            response.data.wards.forEach(ward => {
                wards[ward.code] = ward.name;
                updateCache(ward.code, ward.name, 'wards');
            });
            return wards;
        }
    } catch (error) {
        console.error(`Lỗi khi lấy danh sách phường/xã cho quận/huyện ${districtCode}:`, error);
        // Lọc các phường/xã thuộc quận/huyện từ cache
        const districtWards = {};
        Object.keys(addressCache.wards).forEach(code => {
            if (code.startsWith(districtCode.substring(0, 3))) {
                districtWards[code] = addressCache.wards[code];
            }
        });
        return districtWards;
    }
    return null;
}; 
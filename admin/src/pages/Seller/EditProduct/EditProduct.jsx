import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_product, update_product, update_product_image } from '../../../store/reducers/product.reducers';
import { get_categories } from '../../../store/reducers/category.reducers';
import { Button, Select } from 'flowbite-react';
import { FiUploadCloud } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import TextEditor from '../../../components/TextEditor';

const EditProduct = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { product, loading } = useSelector((state) => state.product);
    const { categories } = useSelector((state) => state.category);
    
    const [productData, setProductData] = useState({
        product_name: '',
        brand_name: '',
        category_name: '',
        price: '',
        discount: '',
        quantity: '',
        description: '',
        colors: [],
        sizes: []
    });
    
    const [images, setImages] = useState([]);
    const [imageShow, setImageShow] = useState([]);
    const [newColor, setNewColor] = useState({ name: '', code: '' });
    const [newSize, setNewSize] = useState('');

    useEffect(() => {
        dispatch(get_product(productId));
        dispatch(get_categories({ searchValue: '', parPage: '', page: '' }));
    }, [dispatch, productId]);

    useEffect(() => {
        if (product?._id) {
            setProductData({
                product_name: product.product_name,
                brand_name: product.brand_name,
                category_name: product.category_name,
                price: product.price,
                discount: product.discount,
                quantity: product.quantity,
                description: product.description,
                colors: product.colors || [],
                sizes: product.sizes || []
            });
            setImageShow(product.images.map(img => ({ url: img })));
        }
    }, [product]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({
            ...prev,
            [name]: name === 'quantity' ? Math.max(1, Number(value))
                  : name === 'price' || name === 'discount' ? Math.max(0, Number(value))
                  : value
        }));
    };

    const handleDescriptionChange = (event, editor) => {
        const data = editor.getData();
        setProductData(prev => ({
            ...prev,
            description: data
        }));
    };

    const handleImageChange = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            const newImages = Array.from(files);
            const newImageUrls = newImages.map(file => ({
                url: URL.createObjectURL(file)
            }));
            
            setImages(prev => [...prev, ...newImages]);
            setImageShow(prev => [...prev, ...newImageUrls]);
        }
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImageShow(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddColor = () => {
        if (newColor.name && newColor.code) {
            setProductData(prev => ({
                ...prev,
                colors: [...prev.colors, newColor]
            }));
            setNewColor({ name: '', code: '' });
        }
    };

    const handleRemoveColor = (index) => {
        setProductData(prev => ({
            ...prev,
            colors: prev.colors.filter((_, i) => i !== index)
        }));
    };

    const handleAddSize = () => {
        if (newSize) {
            setProductData(prev => ({
                ...prev,
                sizes: [...prev.sizes, newSize]
            }));
            setNewSize('');
        }
    };

    const handleRemoveSize = (index) => {
        setProductData(prev => ({
            ...prev,
            sizes: prev.sizes.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!productData.product_name || !productData.brand_name || !productData.category_name) {
            toast.error('Vui lòng điền đầy đủ thông tin sản phẩm');
            return;
        }

        // Update product info
        await dispatch(update_product({
            productId,
            ...productData
        }));

        // Update images if any new images
        if (images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                const formData = new FormData();
                formData.append('productId', productId);
                formData.append('image', images[i]);
                await dispatch(update_product_image(formData));
            }
        }

        navigate('/seller/products');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Chỉnh sửa sản phẩm</h1>
                    <Button color="gray" onClick={() => navigate('/seller/products')}>
                        Quay lại
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Thông tin cơ bản */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên sản phẩm
                                </label>
                                <input
                                    type="text"
                                    name="product_name"
                                    value={productData.product_name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Thương hiệu
                                </label>
                                <input
                                    type="text"
                                    name="brand_name"
                                    value={productData.brand_name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Danh mục
                                </label>
                                <Select
                                    value={productData.category_name}
                                    onChange={(e) => handleInputChange({
                                        target: { name: 'category_name', value: e.target.value }
                                    })}
                                >
                                    <option value="">Chọn danh mục</option>
                                    {categories.map((c) => (
                                        <option key={c._id} value={c.category_name}>
                                            {c.category_name}
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Số lượng
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        min="1"
                                        value={productData.quantity}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Giá (VNĐ)
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        min="0"
                                        value={productData.price}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Giảm giá (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="discount"
                                        min="0"
                                        max="100"
                                        value={productData.discount}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Màu sắc và kích thước */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Màu sắc
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Tên màu"
                                        value={newColor.name}
                                        onChange={(e) => setNewColor({...newColor, name: e.target.value})}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="color"
                                        value={newColor.code}
                                        onChange={(e) => setNewColor({...newColor, code: e.target.value})}
                                        className="w-14 h-10 p-1 border border-gray-300 rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddColor}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                        Thêm
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {productData.colors.map((color, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                                        >
                                            <span
                                                className="w-4 h-4 rounded-full border"
                                                style={{ backgroundColor: color.code }}
                                            />
                                            <span>{color.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveColor(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <IoClose />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kích thước
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Nhập kích thước"
                                        value={newSize}
                                        onChange={(e) => setNewSize(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddSize}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                        Thêm
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {productData.sizes.map((size, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                                        >
                                            <span>{size}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSize(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <IoClose />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Hình ảnh sản phẩm */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Hình ảnh sản phẩm
                                </label>
                                <div className="grid grid-cols-4 gap-3">
                                    {imageShow.map((img, i) => (
                                        <div key={i} className="relative group">
                                            <img
                                                className="w-full h-24 object-cover rounded-lg"
                                                src={img.url}
                                                alt=""
                                            />
                                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(i)}
                                                    className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                >
                                                    <IoClose />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <label className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500">
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleImageChange}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        <FiUploadCloud className="text-3xl text-gray-400" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mô tả sản phẩm */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả sản phẩm
                        </label>
                        <TextEditor
                            onChange={handleDescriptionChange}
                            value={productData.description}
                        />
                    </div>

                    {/* Nút submit */}
                    <div className="flex justify-end gap-3">
                        <Button
                            type="submit"
                            color="blue"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <ClipLoader size={20} color="white" />
                                    <span>Đang cập nhật...</span>
                                </div>
                            ) : (
                                "Cập nhật sản phẩm"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;

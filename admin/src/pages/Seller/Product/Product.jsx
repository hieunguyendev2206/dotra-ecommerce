/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import Panigation from "../../../components/Panigation";
import { Button, Modal, Select, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import icons from "../../../assets/icons";
import { useDispatch, useSelector } from "react-redux";
import { get_categories } from "../../../store/reducers/category.reducers";
import Search from "../../../components/Search";
import {
    add_product,
    delete_product,
    get_product,
    get_products,
    message_clear,
    update_product,
    update_product_image,
} from "../../../store/reducers/product.reducers";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import TextEditor from "../../../components/TextEditor";
import { FaTrash } from "react-icons/fa";

const Product = () => {
    const {
        AiOutlineEye,
        FiUploadCloud,
        BsTrash,
        FaEdit,
        IoClose,
        HiOutlineExclamationCircle,
    } = icons;
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [parPage, setParPage] = useState(10);
    const [searchValue, setSearchValue] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);
    const [canCloseModal, setCanCloseModal] = useState(false);
    const [productId, setProductId] = useState("");
    const [productIdDelete, setProductIdDelete] = useState("");
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.category);
    const {
        loading,
        success_message,
        error_message,
        products,
        totalProduct,
        product,
    } = useSelector((state) => state.product);
    const { user_info } = useSelector((state) => state.auth);
    const [stateProduct, setStateProduct] = useState({
        product_name: "",
        brand_name: "",
        quantity: "",
        price: "",
        discount: "",
        description: "",
        colors: [],
        sizes: []
    });

    const [stateUpdateProduct, setStateUpdateProduct] = useState({});

    const [newColor, setNewColor] = useState({ name: "", code: "" });
    const [newSize, setNewSize] = useState("");

    const [newUpdateColor, setNewUpdateColor] = useState({ name: "", code: "" });
    const [newUpdateSize, setNewUpdateSize] = useState("");

    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        dispatch(
            get_categories({
                searchValue: "",
                parPage: "",
                page: "",
            })
        );
    }, [dispatch]);

    const [category, setCategory] = useState("");
    const [allCategory, setAllCategory] = useState([]);

    useEffect(() => {
        setAllCategory(categories);
    }, [categories]);

    const handleInputProduct = (event) => {
        const { name, value } = event.target;
        setStateProduct({
            ...stateProduct,
            [name]: name === "quantity"
                ? Math.max(1, Number(value))
                : name === "price" || name === "discount"
                    ? Math.max(0, Number(value))
                    : value,
        });
    };

    const handleInputTextEditor = (event, editor) => {
        const data = editor.getData();
        setStateProduct({
            ...stateProduct,
            description: data,
        });
    };

    const handleUpdateInputProduct = (event) => {
        const { name, value } = event.target;
        setStateUpdateProduct({
            ...stateUpdateProduct,
            [name]: name === "quantity"
                ? Math.max(1, Number(value))
                : name === "price" || name === "discount"
                    ? Math.max(0, Number(value))
                    : value,
        });
    };

    const handleInputUpdateTextEditor = (event, editor) => {
        const data = editor.getData();
        setStateUpdateProduct({
            ...stateUpdateProduct,
            description: data,
        });
    };

    const [images, setImages] = useState([]);
    const [imageShow, setImageShow] = useState([]);

    const handleImage = (e) => {
        const files = e.target.files;
        const length = files.length;

        if (length > 0) {
            setImages([...images, ...files]);
            let imageUrl = [];

            for (let i = 0; i < length; i++) {
                imageUrl.push({ url: URL.createObjectURL(files[i]) });
            }
            setImageShow([...imageShow, ...imageUrl]);
        }
    };

    const changeImage = (img, index) => {
        if (img) {
            let tempUrl = imageShow;
            let tempImages = images;

            tempImages[index] = img;
            tempUrl[index] = { url: URL.createObjectURL(img) };
            setImageShow([...tempUrl]);
            setImages([...tempImages]);
        }
    };

    const removeImage = (i) => {
        const filterImage = images.filter((img, index) => index !== i);
        const filterImageUrl = imageShow.filter((img, index) => index !== i);
        setImages(filterImage);
        setImageShow(filterImageUrl);
    };

    const handleAddColor = () => {
        if (newColor.name && newColor.code) {
            setStateProduct(prev => ({
                ...prev,
                colors: [...prev.colors, newColor]
            }));
            setNewColor({ name: "", code: "" });
        }
    };

    const handleRemoveColor = (index) => {
        setStateProduct(prev => ({
            ...prev,
            colors: prev.colors.filter((_, i) => i !== index)
        }));
    };

    const handleAddSize = () => {
        if (newSize) {
            setStateProduct(prev => ({
                ...prev,
                sizes: [...prev.sizes, newSize]
            }));
            setNewSize("");
        }
    };

    const handleRemoveSize = (index) => {
        setStateProduct(prev => ({
            ...prev,
            sizes: prev.sizes.filter((_, i) => i !== index)
        }));
    };

    const handleAddUpdateColor = () => {
        if (newUpdateColor.name && newUpdateColor.code) {
            setStateUpdateProduct(prev => ({
                ...prev,
                colors: [...(prev.colors || []), newUpdateColor]
            }));
            setNewUpdateColor({ name: "", code: "" });
        }
    };

    const handleRemoveUpdateColor = (index) => {
        setStateUpdateProduct(prev => ({
            ...prev,
            colors: prev.colors.filter((_, i) => i !== index)
        }));
    };

    const handleAddUpdateSize = () => {
        if (newUpdateSize) {
            setStateUpdateProduct(prev => ({
                ...prev,
                sizes: [...(prev.sizes || []), newUpdateSize]
            }));
            setNewUpdateSize("");
        }
    };

    const handleRemoveUpdateSize = (index) => {
        setStateUpdateProduct(prev => ({
            ...prev,
            sizes: prev.sizes.filter((_, i) => i !== index)
        }));
    };

    const validateProductData = () => {
        // Validate tên sản phẩm
        if (!stateProduct.product_name.trim()) {
            toast.error("Tên sản phẩm không được để trống");
            return false;
        }
        if (stateProduct.product_name.length < 10 || stateProduct.product_name.length > 200) {
            toast.error("Tên sản phẩm phải từ 10-200 ký tự");
            return false; 
        }

        // Validate thương hiệu
        if (!stateProduct.brand_name.trim()) {
            toast.error("Thương hiệu không được để trống");
            return false;
        }
        if (stateProduct.brand_name.length < 2 || stateProduct.brand_name.length > 50) {
            toast.error("Tên thương hiệu phải từ 2-50 ký tự");
            return false;
        }

        // Validate danh mục
        if (!category) {
            toast.error("Vui lòng chọn danh mục sản phẩm");
            return false;
        }

        // Validate giá
        if (!stateProduct.price || stateProduct.price <= 0) {
            toast.error("Giá sản phẩm phải lớn hơn 0");
            return false;
        }
        if (stateProduct.price > 1000000000) {
            toast.error("Giá sản phẩm không được vượt quá 1 tỷ VNĐ");
            return false;
        }

        // Validate số lượng
        if (!stateProduct.quantity || stateProduct.quantity < 1) {
            toast.error("Số lượng sản phẩm phải tối thiểu là 1");
            return false;
        }
        if (stateProduct.quantity > 10000) {
            toast.error("Số lượng sản phẩm không được vượt quá 10.000");
            return false;
        }

        // Validate giảm giá
        if (stateProduct.discount < 0 || stateProduct.discount > 100) {
            toast.error("Giảm giá phải trong khoảng từ 0% đến 100%");
            return false;
        }

        // Validate mô tả
        if (!stateProduct.description.trim()) {
            toast.error("Mô tả không được để trống");
            return false;
        }
        if (stateProduct.description.length < 50) {
            toast.error("Mô tả sản phẩm phải có ít nhất 50 ký tự");
            return false;
        }

        // Validate hình ảnh
        if (images.length === 0) {
            toast.error("Vui lòng thêm ít nhất 1 ảnh sản phẩm");
            return false;
        }
        if (images.length > 30) {
            toast.error("Không được thêm quá 30 ảnh cho một sản phẩm");
            return false;
        }
        
        // Validate kích thước file ảnh
        const maxSize = 5 * 1024 * 1024; // 5MB
        for (let i = 0; i < images.length; i++) {
            if (images[i].size > maxSize) {
                toast.error(`Ảnh ${images[i].name} vượt quá kích thước cho phép (5MB)`);
                return false;
            }
        }

        // Validate màu sắc
        if (stateProduct.colors.length === 0) {
            toast.error("Vui lòng thêm ít nhất một màu sắc");
            return false;
        }
        if (stateProduct.colors.length > 10) {
            toast.error("Không được thêm quá 10 màu sắc");
            return false;
        }

        // Validate kích thước
        if (stateProduct.sizes.length === 0) {
            toast.error("Vui lòng thêm ít nhất một kích thước");
            return false;
        }
        if (stateProduct.sizes.length > 10) {
            toast.error("Không được thêm quá 10 kích thước");
            return false;
        }

        return true;
    };

    const handleAddProduct = async (event) => {
        if (event) event.preventDefault();

        if (!validateProductData()) return;

        const formData = new FormData();
        formData.append("product_name", stateProduct.product_name);
        formData.append("brand_name", stateProduct.brand_name);
        formData.append("category_name", category);
        formData.append("price", stateProduct.price);
        formData.append("quantity", Math.max(1, stateProduct.quantity));
        formData.append("discount", Math.max(0, stateProduct.discount));
        formData.append("description", stateProduct.description);
        formData.append("shop_name", user_info.shop_info.shop_name);
        formData.append("colors", JSON.stringify(stateProduct.colors));
        formData.append("sizes", JSON.stringify(stateProduct.sizes));

        for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]);
        }

        try {
            await dispatch(add_product(formData)).unwrap();
            navigate(0);
        } catch (error) {
            toast.error("Có lỗi xảy ra khi thêm sản phẩm.");
        }
    };

    useEffect(() => {
        if (success_message) {
            toast.success(success_message);
            setStateProduct({
                product_name: "",
                brand_name: "",
                quantity: "",
                price: "",
                discount: "",
                description: "",
                colors: [],
                sizes: []
            });
            setImages([]);
            setImageShow([]);
            setCategory("");
            setOpenModal(false);
            setOpenUpdateModal(false);
            setProductId("");
            setProductIdDelete("");

            // Lấy lại danh sách sản phẩm
            dispatch(get_products({ page: currentPageNumber, parPage, searchValue }));
            dispatch(message_clear());
        }

        if (error_message) {
            toast.error(error_message);
            dispatch(message_clear());
        }
    }, [success_message, error_message, dispatch, currentPageNumber, parPage, searchValue]);

    useEffect(() => {
        dispatch(get_products({ page: currentPageNumber, parPage, searchValue }));
    }, [success_message, currentPageNumber, parPage, searchValue, dispatch]);

    useEffect(() => {
        if (product && productId === product._id) {
            setStateUpdateProduct({
                product_name: product.product_name,
                brand_name: product.brand_name,
                quantity: product.quantity,
                price: product.price,
                discount: product.discount,
                description: product.description,
                colors: product.colors || [],
                sizes: product.sizes || []
            });
            setCategory(product.category_name);
            setImageShow(
                product.images?.map((img) => ({
                    url: img,
                })) || []
            );
        }
    }, [product, productId]);

    // Thêm useEffect mới để reset form khi đóng modal
    useEffect(() => {
        if (!openUpdateModal) {
            resetUpdateForm();
        }
    }, [openUpdateModal]);

    const changeUpdateImage = (image, files) => {
        if (files.length > 0) {
            dispatch(
                update_product_image({
                    old_image: image.url,
                    new_image: files[0],
                    productId: productId,
                })
            );
        }
    };

    const navigate = useNavigate();

    const handleUpdateProduct = async (event) => {
        event.preventDefault();

        if (!validateUpdateProductData()) return;

        const data = {
            product_name: stateUpdateProduct.product_name,
            brand_name: stateUpdateProduct.brand_name,
            price: stateUpdateProduct.price,
            quantity: Math.max(1, stateUpdateProduct.quantity),
            discount: Math.max(0, stateUpdateProduct.discount),
            description: stateUpdateProduct.description,
            colors: stateUpdateProduct.colors || [],
            sizes: stateUpdateProduct.sizes || [],
            productId: productId,
        };

        try {
            await dispatch(update_product(data)).unwrap();
            setOpenUpdateModal(false);
            navigate(0);
        } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật sản phẩm");
        }
    };

    const validateUpdateProductData = () => {
        // Validate tên sản phẩm
        if (!stateUpdateProduct.product_name.trim()) {
            toast.error("Tên sản phẩm không được để trống");
            return false;
        }
        if (stateUpdateProduct.product_name.length < 10 || stateUpdateProduct.product_name.length > 200) {
            toast.error("Tên sản phẩm phải từ 10-200 ký tự");
            return false;
        }

        // Validate thương hiệu
        if (!stateUpdateProduct.brand_name.trim()) {
            toast.error("Thương hiệu không được để trống");
            return false;
        }
        if (stateUpdateProduct.brand_name.length < 2 || stateUpdateProduct.brand_name.length > 50) {
            toast.error("Tên thương hiệu phải từ 2-50 ký tự");
            return false;
        }

        // Validate danh mục
        if (!category) {
            toast.error("Vui lòng chọn danh mục sản phẩm");
            return false;
        }

        // Validate giá
        if (!stateUpdateProduct.price || stateUpdateProduct.price <= 0) {
            toast.error("Giá sản phẩm phải lớn hơn 0");
            return false;
        }
        if (stateUpdateProduct.price > 1000000000) {
            toast.error("Giá sản phẩm không được vượt quá 1 tỷ VNĐ");
            return false;
        }

        // Validate số lượng
        if (!stateUpdateProduct.quantity || stateUpdateProduct.quantity < 1) {
            toast.error("Số lượng sản phẩm phải tối thiểu là 1");
            return false;
        }
        if (stateUpdateProduct.quantity > 10000) {
            toast.error("Số lượng sản phẩm không được vượt quá 10.000");
            return false;
        }

        // Validate giảm giá
        if (stateUpdateProduct.discount < 0 || stateUpdateProduct.discount > 100) {
            toast.error("Giảm giá phải trong khoảng từ 0% đến 100%");
            return false;
        }

        // Validate mô tả
        if (!stateUpdateProduct.description.trim()) {
            toast.error("Mô tả không được để trống");
            return false;
        }
        if (stateUpdateProduct.description.length < 50) {
            toast.error("Mô tả sản phẩm phải có ít nhất 50 ký tự");
            return false;
        }

        // Validate hình ảnh
        if (imageShow.length === 0) {
            toast.error("Vui lòng thêm ít nhất 1 ảnh sản phẩm");
            return false;
        }
        if (imageShow.length > 30) {
            toast.error("Không được thêm quá 30 ảnh cho một sản phẩm");
            return false;
        }

        // Validate màu sắc
        if (!stateUpdateProduct.colors || stateUpdateProduct.colors.length === 0) {
            toast.error("Vui lòng thêm ít nhất một màu sắc");
            return false;
        }
        if (stateUpdateProduct.colors.length > 10) {
            toast.error("Không được thêm quá 10 màu sắc");
            return false;
        }

        // Validate kích thước
        if (!stateUpdateProduct.sizes || stateUpdateProduct.sizes.length === 0) {
            toast.error("Vui lòng thêm ít nhất một kích thước");
            return false;
        }
        if (stateUpdateProduct.sizes.length > 10) {
            toast.error("Không được thêm quá 10 kích thước");
            return false;
        }

        return true;
    };

    const resetUpdateForm = () => {
        setStateUpdateProduct({
            product_name: "",
            brand_name: "",
            quantity: 1,
            price: 0,
            discount: 0,
            description: "",
            colors: [],
            sizes: []
        });
        setNewUpdateColor({ name: "", code: "" });
        setNewUpdateSize("");
        setImageShow([]);
        setCategory("");
        setProductId("");
        dispatch({ type: "product/reset_product" });
    };

    const handleCloseUpdateModal = () => {
        resetUpdateForm();
        setOpenUpdateModal(false);
    };

    return (
        <div className="px-2 md:px-7 py-5 bg-[#dae1e7]">
            <h1 className="text-xl font-bold uppercase my-3">Danh sách sản phẩm</h1>
            <div className="bg-white p-4 flex justify-center items-center rounded-t-md">
                <div className="flex justify-between items-center w-full">
                    <Search
                        setParPage={setParPage}
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                    />
                    <Button
                        className="flex flex-shink font-medium grid-cols-4 grid-cols-3 grid-col-2 grid-col-1 ml-4 mt-4"
                        color="success"
                        size="md"
                        onClick={() => {
                            setOpenModal(true);
                            setImageShow([]);
                            setCategory("");
                        }}
                    >
                        Thêm sản phẩm
                    </Button>
                </div>
                <Modal
                    size="5xl"
                    dismissible
                    show={openModal}
                    onClose={() => setOpenModal(false)}
                >
                    <Modal.Header>Thêm sản phẩm</Modal.Header>
                    <Modal.Body>
                        <div className="space-y-6">
                            <div className="flex justify-start items-center">
                                <label htmlFor="product_name" className="w-[20%] font-semibold">
                                    Tên sản phẩm:
                                </label>
                                <input
                                    onChange={handleInputProduct}
                                    value={stateProduct.product_name}
                                    type="text"
                                    name="product_name"
                                    placeholder="Nhập tên sản phẩm..."
                                    className="input !bg-white input-bordered w-[80%]"
                                />
                            </div>
                            <div className="flex justify-start items-center mt-6">
                                <label htmlFor="brand_name" className="w-[20%] font-semibold">
                                    Tên thương hiệu:
                                </label>
                                <input
                                    onChange={handleInputProduct}
                                    value={stateProduct.brand_name}
                                    type="text"
                                    name="brand_name"
                                    placeholder="Nhập tên thương hiệu..."
                                    className="input !bg-white input-bordered w-[80%]"
                                />
                            </div>
                            <div className="flex justify-start items-center mt-6">
                                <label
                                    htmlFor="category_name"
                                    className="w-[20%] font-semibold"
                                >
                                    Danh mục sản phẩm:
                                </label>
                                <div className="flex flex-col gap-1 relative w-[80%]">
                                    <Select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>
                                            - - - - - Chọn danh mục - - - - -
                                        </option>
                                        {allCategory.map((c, index) => (
                                            <option key={index} value={c.category_name}>
                                                {c.category_name}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <div className="flex justify-start items-center mt-6">
                                <label htmlFor="price" className="w-[20%] font-semibold">
                                    Giá sản phẩm:
                                </label>
                                <input
                                    onChange={handleInputProduct}
                                    value={stateProduct.price}
                                    type="number"
                                    name="price"
                                    min={0}
                                    placeholder="Nhập giá sản phẩm..."
                                    className="input !bg-white input-bordered w-[80%]"
                                />
                            </div>
                            <div className="flex justify-start items-center mt-6">
                                <label htmlFor="quantity" className="w-[20%] font-semibold">
                                    Số lượng:
                                </label>
                                <input
                                    onChange={handleInputProduct}
                                    value={stateProduct.quantity}
                                    type="number"
                                    name="quantity"
                                    min={1}
                                    placeholder="Nhập số lượng sản phẩm..."
                                    className="input !bg-white input-bordered w-[80%]"
                                />
                            </div>
                            <div className="flex justify-start items-center mt-6">
                                <label htmlFor="discount" className="w-[20%] font-semibold">
                                    Giảm giá:
                                </label>
                                <input
                                    onChange={handleInputProduct}
                                    value={stateProduct.discount}
                                    type="number"
                                    name="discount"
                                    min={0}
                                    max={100}
                                    placeholder="Nhập % giảm giá..."
                                    className="input !bg-white input-bordered w-[80%]"
                                />
                            </div>
                            <div className="flex justify-start mt-6">
                                <label htmlFor="description" className="w-[20%] font-semibold">
                                    Mô tả sản phẩm:
                                </label>
                                <div className="w-[80%]">
                                    <TextEditor
                                        onChange={handleInputTextEditor}
                                        value={stateProduct.description}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-3">
                                    <label className="text-lg font-semibold">Màu sắc sản phẩm</label>
                                    <div className="flex gap-4 items-end">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="Tên màu"
                                                value={newColor.name}
                                                onChange={(e) => setNewColor({...newColor, name: e.target.value})}
                                                className="input-bordered w-full"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="color"
                                                value={newColor.code}
                                                onChange={(e) => setNewColor({...newColor, code: e.target.value})}
                                                className="w-full h-[42px] cursor-pointer"
                                            />
                                        </div>
                                        <button
                                            onClick={handleAddColor}
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Thêm màu
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {stateProduct.colors.map((color, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 bg-gray-100 p-2 rounded"
                                            >
                                                <div
                                                    className="w-6 h-6 rounded-full"
                                                    style={{ backgroundColor: color.code }}
                                                />
                                                <span>{color.name}</span>
                                                <button
                                                    onClick={() => handleRemoveColor(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label className="text-lg font-semibold">Kích thước sản phẩm</label>
                                    <div className="flex gap-4 items-end">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="Nhập kích thước"
                                                value={newSize}
                                                onChange={(e) => setNewSize(e.target.value)}
                                                className="input-bordered w-full"
                                            />
                                        </div>
                                        <button
                                            onClick={handleAddSize}
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Thêm kích thước
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {stateProduct.sizes.map((size, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 bg-gray-100 p-2 rounded"
                                            >
                                                <span>{size}</span>
                                                <button
                                                    onClick={() => handleRemoveSize(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-start mt-6">
                                <h2 className="w-[20%] font-semibold">Ảnh sản phẩm:</h2>
                                <label
                                    htmlFor="image"
                                    className="mt-3 rounded-md flex justify-center items-center flex-col h-[150px] cursor-pointer border-2 border-black border-dashed hover:border-indigo-500 w-[80%]"
                                >
                                    <span>
                                        <FiUploadCloud size={40} />
                                    </span>
                                    <span>Chọn ảnh</span>
                                    <span className="italic text-gray-600">
                                        (Định dạng file ảnh: *.png, *.jpg, *.jpeg)
                                    </span>
                                </label>
                            </div>
                            <input
                                type="file"
                                onChange={handleImage}
                                multiple
                                accept=".jpg, .jpeg, .png"
                                name="image"
                                id="image"
                                className="hidden"
                            />
                            <div className="flex justify-start mt-6">
                                <div className="w-[20%]"></div>
                                <div className="grid w-[80%] lg:grid-cols-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 sm:gap-4 md:gap-4 xs:gap-4 gap-3 text-white mb-4">
                                    {imageShow.map((img, index) => (
                                        <div key={index} className="h-[180px] relative">
                                            <label htmlFor={index}>
                                                <img
                                                    src={img.url}
                                                    alt=""
                                                    className="w-full h-full rounded-sm"
                                                />
                                            </label>
                                            <input
                                                type="file"
                                                id={index}
                                                className="hidden"
                                                onChange={(e) => changeImage(e.target.files[0], index)}
                                            />
                                            <span
                                                onClick={() => removeImage(index)}
                                                className="p-1 z-10 cursor-pointer bg-black hover:shadow-lg hover:shadow-slate-400/50 absolute top-1 right-1 rounded-full"
                                            >
                                                <IoClose color="white" size={20} />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {errorMessage && (
                                <div className="mt-2 text-red-500">
                                    {errorMessage}
                                </div>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            disabled={loading ? true : false}
                            type="submit"
                            color="success"
                            onClick={(event) => handleAddProduct(event)}
                        >
                            {loading ? (
                                <ClipLoader color="white" size={10} className="p-2" />
                            ) : (
                                "Thêm sản phẩm"
                            )}
                        </Button>
                        <Button color="failure" onClick={() => setOpenModal(false)}>
                            Thoát
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <div className="overflow-x-auto mt-5">
                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>Hình ảnh</Table.HeadCell>
                        <Table.HeadCell>Danh mục</Table.HeadCell>
                        <Table.HeadCell>Tên sản phẩm</Table.HeadCell>
                        <Table.HeadCell>Thương hiệu</Table.HeadCell>
                        <Table.HeadCell>Giá bán</Table.HeadCell>
                        <Table.HeadCell>Giảm giá</Table.HeadCell>
                        <Table.HeadCell>Số lượng</Table.HeadCell>
                        <Table.HeadCell></Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {products.map((p, index) => (
                            <Table.Row
                                key={index}
                                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                            >
                                <Table.Cell>
                                    <div className="flex flex-warp gap-4">
                                        <div className="flex flex-warp gap-4">
                                            <div className="avatar">
                                                <div className="w-16 rounded">
                                                    <img src={p.images[0]}  alt="Hình ảnh sản phẩm"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {p.category_name}
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {p.product_name.slice(0, 20) + "..."}
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {p.brand_name}
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {(p.price / 1000).toLocaleString("vi-VN", {
                                        minimumFractionDigits: 3,
                                        maximumFractionDigits: 3,
                                    })}
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {p.discount === 0 ? (
                                        <span>Không giảm</span>
                                    ) : (
                                        <span>{p.discount}%</span>
                                    )}
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {p.quantity}
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="flex flex-warp gap-4">
                                        <button className="flex items-center justify-center bg-[#f1f1f1] dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-2">
                                            <FaEdit
                                                onClick={async () => {
                                                    try {
                                                        const result = await dispatch(get_product(p._id)).unwrap();
                                                        if (result.product) {
                                                            const product = result.product;
                                                            setStateUpdateProduct({
                                                                product_name: product.product_name,
                                                                brand_name: product.brand_name,
                                                                quantity: product.quantity,
                                                                price: product.price,
                                                                discount: product.discount,
                                                                description: product.description,
                                                                colors: product.colors || [],
                                                                sizes: product.sizes || []
                                                            });
                                                            setCategory(product.category_name);
                                                            setImageShow(product.images?.map(img => ({ url: img })) || []);
                                                            setProductId(p._id);
                                                            setOpenUpdateModal(true);
                                                        }
                                                    } catch (error) {
                                                        console.error("Error loading product:", error);
                                                        toast.error("Không thể lấy thông tin sản phẩm");
                                                    }
                                                }}
                                                className="w-5 h-5"
                                            />
                                        </button>
                                        <Modal
                                            size="5xl"
                                            show={openUpdateModal}
                                            onClose={handleCloseUpdateModal}
                                        >
                                            <Modal.Header>Sửa sản phẩm</Modal.Header>
                                            <Modal.Body>
                                                <div className="space-y-6">
                                                    <div className="flex justify-start items-center">
                                                        <label
                                                            htmlFor="product_name"
                                                            className="w-[20%] font-semibold"
                                                        >
                                                            Tên sản phẩm:
                                                        </label>
                                                        <input
                                                            onChange={handleUpdateInputProduct}
                                                            value={stateUpdateProduct.product_name || ''}
                                                            type="text"
                                                            name="product_name"
                                                            placeholder="Nhập tên sản phẩm..."
                                                            className="input !bg-white input-bordered w-[80%]"
                                                        />
                                                    </div>
                                                    <div className="flex justify-start items-center mt-6">
                                                        <label
                                                            htmlFor="brand_name"
                                                            className="w-[20%] font-semibold"
                                                        >
                                                            Tên thương hiệu:
                                                        </label>
                                                        <input
                                                            onChange={handleUpdateInputProduct}
                                                            value={stateUpdateProduct.brand_name || ''}
                                                            type="text"
                                                            name="brand_name"
                                                            placeholder="Nhập tên thương hiệu..."
                                                            className="input !bg-white input-bordered w-[80%]"
                                                        />
                                                    </div>
                                                    <div className="flex justify-start items-center mt-6">
                                                        <label
                                                            htmlFor="category_name"
                                                            className="w-[20%] font-semibold"
                                                        >
                                                            Danh mục sản phẩm:
                                                        </label>
                                                        <div className="flex flex-col gap-1 relative w-[80%]">
                                                            <Select
                                                                value={category}
                                                                onChange={(e) => setCategory(e.target.value)}
                                                                required
                                                            >
                                                                <option value="" disabled>
                                                                    - - - - - Chọn danh mục - - - - -
                                                                </option>
                                                                {allCategory.map((c, index) => (
                                                                    <option key={index} value={c.category_name}>
                                                                        {c.category_name}
                                                                    </option>
                                                                ))}
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-start items-center mt-6">
                                                        <label
                                                            htmlFor="price"
                                                            className="w-[20%] font-semibold"
                                                        >
                                                            Giá sản phẩm:
                                                        </label>
                                                        <input
                                                            onChange={handleUpdateInputProduct}
                                                            value={stateUpdateProduct.price || ''}
                                                            type="number"
                                                            name="price"
                                                            min={0}
                                                            placeholder="Nhập giá sản phẩm..."
                                                            className="input !bg-white input-bordered w-[80%]"
                                                        />
                                                    </div>
                                                    <div className="flex justify-start items-center mt-6">
                                                        <label
                                                            htmlFor="quantity"
                                                            className="w-[20%] font-semibold"
                                                        >
                                                            Số lượng:
                                                        </label>
                                                        <input
                                                            onChange={handleUpdateInputProduct}
                                                            value={stateUpdateProduct.quantity || ''}
                                                            type="number"
                                                            name="quantity"
                                                            min={1}
                                                            placeholder="Nhập số lượng sản phẩm..."
                                                            className="input !bg-white input-bordered w-[80%]"
                                                        />
                                                    </div>
                                                    <div className="flex justify-start items-center mt-6">
                                                        <label
                                                            htmlFor="discount"
                                                            className="w-[20%] font-semibold"
                                                        >
                                                            Giảm giá:
                                                        </label>
                                                        <input
                                                            onChange={handleUpdateInputProduct}
                                                            value={stateUpdateProduct.discount || ''}
                                                            type="number"
                                                            name="discount"
                                                            min={0}
                                                            max={100}
                                                            placeholder="Nhập % giảm giá..."
                                                            className="input !bg-white input-bordered w-[80%]"
                                                        />
                                                    </div>
                                                    <div className="flex justify-start mt-6">
                                                        <label
                                                            htmlFor="description"
                                                            className="w-[20%] font-semibold"
                                                        >
                                                            Mô tả sản phẩm:
                                                        </label>
                                                        <div className="w-[80%]">
                                                            <TextEditor
                                                                onChange={handleInputUpdateTextEditor}
                                                                value={stateUpdateProduct.description}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-6">
                                                        <div className="flex flex-col gap-3">
                                                            <label className="text-lg font-semibold">Màu sắc sản phẩm</label>
                                                            <div className="flex gap-4 items-end">
                                                                <div className="flex-1">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Tên màu"
                                                                        value={newUpdateColor.name}
                                                                        onChange={(e) => setNewUpdateColor({...newUpdateColor, name: e.target.value})}
                                                                        className="input !bg-white input-bordered w-full"
                                                                    />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <input
                                                                        type="color"
                                                                        value={newUpdateColor.code}
                                                                        onChange={(e) => setNewUpdateColor({...newUpdateColor, code: e.target.value})}
                                                                        className="w-full h-[42px] cursor-pointer"
                                                                    />
                                                                </div>
                                                                <button
                                                                    onClick={handleAddUpdateColor}
                                                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                                >
                                                                    Thêm màu
                                                                </button>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                {stateUpdateProduct.colors?.map((color, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="flex items-center gap-2 bg-gray-100 p-2 rounded"
                                                                    >
                                                                        <div
                                                                            className="w-6 h-6 rounded-full"
                                                                            style={{ backgroundColor: color.code }}
                                                                        />
                                                                        <span>{color.name}</span>
                                                                        <button
                                                                            onClick={() => handleRemoveUpdateColor(index)}
                                                                            className="text-red-500 hover:text-red-700"
                                                                        >
                                                                            ×
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col gap-3">
                                                            <label className="text-lg font-semibold">Kích thước sản phẩm</label>
                                                            <div className="flex gap-4 items-end">
                                                                <div className="flex-1">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Nhập kích thước"
                                                                        value={newUpdateSize}
                                                                        onChange={(e) => setNewUpdateSize(e.target.value)}
                                                                        className="input-bordered w-full"
                                                                    />
                                                                </div>
                                                                <button
                                                                    onClick={handleAddUpdateSize}
                                                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                                >
                                                                    Thêm kích thước
                                                                </button>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                {stateUpdateProduct.sizes?.map((size, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="flex items-center gap-2 bg-gray-100 p-2 rounded"
                                                                    >
                                                                        <span>{size}</span>
                                                                        <button
                                                                            onClick={() => handleRemoveUpdateSize(index)}
                                                                            className="text-red-500 hover:text-red-700"
                                                                        >
                                                                            ×
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-start mt-6">
                                                        <h2 className="w-[20%] font-semibold">
                                                            Ảnh sản phẩm:
                                                        </h2>
                                                        <label
                                                            htmlFor="image"
                                                            className="mt-3 rounded-md flex justify-center items-center flex-col h-[150px] cursor-pointer border-2 border-black border-dashed hover:border-indigo-500 w-[80%]"
                                                        >
                                                            <span>
                                                                <FiUploadCloud size={40} />
                                                            </span>
                                                            <span>Chọn ảnh</span>
                                                            <span className="italic text-gray-600">
                                                                (Định dạng file ảnh: *.png, *.jpg, *.jpeg)
                                                            </span>
                                                        </label>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        onChange={handleImage}
                                                        multiple
                                                        accept=".jpg, .jpeg, .png"
                                                        name="image"
                                                        id="image"
                                                        className="hidden"
                                                    />
                                                    <div className="flex justify-start mt-6">
                                                        <div className="w-[20%]"></div>
                                                        <div className="grid w-[80%] lg:grid-cols-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 sm:gap-4 md:gap-4 xs:gap-4 gap-3 text-white mb-4">
                                                            {imageShow.map((img, index) => (
                                                                <div key={index} className="h-[180px] relative">
                                                                    <label htmlFor={index}>
                                                                        <img
                                                                            src={img.url}
                                                                            alt=""
                                                                            className="w-full h-full rounded-sm"
                                                                        />
                                                                    </label>
                                                                    <input
                                                                        type="file"
                                                                        id={index}
                                                                        className="hidden"
                                                                        onChange={(e) =>
                                                                            changeUpdateImage(img, e.target.files)
                                                                        }
                                                                    />
                                                                    <span
                                                                        onClick={() => removeImage(index)}
                                                                        className="p-1 z-10 cursor-pointer bg-black hover:shadow-lg hover:shadow-slate-400/50 absolute top-1 right-1 rounded-full"
                                                                    >
                                                                        <IoClose color="white" size={20} />
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button
                                                    disabled={loading ? true : false}
                                                    type="submit"
                                                    color="success"
                                                    onClick={(event) => handleUpdateProduct(event)}
                                                >
                                                    {loading ? (
                                                        <ClipLoader
                                                            color="white"
                                                            size={10}
                                                            className="p-2"
                                                        />
                                                    ) : (
                                                        "Cập nhật sản phẩm"
                                                    )}
                                                </Button>
                                                <Button
                                                    color="failure"
                                                    onClick={handleCloseUpdateModal}
                                                >
                                                    Thoát
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                        <button className="flex items-center justify-center bg-[#f1f1f1] dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-2">
                                            <FaTrash
                                                onClick={() => {
                                                    setOpenPopup(true); // Hiển thị hộp thoại xác nhận
                                                    setProductIdDelete(p._id); // Lưu ID sản phẩm cần xóa
                                                }}
                                                className="w-5 h-5"
                                            />
                                        </button>
                                        <Modal
                                            show={openPopup}
                                            size="md"
                                            onClose={() => setOpenPopup(false)}
                                            popup
                                        >
                                            <Modal.Header />
                                            <Modal.Body>
                                                <div className="text-center">
                                                    <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                                                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                                        Bạn muốn xóa sản phẩm này?
                                                    </h3>
                                                    <div className="flex justify-center gap-4">
                                                        <Button
                                                            color="failure"
                                                            onClick={() => {
                                                                if (productIdDelete) {
                                                                    dispatch(delete_product(productIdDelete)); // Gửi yêu cầu xóa
                                                                    setProductIdDelete(""); // Xóa trạng thái ID sản phẩm
                                                                    setOpenPopup(false); // Đóng hộp thoại
                                                                }
                                                            }}
                                                        >
                                                            Xác nhận
                                                        </Button>
                                                        <Button
                                                            color="gray"
                                                            onClick={() => setOpenPopup(false)}
                                                        >
                                                            Hủy bỏ
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Modal.Body>
                                        </Modal>

                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
                {totalProduct > parPage && (
                    <div className="w-full flex justify-end mt-4 bottom-4 right-4">
                        <Panigation
                            currentPageNumber={currentPageNumber}
                            setCurrentPageNumber={setCurrentPageNumber}
                            totalItem={totalProduct}
                            parPage={parPage}
                            showItem={3}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Product;

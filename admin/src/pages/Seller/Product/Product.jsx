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
    });

    const [stateUpdateProduct, setStateUpdateProduct] = useState({});

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
            [name]: name === "quantity" ? Math.max(1, Number(value)) : value,
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
            [name]: name === "quantity" ? Math.max(1, Number(value)) : value,
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

    const validateProductData = () => {
        if (!stateProduct.product_name.trim()) {
            toast.error("Tên sản phẩm không được để trống.");
            return false;
        }
        if (!stateProduct.brand_name.trim()) {
            toast.error("Thương hiệu không được để trống.");
            return false;
        }
        if (!category) {
            toast.error("Vui lòng chọn danh mục sản phẩm.");
            return false;
        }
        if (stateProduct.price <= 0) {
            toast.error("Giá sản phẩm phải lớn hơn 0.");
            return false;
        }
        if (stateProduct.quantity < 1) {
            toast.error("Số lượng sản phẩm phải tối thiểu là 1.");
            return false;
        }
        if (stateProduct.discount < 0 || stateProduct.discount > 100) {
            toast.error("Giảm giá phải trong khoảng từ 0% đến 100%.");
            return false;
        }

        if (!stateProduct.description.trim()) {
            toast.error("Mô tả không được để trống.");
            return false;
        }

        if (!images.length > 1) {
            toast.error("Vui lòng thêm ít nhất một ảnh sản phẩm.");
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


    const onClickEditProduct = (productId) => {
        setProductId(productId);
    };

    useEffect(() => {
        if (productId) {
            dispatch(get_product(productId));
        }
    }, [productId]);

    useEffect(() => {
        if (product && product._id === productId) {
            setStateUpdateProduct({
                product_name: product.product_name,
                brand_name: product.brand_name,
                quantity: product.quantity,
                price: product.price,
                discount: product.discount,
                description: product.description,
            });
            setCategory(product.category_name);
            setImageShow(
                product.images.map((img) => ({
                    url: img,
                }))
            );
        }
    }, [product]);

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

    const validateUpdateProductData = () => {
        if (!stateUpdateProduct.product_name.trim()) {
            toast.error("Tên sản phẩm không được để trống.");
            return false;
        }
        if (!stateUpdateProduct.brand_name.trim()) {
            toast.error("Thương hiệu không được để trống.");
            return false;
        }
        if (!category) {
            toast.error("Vui lòng chọn danh mục sản phẩm.");
            return false;
        }
        if (stateUpdateProduct.price <= 0) {
            toast.error("Giá sản phẩm phải lớn hơn 0.");
            return false;
        }
        if (stateUpdateProduct.quantity < 1) {
            toast.error("Số lượng sản phẩm phải tối thiểu là 1.");
            return false;
        }
        if (stateUpdateProduct.discount < 0 || stateUpdateProduct.discount > 100) {
            toast.error("Giảm giá phải trong khoảng từ 0% đến 100%.");
            return false;
        }

        if (!stateProduct.description.trim()) {
            toast.error("Mô tả không được để trống.");
            return false;
        }

        if (!imageShow.length > 1) {
            toast.error("Vui lòng thêm ít nhất một ảnh sản phẩm.");
            return false;
        }
        return true;
    };


    const handleUpdateProduct = async (event) => {
        event.preventDefault();

        const data = {
            product_name: stateUpdateProduct.product_name,
            brand_name: stateUpdateProduct.brand_name,
            price: stateUpdateProduct.price,
            quantity: Math.max(1, stateUpdateProduct.quantity), // Đảm bảo số lượng >= 1
            discount: (Math.max(0, stateUpdateProduct.discount)),
            description: stateUpdateProduct.description,
            productId: productId,
        };

        try {
            await dispatch(update_product(data)).unwrap();
            navigate(0);
        } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật sản phẩm.");
        }
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
                        className=""
                        color="success"
                        size="lg"
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
                                    min={1}
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
                                                onClick={() => {
                                                    onClickEditProduct(p._id);
                                                    setOpenUpdateModal(true);
                                                }}
                                                className="w-5 h-5"
                                            />
                                        </button>
                                        <Modal
                                            size="5xl"
                                            show={openUpdateModal}
                                            onClose={() => {
                                                if (canCloseModal) {
                                                    setOpenUpdateModal(false);
                                                    setCanCloseModal(false);
                                                }
                                            }}
                                        >
                                            <Modal.Header
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setCanCloseModal(true);
                                                    setOpenUpdateModal(false);
                                                }}
                                            >
                                                Sửa sản phẩm
                                            </Modal.Header>
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
                                                            value={stateUpdateProduct.product_name}
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
                                                            value={stateUpdateProduct.brand_name}
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
                                                            value={stateUpdateProduct.price}
                                                            type="number"
                                                            name="price"
                                                            min={1}
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
                                                            value={stateUpdateProduct.quantity}
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
                                                            value={stateUpdateProduct.discount}
                                                            type="number"
                                                            name="discount"
                                                            max={100}
                                                            min={0}
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
                                                    onClick={() => setOpenUpdateModal(false)}
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

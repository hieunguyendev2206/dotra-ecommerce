/* eslint-disable no-unused-vars */
import Panigation from "../../../components/Panigation";
import {Button, Modal, Select, Table} from "flowbite-react";
import {useEffect, useState} from "react";
import icons from "../../../assets/icons";
import {useDispatch, useSelector} from "react-redux";
import {get_categories} from "../../../store/reducers/category.reducers";
import Search from "../../../components/Search";
// import {
//     add_blog,
//     delete_blog,
//     get_blog,
//     get_blogs,
//     message_clear,
//     update_blog,
//     update_blog_image,
// } from "../../../store/reducers/blog.reducers";
import {ClipLoader} from "react-spinners";
import {toast} from "react-toastify";
import TextEditor from "../../../components/TextEditor";
import {FaTrash} from "react-icons/fa";

const Blog = () => {
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
    const [blogId, setblogId] = useState("");
    const [blogIdDelete, setblogIdDelete] = useState("");
    const dispatch = useDispatch();
    const {categories} = useSelector((state) => state.category);
    const {
        loading,
        success_message,
        error_message,
        blogs,
        totalblog,
        blog,
    } = useSelector((state) => state.blog);
    const {user_info} = useSelector((state) => state.auth);
    const [stateblog, setStateblog] = useState({
        blog_name: "",
        brand_name: "",
        quantity: "",
        price: "",
        discount: "",
        description: "",
    });

    const [stateUpdateblog, setStateUpdateblog] = useState({
        // blog_name: "",
        // brand_name: "",
        // quantity: "",
        // price: "",
        // discount: "",
        // description: "",
    });

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

    const handleInputblog = (event) => {
        setStateblog({
            ...stateblog,
            [event.target.name]: event.target.value,
        });
    };

    const handleInputTextEditor = (event, editor) => {
        const data = editor.getData();
        setStateblog({
            ...stateblog,
            description: data,
        });
    };

    const handleUpdateInputblog = (event) => {
        setStateUpdateblog({
            ...stateUpdateblog,
            [event.target.name]: event.target.value,
        });
    };

    const handleInputUpdateTextEditor = (event, editor) => {
        const data = editor.getData();
        setStateUpdateblog({
            ...stateUpdateblog,
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
                imageUrl.push({url: URL.createObjectURL(files[i])});
            }
            setImageShow([...imageShow, ...imageUrl]);
        }
    };

    const changeImage = (img, index) => {
        if (img) {
            let tempUrl = imageShow;
            let tempImages = images;

            tempImages[index] = img;
            tempUrl[index] = {url: URL.createObjectURL(img)};
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

    const handleAddblog = (event) => {
        if (event) event.preventDefault();
        const formData = new FormData();
        formData.append("blog_name", stateblog.blog_name);
        formData.append("brand_name", stateblog.brand_name);
        formData.append("category_name", category);
        formData.append("price", stateblog.price);
        formData.append("quantity", stateblog.quantity);
        formData.append("discount", stateblog.discount);
        formData.append("description", stateblog.description);
        formData.append("shop_name", user_info.shop_info.shop_name);
        for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]);
        }
        dispatch(add_blog(formData));
    };

    useEffect(() => {
        if (success_message) {
            toast.success(success_message);
            dispatch(message_clear());
            setStateblog({
                blog_name: "",
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
            setblogId("");
        }
        if (error_message) {
            toast.error(error_message);
            dispatch(message_clear());
        }
    }, [success_message, error_message, dispatch]);

    useEffect(() => {
        const data = {
            page: parseInt(currentPageNumber),
            parPage: parseInt(parPage),
            searchValue,
        };
        dispatch(get_blogs(data));
    }, [currentPageNumber, parPage, searchValue, dispatch]);

    const onClickEditblog = (blogId) => {
        setblogId(blogId);
    };

    useEffect(() => {
        if (blogId) {
            dispatch(get_blog(blogId));
        }
    }, [dispatch, blogId]);

    useEffect(() => {
        if (blog && blog._id === blogId) {
            setStateUpdateblog({
                blog_name: blog.blog_name,
                brand_name: blog.brand_name,
                quantity: blog.quantity,
                price: blog.price,
                discount: blog.discount,
                description: blog.description,
            });
            setCategory(blog.category_name);
            setImageShow(
                blog.images.map((img) => ({
                    url: img,
                }))
            );
        }
    }, [blog, blogId]);

    const changeUpdateImage = (image, files) => {
        if (files.length > 0) {
            dispatch(
                update_blog_image({
                    old_image: image.url,
                    new_image: files[0],
                    blogId: blogId,
                })
            );
        }
    };

    const handleUpdateblog = (event) => {
        event.preventDefault();
        const data = {
            blog_name: stateUpdateblog.blog_name,
            brand_name: stateUpdateblog.brand_name,
            price: stateUpdateblog.price,
            quantity: stateUpdateblog.quantity,
            discount: stateUpdateblog.discount,
            description: stateUpdateblog.description,
            blogId: blogId,
        };
        dispatch(update_blog(data));
    };

    const onClickDeleteblog = (blogIdDelete) => {
        setblogIdDelete(blogIdDelete);
    };

    useEffect(() => {
        if (blogIdDelete) {
            dispatch(delete_blog(blogIdDelete));
        }
    }, [blogIdDelete, dispatch]);

    return (
        <div className="px-2 md:px-7 py-5 bg-[#dae1e7]">
            <h1 className="text-xl font-bold uppercase my-3">Danh sách sản phẩm</h1>
            <div className="bg-white p-4 flex justify-center items-center">
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
                                <label htmlFor="blog_name" className="w-[20%] font-semibold">
                                    Tên sản phẩm:
                                </label>
                                <input
                                    onChange={handleInputblog}
                                    value={stateblog.blog_name}
                                    type="text"
                                    name="blog_name"
                                    placeholder="Nhập tên sản phẩm..."
                                    className="input input-bordered w-[80%] bg-white"
                                />
                            </div>
                            <div className="flex justify-start items-center mt-6">
                                <label htmlFor="brand_name" className="w-[20%] font-semibold">
                                    Tên thương hiệu:
                                </label>
                                <input
                                    onChange={handleInputblog}
                                    value={stateblog.brand_name}
                                    type="text"
                                    name="brand_name"
                                    placeholder="Nhập tên thương hiệu..."
                                    className="input input-bordered w-[80%] bg-white"
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
                                    onChange={handleInputblog}
                                    value={stateblog.price}
                                    type="number"
                                    name="price"
                                    placeholder="Nhập giá sản phẩm..."
                                    className="input input-bordered w-[80%] bg-white"
                                />
                            </div>
                            <div className="flex justify-start items-center mt-6">
                                <label htmlFor="quantity" className="w-[20%] font-semibold">
                                    Số lượng:
                                </label>
                                <input
                                    onChange={handleInputblog}
                                    value={stateblog.quantity}
                                    type="number"
                                    name="quantity"
                                    placeholder="Nhập số lượng sản phẩm..."
                                    className="input input-bordered w-[80%] bg-white"
                                />
                            </div>
                            <div className="flex justify-start items-center mt-6">
                                <label htmlFor="discount" className="w-[20%] font-semibold">
                                    Giảm giá:
                                </label>
                                <input
                                    onChange={handleInputblog}
                                    value={stateblog.discount}
                                    type="number"
                                    name="discount"
                                    placeholder="Nhập % giảm giá..."
                                    className="input input-bordered w-[80%] bg-white"
                                />
                            </div>
                            <div className="flex justify-start mt-6">
                                <label htmlFor="description" className="w-[20%] font-semibold">
                                    Mô tả sản phẩm:
                                </label>
                                <div className="w-[80%]">
                                    <TextEditor
                                        onChange={handleInputTextEditor}
                                        value={stateblog.description}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-start mt-6">
                                <h2 className="w-[20%] font-semibold">Ảnh sản phẩm:</h2>
                                <label
                                    htmlFor="image"
                                    className="mt-3
                                               rounded-md
                                               flex justify-center
                                               items-center flex-col
                                               h-[150px]
                                               cursor-pointer
                                               border-2
                                               border-black
                                               border-dashed
                                               hover:border-indigo-500
                                               w-[80%]"
                                >
                                    <span>
                                        <FiUploadCloud size={40}/>
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
                                <div
                                    className="grid w-[80%] lg:grid-cols-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 sm:gap-4 md:gap-4 xs:gap-4 gap-3 text-white mb-4">
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
                                                <IoClose color="white" size={20}/>
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
                            onClick={(event) => handleAddblog(event)}
                        >
                            {loading ? (
                                <ClipLoader color="white" size={10} className="p-2"/>
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
                        {blogs.map((p, index) => (
                            <Table.Row
                                key={index}
                                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                            >
                                <Table.Cell>
                                    <div className="flex flex-warp gap-4">
                                        <div className="flex flex-warp gap-4">
                                            <div className="avatar">
                                                <div className="w-16 rounded">
                                                    <img src={p.images[0]} alt=""/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {p.category_name}
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {p.blog_name.slice(0, 15) + "..."}
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {p.brand_name.slice(0,10) + "..."}
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
                                        <button
                                            className="flex items-center justify-center bg-[#f1f1f1] dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-2">
                                            <FaEdit
                                                onClick={() => {
                                                    onClickEditblog(p._id);
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
                                            className="!bg-transparent"
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
                                                            htmlFor="blog_name"
                                                            className="w-[20%] font-semibold"
                                                        >
                                                            Tên sản phẩm:
                                                        </label>
                                                        <input
                                                            onChange={handleUpdateInputblog}
                                                            value={stateUpdateblog.blog_name}
                                                            type="text"
                                                            name="blog_name"
                                                            placeholder="Nhập tên sản phẩm..."
                                                            className="bg-white input input-bordered w-[80%]"
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
                                                            onChange={handleUpdateInputblog}
                                                            value={stateUpdateblog.brand_name}
                                                            type="text"
                                                            name="brand_name"
                                                            placeholder="Nhập tên thương hiệu..."
                                                            className="bg-white input input-bordered w-[80%]"
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
                                                            onChange={handleUpdateInputblog}
                                                            value={stateUpdateblog.price}
                                                            type="number"
                                                            name="price"
                                                            placeholder="Nhập giá sản phẩm..."
                                                            className="bg-white input input-bordered w-[80%]"
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
                                                            onChange={handleUpdateInputblog}
                                                            value={stateUpdateblog.quantity}
                                                            type="number"
                                                            name="quantity"
                                                            placeholder="Nhập số lượng sản phẩm..."
                                                            className="bg-white input input-bordered w-[80%]"
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
                                                            onChange={handleUpdateInputblog}
                                                            value={stateUpdateblog.discount}
                                                            type="number"
                                                            name="discount"
                                                            placeholder="Nhập % giảm giá..."
                                                            className="bg-white input input-bordered w-[80%]"
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
                                                                value={stateUpdateblog.description}
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
                                                                <FiUploadCloud size={40}/>
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
                                                        <div
                                                            className="grid w-[80%] lg:grid-cols-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 sm:gap-4 md:gap-4 xs:gap-4 gap-3 text-white mb-4">
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
                                                                        <IoClose color="white" size={20}/>
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
                                                    onClick={(event) => handleUpdateblog(event)}
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
                                        <button
                                            className="flex items-center justify-center bg-[#f1f1f1] dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-2">
                                            <FaTrash
                                                onClick={() => setOpenPopup(true)}
                                                className="w-5 h-5"
                                            />
                                        </button>
                                        <Modal
                                            show={openPopup}
                                            size="md"
                                            className="!bg-transparent"
                                            onClose={() => setOpenPopup(false)}
                                            popup
                                        >
                                            <Modal.Header/>
                                            <Modal.Body>
                                                <div className="text-center">
                                                    <HiOutlineExclamationCircle
                                                        className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"/>
                                                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                                        Bạn muốn xóa sản phẩm này?
                                                    </h3>
                                                    <div className="flex justify-center gap-4">
                                                        <Button
                                                            color="failure"
                                                            onClick={() => {
                                                                setOpenPopup(false),
                                                                    onClickDeleteblog(p._id);
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
                {totalblog > parPage && (
                    <div className="w-full flex justify-end mt-4 bottom-4 right-4">
                        <Panigation
                            currentPageNumber={currentPageNumber}
                            setCurrentPageNumber={setCurrentPageNumber}
                            totalItem={totalblog}
                            parPage={parPage}
                            showItem={3}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;

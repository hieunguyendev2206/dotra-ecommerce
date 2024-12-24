/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import icons from "../../../assets/icons";
import {Button, Modal, Table} from "flowbite-react";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ClipLoader} from "react-spinners";
import {add_category, get_categories, message_clear,} from "../../../store/reducers/category.reducers";
import {toast} from "react-toastify";
import {formatDate} from "../../../utils/formate";
import Panigation from "../../../components/Panigation";
import Search from "../../../components/Search";

const Categories = () => {
    const {FiUploadCloud} = icons;
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [parPage, setParPage] = useState(10);
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useDispatch();
    const {loading, success_message, error_message, categories, totalCategory} = useSelector((state) => state.category);
    const [imageShow, setImageShow] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [state, setState] = useState({
        category_name: "", image: "",
    });

    const handleImage = (event) => {
        let files = event.target.files;
        if (files.length > 0) {
            setImageShow(URL.createObjectURL(files[0]));
            setState({
                ...state, image: files[0],
            });
        }
    };

    const handleInput = (event) => {
        setState({
            ...state, [event.target.name]: event.target.value,
        });
    };

    const handleAddCategory = (event) => {
        event.preventDefault();
        dispatch(add_category(state));
    };

    useEffect(() => {
        if (success_message) {
            toast.success(success_message);
            dispatch(message_clear());
            setState({
                category_name: "", image: "",
            });
            setImageShow("");
            setOpenModal(false);
        }
        if (error_message) {
            toast.error(error_message);
            dispatch(message_clear());
        }
    }, [success_message, error_message, dispatch]);

    useEffect(() => {
        const data = {
            page: currentPageNumber, parPage: parPage, searchValue: searchValue,
        };
        dispatch(get_categories(data));
    }, [currentPageNumber, parPage, searchValue, dispatch]);

    return (<div className="px-2 md:px-7 py-5 bg-[#dae1e7]">
        <h1 className="text-xl font-bold uppercase my-4">Danh mục sản phẩm</h1>
        <div className="bg-white p-4 w-full flex justify-between items-center mt-4 flex-col sm:flex-row rounded-lg">
            <Search
                setParPage={setParPage}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
            />
            <Button color="success" size="lg" className="w-full sm:w-auto mt-3 sm:mt-0 text-center"
                    onClick={() => setOpenModal(true)}>
                Thêm danh mục
            </Button>
            <Modal
                size="xl"
                dismissible
                show={openModal}
                onClose={() => setOpenModal(false)}
            >
                <Modal.Header>Thêm danh mục sản phẩm</Modal.Header>
                <form onSubmit={handleAddCategory}>
                    <Modal.Body>
                        <div className="space-y-6">
                            <input
                                type="text"
                                name="category_name"
                                onChange={handleInput}
                                value={state.category_name}
                                required
                                placeholder="Tên danh mục..."
                                className="input-bordered w-full rounded-md border-gray-600"
                            />
                            <div>
                                <label
                                    htmlFor="image"
                                    className="mt-3 rounded-md flex justify-center items-center flex-col h-[283px] cursor-pointer border border-black border-dashed hover:border-indigo-500 w-full"
                                >
                                    {imageShow ? (<img src={imageShow} alt="" className="w-full h-full"/>) : (<>
                                        <span>
                                            <FiUploadCloud size={40}/>
                                        </span>
                                        <span>Chọn ảnh</span>
                                        <span className="italic text-gray-600">
                                            (Định dạng file ảnh: *.png, *.jpg, *.jpeg)
                                        </span>
                                    </>)}
                                </label>
                            </div>
                            <input
                                type="file"
                                onChange={handleImage}
                                name="image"
                                id="image"
                                className="hidden"
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            type="submit"
                            color="success"
                            disabled={loading ? true : false}
                        >
                            {loading ? (<ClipLoader color="white" size={10} className="p-2"/>) : ("Thêm danh mục")}
                        </Button>
                        <Button color="failure" onClick={() => setOpenModal(false)}>
                            Thoát
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
        <div className="overflow-x-auto mt-5">
            <Table hoverable>
                <Table.Head>
                    <Table.HeadCell>STT</Table.HeadCell>
                    <Table.HeadCell>Tên danh mục</Table.HeadCell>
                    <Table.HeadCell>Ngày tạo</Table.HeadCell>
                    <Table.HeadCell>Hình ảnh</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {categories.map((c, index) => (<Table.Row
                        key={index}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                        <Table.Cell>{index + 1}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {c.category_name}
                        </Table.Cell>
                        <Table.Cell>{formatDate(c.createdAt)}</Table.Cell>
                        <Table.Cell>
                            <div className="flex flex-warp gap-4">
                                <div className="avatar">
                                    <div className="w-16 rounded">
                                        <img src={c.image} alt="Picture"/>
                                    </div>
                                </div>
                            </div>
                        </Table.Cell>
                    </Table.Row>))}
                </Table.Body>
            </Table>
            {totalCategory > parPage && (<div className="w-full flex justify-end mt-4 bottom-4 right-4">
                <Panigation
                    currentPageNumber={currentPageNumber}
                    setCurrentPageNumber={setCurrentPageNumber}
                    totalItem={totalCategory}
                    parPage={parPage}
                    showItem={Math.floor(totalCategory / parPage)}
                />
            </div>)}
        </div>
    </div>);
};

export default Categories;

/* eslint-disable no-unused-vars */
import {useEffect, useState} from "react";
import {Badge, Button, Table} from "flowbite-react";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {get_seller_active} from "../../../store/reducers/seller.reducer";
import icons from "../../../assets/icons";
import Panigation from "../../../components/Panigation";
import path from "../../../constants/path";
import Search from "../../../components/Search";
import UserPic from "../../../assets/img/user.jpg"

const Seller = () => {
    const {AiOutlineEye, FaEdit} = icons;
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [parPage, setParPage] = useState(5);
    const [openModal, setOpenModal] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const dispatch = useDispatch();
    const {sellers, totalSeller} = useSelector((state) => state.seller);

    useEffect(() => {
        const data = {
            page: currentPageNumber, parPage: parPage, searchValue: searchValue,
        };
        dispatch(get_seller_active(data));
    }, [currentPageNumber, parPage, searchValue, dispatch]);

    return (<div className="px-2 md:px-7 py-5 bg-[#dae1e7]">
        <h1 className="text-xl font-bold uppercase mt-2">Danh sách người bán</h1>
        <div className="bg-white p-4 w-full flex justify-between items-center mt-4 flex-col sm:flex-row rounded-lg">
            <Search
                setParPage={setParPage}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                className="w-full sm:w-auto"
            />

            <Link to={path.admin_dashboard_deactive}>
                <Button
                    color="failure"
                    size="lg"
                    className="w-full sm:w-auto mt-3 sm:mt-0 text-center"
                >
                    Tài khoản bị vô hiệu
                </Button>
            </Link>
        </div>
        <div className="overflow-x-auto mt-5">
            <Table hoverable>
                <Table.Head>
                    <Table.HeadCell>Mã Seller</Table.HeadCell>
                    <Table.HeadCell>Avatar</Table.HeadCell>
                    <Table.HeadCell>Họ Và Tên</Table.HeadCell>
                    <Table.HeadCell>Email</Table.HeadCell>
                    <Table.HeadCell>Tên Shop</Table.HeadCell>
                    <Table.HeadCell>Trạng Thái</Table.HeadCell>
                    <Table.HeadCell></Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {sellers.map((s, index) => (<Table.Row key={index} className="bg-white dark:border-gray-700">
                        <Table.Cell>#{s._id.slice(0, 5)}...{s._id.slice(-5)}</Table.Cell>
                        <Table.Cell>
                            <div className="flex flex-warp gap-4">
                                <div className="avatar">
                                    <div className="w-16 rounded">
                                        {s.image ? (<img src={s.image} alt=""/>) : (
                                            <img src={UserPic} alt="User"/>)}
                                    </div>
                                </div>
                            </div>
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {s.name}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {s.email}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {s?.shop_info?.shop_name}
                        </Table.Cell>
                        <Table.Cell>
                            {s.status === "active" && (<Badge color="success" className="inline-block px-2 py-1">
                                Hoạt động
                            </Badge>)}
                        </Table.Cell>
                        <Table.Cell>
                            <div className="flex flex-warp gap-4 justify-center items-center">
                                <Link to={`/admin/dashboard/sellers/details/${s._id}`}>
                                    <button
                                        className="flex items-center justify-center bg-[#f1f1f1] dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-2">
                                        <FaEdit className="w-5 h-5"/>
                                    </button>
                                </Link>
                                <div></div>
                            </div>
                        </Table.Cell>
                    </Table.Row>))}
                </Table.Body>
            </Table>
            {totalSeller > parPage ? (<div className="w-full flex justify-end mt-4 bottom-4 right-4">
                <Panigation
                    currentPageNumber={currentPageNumber}
                    setCurrentPageNumber={setCurrentPageNumber}
                    totalItem={totalSeller}
                    parPage={parPage}
                    showItem={3}
                />
            </div>) : ("")}
        </div>
    </div>);
};

export default Seller;

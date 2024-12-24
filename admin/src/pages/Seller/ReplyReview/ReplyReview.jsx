/* eslint-disable no-unused-vars */
import {Button, Modal, Table} from "flowbite-react";
import {formatDate} from "../../../utils/formate";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Search from "../../../components/Search";
import icons from "../../../assets/icons";
import Panigation from "../../../components/Panigation";
import {
  get_review_by_id,
  get_review_seller,
  message_clear,
  reply_review,
} from "../../../store/reducers/review.reducers";
import TextEditor from "../../../components/TextEditor";
import Rating from "../../../components/Rating";
import DOMPurify from "dompurify";
import ClipLoader from "react-spinners/ClipLoader";
import {toast} from "react-toastify";

const ReplyReview = () => {
    const {FaEdit} = icons;
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [parPage, setParPage] = useState(10);
    const [openModal, setOpenModal] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [replyReview, setReplyReview] = useState("");
    const dispatch = useDispatch();
    const {
        reviews,
        review,
        totalReview,
        loading,
        success_message,
        error_message,
    } = useSelector((state) => state.review);

    useEffect(() => {
        const data = {
            page: parseInt(currentPageNumber),
            parPage: parseInt(parPage),
            searchValue,
        };
        dispatch(get_review_seller(data));
    }, [currentPageNumber, dispatch, parPage, searchValue]);

    const onClickGetReviewById = (reviewId) => {
        dispatch(get_review_by_id(reviewId));
    };

    function stripHtml(html) {
      let doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    }

    const onChangeTextEditor = (event, value) => {
        setReplyReview(value.getData());
    };

    const handleReplyReview = (e) => {
        e.preventDefault();
        const data = {
            reviewId: review._id,
            reply: replyReview,
        };
        dispatch(reply_review(data));
    };

    useEffect(() => {
        if (success_message) {
            toast.success(success_message);
            dispatch(message_clear());
            setOpenModal(false);
            setReplyReview("");
        }
        if (error_message) {
            toast.error(error_message);
            dispatch(message_clear());
            setOpenModal(false);
            setReplyReview("");
        }
    }, [success_message, error_message, dispatch]);

    return (
        <div className="px-2 md:px-7 py-5 bg-[#dae1e7]">
            <h1 className="text-xl font-bold uppercase my-4">Đánh giá sản phẩm</h1>
            <div className="bg-white p-4 flex justify-between items-center rounded-lg">
                <Search
                    setParPage={setParPage}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                />
            </div>
            <div className="overflow-x-auto mt-5">
                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>STT</Table.HeadCell>
                        <Table.HeadCell>Tên khách hàng</Table.HeadCell>
                        <Table.HeadCell>Ảnh sản phẩm</Table.HeadCell>
                        <Table.HeadCell>Tên sản phẩm</Table.HeadCell>
                        <Table.HeadCell>Số sao</Table.HeadCell>
                        <Table.HeadCell>Đánh giá</Table.HeadCell>
                        <Table.HeadCell>Thời gian</Table.HeadCell>
                        <Table.HeadCell></Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {Array.isArray(reviews) &&
                            reviews.map((r, index) => (
                                <Table.Row
                                    key={r._id}
                                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <Table.Cell>{index + 1}</Table.Cell>
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {r.customer_name}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div className="flex flex-warp gap-4">
                                            <div className="flex flex-warp gap-4">
                                                <div className="avatar">
                                                    <div className="w-16 rounded">
                                                        <img src={r.product_image} alt=""/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell
                                        className="whitespace-nowrap truncate font-medium text-gray-900 dark:text-white">
                                        {r.product_name.slice(0, 15) + "..."}
                                    </Table.Cell>
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {r.rating}
                                    </Table.Cell>
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {r.review.replace(/<[^>]*>?/gm, "").slice(0, 15) + "..."}
                                    </Table.Cell>
                                    <Table.Cell>{formatDate(r.createdAt)}</Table.Cell>

                                    <Table.Cell>
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => {
                                                    onClickGetReviewById(r._id);
                                                    setOpenModal(true);
                                                }}
                                                className="flex items-center justify-center bg-[#f1f1f1] dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-2"
                                            >
                                                <FaEdit className="w-5 h-5"/>
                                            </button>
                                        </div>
                                        <Modal
                                            size={"4xl"}
                                            show={openModal}
                                            onClose={() => setOpenModal(false)}
                                        >
                                            <Modal.Header>Trả lời đánh giá</Modal.Header>
                                            <Modal.Body>
                                                <div className="space-y-6">
                                                    <div className="flex justify-start items-center">
                                                        <label
                                                            htmlFor="product_name"
                                                            className="w-[20%] font-semibold"
                                                        >
                                                            Số sao
                                                        </label>
                                                        <div className="w-[80%] flex gap-1">
                                                            <Rating rating={review.rating}/>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-start items-center">
                                                        <label
                                                            htmlFor="product_name"
                                                            className="w-[20%] font-semibold"
                                                        >
                                                            Đánh giá
                                                        </label>
                                                        <div className="w-[80%]">
                              <textarea
                                  value={stripHtml(
                                      DOMPurify.sanitize(review.review)
                                  )}
                                  name=""
                                  id=""
                                  className="w-full"
                              ></textarea>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-start items-center">
                                                        <label
                                                            htmlFor="product_name"
                                                            className="w-[20%] font-semibold"
                                                        >
                                                            Trả lời đánh giá
                                                        </label>
                                                        <div className="w-[80%]">
                                                            <TextEditor
                                                                value={replyReview}
                                                                onChange={onChangeTextEditor}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button
                                                    color="success"
                                                    onClick={handleReplyReview}
                                                    disabled={loading ? true : false}
                                                >
                                                    {loading ? (
                                                        <ClipLoader
                                                            color="white"
                                                            size={10}
                                                            className="p-2"
                                                        />
                                                    ) : (
                                                        "Xác nhận"
                                                    )}
                                                </Button>
                                                <Button
                                                    color="failure"
                                                    onClick={() => setOpenModal(false)}
                                                >
                                                    Hủy bỏ
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                    </Table.Body>
                </Table>
                {totalReview > parPage && (
                    <div className="w-full flex justify-end mt-4 bottom-4 right-4">
                        <Panigation
                            currentPageNumber={currentPageNumber}
                            setCurrentPageNumber={setCurrentPageNumber}
                            totalItem={totalReview}
                            parPage={parPage}
                            showItem={Math.floor(totalReview / parPage)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReplyReview;

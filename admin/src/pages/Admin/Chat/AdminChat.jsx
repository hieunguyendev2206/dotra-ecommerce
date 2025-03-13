/* eslint-disable no-unused-vars */
import {useEffect, useRef, useState} from "react";
import icons from "../../../assets/icons";
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    get_seller_admin_messages,
    get_sellers_chat,
    message_clear,
    send_message_admin_seller,
    update_message_seller,
    update_message_status
} from "../../../store/reducers/chat.reducers";
import {formatDate} from "../../../utils/formate";
import {socket} from "../../../utils/socket.io";
import {toast} from "react-toastify";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import useSound from "use-sound";
import sendingSound from "../../../audio/sending.mp3";
import notificationSound from "../../../audio/notification.mp3";

const AdminChat = () => {
    const {BsEmojiSmile, AiOutlinePlus, IoSend, IoClose} = icons;
    const [showEmoji, setShowEmoji] = useState(false);
    const [message, setMessage] = useState("");
    const [fileName, setFileName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [receiveMessage, setReceiveMessage] = useState("");
    const [sending] = useSound(sendingSound);
    const [notification] = useSound(notificationSound);
    const [isTyping, setIsTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);

    const {sellerId} = useParams();
    const dispatch = useDispatch();
    const scrollRef = useRef();
    const {user_info} = useSelector((state) => state.auth);
    const {sellers, current_seller, seller_admin_messages, success_message} =
        useSelector((state) => state.chat);

    useEffect(() => {
        if (sellerId) {
            dispatch(get_seller_admin_messages(sellerId));
        }
        dispatch(get_sellers_chat());
    }, [sellerId, dispatch]);

    const addEmoji = (e) => {
        let emoji = e.native;
        setMessage((prevMessage) => prevMessage + emoji);
    };

    const handleSendMessage = () => {
        if (message || selectedFile) {
            const formData = new FormData();
            formData.append("message", message);
            formData.append("file", selectedFile);
            formData.append("sellerId", sellerId);
            dispatch(send_message_admin_seller(formData));
            if (selectedFile) {
                setTimeout(() => {
                    sending();
                }, 3000);
            } else {
                sending();
            }
            setMessage("");
            setSelectedFile(null);
            setShowEmoji(false);
            setFileName("");
        }
    };

    // Xử lý typing
    const handleTyping = (e) => {
        setMessage(e.target.value);
        
        // Gửi sự kiện typing
        socket.emit("typing_start", {
            senderId: user_info._id,
            receiverId: sellerId
        });

        // Clear timeout cũ nếu có
        if (typingTimeout) clearTimeout(typingTimeout);

        // Set timeout mới
        const timeout = setTimeout(() => {
            socket.emit("typing_stop", {
                senderId: user_info._id,
                receiverId: sellerId
            });
        }, 1000);

        setTypingTimeout(timeout);
    };

    useEffect(() => {
        socket.on("receive_seller_message", (msg) => {
            dispatch(update_message_seller(msg));
            setReceiveMessage(msg);
            notification();
        });

        socket.on("typing_start_receive", (senderId) => {
            if (senderId === sellerId) {
                setIsTyping(true);
            }
        });

        socket.on("typing_stop_receive", (senderId) => {
            if (senderId === sellerId) {
                setIsTyping(false);
            }
        });

        socket.on("message_delivered", (messageId) => {
            dispatch(update_message_status({messageId, status: 'delivered'}));
        });

        socket.on("message_seen_ack", (messageId) => {
            dispatch(update_message_status({messageId, status: 'seen'}));
        });

        return () => {
            socket.off("receive_seller_message");
            socket.off("typing_start_receive");
            socket.off("typing_stop_receive");
            socket.off("message_delivered");
            socket.off("message_seen_ack");
        };
    }, [sellerId, dispatch, notification]);

    useEffect(() => {
        if (success_message) {
            socket.emit(
                "send_message_admin_to_seller",
                seller_admin_messages[seller_admin_messages.length - 1]
            );
            dispatch(message_clear());
        }
    }, [seller_admin_messages, dispatch, success_message]);

    // Gửi trạng thái đã xem khi nhận tin nhắn mới
    useEffect(() => {
        if (receiveMessage && sellerId === receiveMessage.senderId) {
            socket.emit("message_seen", receiveMessage._id, receiveMessage.senderId);
        }
    }, [receiveMessage, sellerId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth"});
    }, [seller_admin_messages]);

    return (
        <div className="px-2 lg:px-7">
            <div className="w-full bg-[#dae1e7] px-4 py-4 rounded-md">
                <div className="flex w-full h-full relative">
                    <div className="w-full">
                        <div className="flex justify-between items-center">
                            {current_seller?._id && (
                                <div className="flex justify-start items-center gap-3">
                                    <div className="relative">
                                        <img
                                            className="w-[38px] h-[38px] border-green-500 border max-w-[38px] p-[2px] rounded-full"
                                            src={current_seller.image}
                                            alt=""
                                        />
                                        <div className="w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0"></div>
                                    </div>
                                    <span>{current_seller.shop_info?.shop_name}</span>
                                </div>
                            )}
                        </div>
                        <div className="p-3">
                            <div className="bg-white h-[calc(100vh-250px)] rounded-md p-3 overflow-y-auto">
                                {seller_admin_messages.map((m, index) => {
                                    if (m.senderId === sellerId) {
                                        return (
                                            <div
                                                key={index}
                                                ref={scrollRef}
                                                className="flex justify-start gap-2.5 mb-5"
                                            >
                                                <img
                                                    className="w-8 h-8 rounded-full"
                                                    src={current_seller?.image}
                                                    alt=""
                                                />
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex flex-col w-full max-w-[300px] h-auto leading-1.5 p-3 border-gray-200 bg-gray-100 rounded-lg dark:bg-gray-700">
                                                        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                {current_seller.shop_info?.shop_name}
                                                            </span>
                                                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                                                {formatDate(m.createdAt)}
                                                            </span>
                                                        </div>
                                                        {m.file === null ? (
                                                            <p className="text-sm font-normal text-gray-900 dark:text-white block white-space-pre-wrap word-break-all">
                                                                {m?.message}
                                                            </p>
                                                        ) : (
                                                            <>
                                                                <p className="text-sm font-normal text-gray-900 dark:text-white block white-space-pre-wrap word-break-all">
                                                                    {m?.message}
                                                                </p>
                                                                <img
                                                                    src={m?.file}
                                                                    className="mt-2 rounded-lg max-w-[200px]"
                                                                    alt=""
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div
                                                key={index}
                                                ref={scrollRef}
                                                className="flex justify-end gap-2.5 mb-5"
                                            >
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex flex-col w-full max-w-[300px] h-auto leading-1.5 p-3 border-gray-200 bg-blue-500 rounded-lg">
                                                        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                                                            <span className="text-sm font-semibold text-white">
                                                                Admin
                                                            </span>
                                                            <span className="text-sm font-normal text-gray-100">
                                                                {formatDate(m.createdAt)}
                                                            </span>
                                                        </div>
                                                        {m.file === null ? (
                                                            <p className="text-sm font-normal text-white block white-space-pre-wrap word-break-all">
                                                                {m?.message}
                                                            </p>
                                                        ) : (
                                                            <>
                                                                <p className="text-sm font-normal text-white block white-space-pre-wrap word-break-all">
                                                                    {m?.message}
                                                                </p>
                                                                <img
                                                                    src={m?.file}
                                                                    className="mt-2 rounded-lg max-w-[200px]"
                                                                    alt=""
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="flex justify-end items-center gap-1">
                                                        <span className="text-[11px] text-gray-600 font-medium">
                                                            {formatDate(m.createdAt)}
                                                        </span>
                                                        <span className="text-[11px] text-gray-600">
                                                            {m.status === 'sent' && '✓'}
                                                            {m.status === 'delivered' && '✓✓'}
                                                            {m.status === 'seen' && (
                                                                <span className="text-blue-500">✓✓</span>
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                                <img
                                                    className="w-8 h-8 rounded-full"
                                                    src={user_info?.image}
                                                    alt=""
                                                />
                                            </div>
                                        );
                                    }
                                })}
                                {isTyping && (
                                    <div className="px-4 py-2">
                                        <div className="text-sm text-gray-500 italic">
                                            Người bán đang soạn tin...
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {fileName && (
                            <div className="ml-14 mt-2 bg-gray-600 text-white rounded-lg px-3 py-1 inline-flex items-center">
                                {fileName}
                                <IoClose
                                    size={18}
                                    onClick={() => {
                                        setSelectedFile(null);
                                        setFileName("");
                                    }}
                                    className="ml-3 cursor-pointer"
                                />
                            </div>
                        )}
                        <div className="flex p-2 justify-between items-center w-full">
                            <label htmlFor="file" className="cursor-pointer">
                                <div className="w-[40px] h-[40px] border-2 p-2 justify-center items-center flex rounded-full border-blue-500">
                                    <AiOutlinePlus color="blue"/>
                                    <input
                                        className="hidden"
                                        type="file"
                                        id="file"
                                        onChange={(e) => {
                                            setSelectedFile(e.target.files[0]);
                                            setFileName(e.target.files[0].name);
                                        }}
                                    />
                                </div>
                            </label>
                            <div className="w-[calc(100%-150px)] rounded-full overflow-visible">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={handleTyping}
                                    placeholder="Nhập tin nhắn ..."
                                    className="w-full rounded-full h-full outline-none p-3 pl-6"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                />
                            </div>
                            <div className="cursor-pointer relative">
                                <span>
                                    <BsEmojiSmile
                                        size={20}
                                        color="blue"
                                        onClick={() => setShowEmoji(!showEmoji)}
                                    />
                                </span>
                                {showEmoji && (
                                    <div className="absolute bottom-full right-5">
                                        <Picker data={data} onEmojiSelect={addEmoji}/>
                                    </div>
                                )}
                            </div>
                            <div
                                onClick={handleSendMessage}
                                className="w-[40px] p-2 rounded-full"
                            >
                                <div className="text-2xl cursor-pointer hover:text-blue-300 text-blue-600">
                                    <IoSend/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminChat; 
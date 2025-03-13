/* eslint-disable no-unused-vars */
import {useEffect, useRef, useState} from "react";
import icons from "../../../../assets/icons";
import {formatDate} from "../../../../utils/formate";
import {socket} from "../../../../utils/socket.io";
import {useDispatch, useSelector} from "react-redux";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import useSound from "use-sound";
import sendingSound from "../../../../audio/sending.mp3";
import notificationSound from "../../../../audio/notification.mp3";
import {
    get_seller_messages,
    message_clear,
    send_message_seller_admin,
    update_message_seller,
    update_message_status,
} from "../../../../store/reducers/chat.reducers";

const AdminChat = () => {
    const {BsEmojiSmile, AiOutlinePlus, IoSend, IoClose} = icons;
    const [showEmoji, setShowEmoji] = useState(false);
    const [message, setMessage] = useState("");
    const [fileName, setFileName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [sending] = useSound(sendingSound);
    const [notification] = useSound(notificationSound);
    const [isTyping, setIsTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [isViewingMessages, setIsViewingMessages] = useState(false);

    const dispatch = useDispatch();
    const scrollRef = useRef();
    const {user_info} = useSelector((state) => state.auth);
    const {seller_admin_messages, success_message} = useSelector(
        (state) => state.chat
    );

    const addEmoji = (e) => {
        let emoji = e.native;
        setMessage((prevMessage) => prevMessage + emoji);
    };

    const handleSendMessage = () => {
        if (message || selectedFile) {
            const formData = new FormData();
            formData.append("message", message);
            formData.append("file", selectedFile);
            formData.append("senderId", user_info._id);
            formData.append("senderName", user_info.name);
            formData.append("receiverId", "");
            dispatch(send_message_seller_admin(formData));
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

    useEffect(() => {
        dispatch(get_seller_messages());
    }, [dispatch]);

    useEffect(() => {
        // Khi vào màn hình chat
        setIsViewingMessages(true);
        
        // Kiểm tra và cập nhật trạng thái các tin nhắn chưa đọc
        if (seller_admin_messages.length > 0) {
            seller_admin_messages.forEach(msg => {
                if (msg.senderId === "" && msg.status !== 'seen') {
                    socket.emit("message_seen", msg._id, msg.senderId);
                }
            });
        }

        // Khi rời khỏi màn hình chat
        return () => {
            setIsViewingMessages(false);
        };
    }, [seller_admin_messages]);

    useEffect(() => {
        socket.on("receive_admin_message", (msg) => {
            dispatch(update_message_seller(msg));
            
            // Gửi xác nhận đã nhận tin nhắn ngay lập tức
            socket.emit("message_delivered", msg._id);
            
            // Nếu đang xem tin nhắn, đánh dấu là đã xem
            if (isViewingMessages) {
                socket.emit("message_seen", msg._id, msg.senderId);
            }
            notification();
        });

        // Lắng nghe sự kiện cập nhật trạng thái
        socket.on('message_status_update', ({ messageId, status }) => {
            dispatch(update_message_status({ messageId, status }));
        });

        socket.on("typing_start_receive", () => {
            setIsTyping(true);
        });

        socket.on("typing_stop_receive", () => {
            setIsTyping(false);
        });

        return () => {
            socket.off("receive_admin_message");
            socket.off("message_status_update");
            socket.off("typing_start_receive");
            socket.off("typing_stop_receive");
        };
    }, [dispatch, isViewingMessages, notification]);

    useEffect(() => {
        if (success_message) {
            socket.emit(
                "send_message_seller_to_admin",
                seller_admin_messages[seller_admin_messages.length - 1]
            );
            dispatch(message_clear());
        }
    }, [dispatch, seller_admin_messages, success_message]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth"});
    }, [seller_admin_messages]);

    // Xử lý typing
    const handleTyping = (e) => {
        setMessage(e.target.value);
        
        // Gửi sự kiện typing ngay lập tức
        socket.emit("typing_start", {
            senderId: user_info._id,
            receiverId: ""
        });

        // Clear timeout cũ nếu có
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        // Set timeout mới
        const timeout = setTimeout(() => {
            socket.emit("typing_stop", {
                senderId: user_info._id,
                receiverId: ""
            });
        }, 500);

        setTypingTimeout(timeout);
    };

    // Cleanup typing timeout
    useEffect(() => {
        return () => {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
        };
    }, [typingTimeout]);

    return (
        <div className="px-2 lg:px-7">
            <div className="w-full bg-[#dae1e7] px-4 py-4 rounded-md">
                <div className="flex w-full h-[calc(100vh-140px)] relative">
                    <div className="w-full flex flex-col bg-white rounded-lg overflow-hidden">
                        {/* Chat Header */}
                        <div className="p-4 border-b flex items-center">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img
                                        className="w-[38px] h-[38px] border-green-500 border max-w-[38px] p-[2px] rounded-full"
                                        src="https://res.cloudinary.com/damiapdnh/image/upload/v1715395563/dotra_profile/manager_o2a4la.png"
                                        alt=""
                                    />
                                    <div className="w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0"></div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-base font-medium">Hỗ trợ (Admin Support)</span>
                                    <span className="text-xs text-gray-500">Đang hoạt động</span>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                            <div className="space-y-4">
                                {seller_admin_messages.map((m, index) => {
                                    if (m.senderId === "") {
                                        return (
                                            <div
                                                key={index}
                                                ref={scrollRef}
                                                className="flex justify-start gap-2"
                                            >
                                                <img
                                                    className="w-8 h-8 rounded-full"
                                                    src="https://res.cloudinary.com/damiapdnh/image/upload/v1715395563/dotra_profile/manager_o2a4la.png"
                                                    alt=""
                                                />
                                                <div className="max-w-[75%]">
                                                    <div className="bg-white rounded-2xl rounded-tl-none px-4 py-2 shadow-sm">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-sm font-medium">
                                                                {m.senderName}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {formatDate(m.createdAt)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            {m.file === null ? (
                                                                <p className="text-sm text-gray-800">
                                                                    {m?.message}
                                                                </p>
                                                            ) : (
                                                                <>
                                                                    <p className="text-sm text-gray-800 mb-2">
                                                                        {m?.message}
                                                                    </p>
                                                                    <a
                                                                        href={m?.file}
                                                                        download
                                                                        className="text-blue-500 hover:underline text-sm"
                                                                    >
                                                                        Tải file đính kèm
                                                                    </a>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div
                                                key={index}
                                                ref={scrollRef}
                                                className="flex justify-end gap-2"
                                            >
                                                <div className="max-w-[75%]">
                                                    <div className="bg-blue-500 text-white rounded-2xl rounded-tr-none px-4 py-2 shadow-sm">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-sm font-medium">
                                                                {user_info?.shop_info?.shop_name}
                                                            </span>
                                                            <span className="text-xs text-blue-100">
                                                                {formatDate(m.createdAt)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            {m.file === null ? (
                                                                <p className="text-sm">
                                                                    {m?.message}
                                                                </p>
                                                            ) : (
                                                                <>
                                                                    <p className="text-sm mb-2">
                                                                        {m?.message}
                                                                    </p>
                                                                    <a
                                                                        href={m?.file}
                                                                        download
                                                                        className="text-white hover:underline text-sm"
                                                                    >
                                                                        Tải file đính kèm
                                                                    </a>
                                                                </>
                                                            )}
                                                        </div>
                                                        {/* Hiển thị trạng thái tin nhắn */}
                                                        <div className="text-xs text-right mt-1">
                                                            {m.status === 'sent' && <span className="text-gray-500">Đã gửi</span>}
                                                            {m.status === 'delivered' && <span className="text-gray-600">Đã nhận</span>}
                                                            {m.status === 'seen' && <span className="text-white">Đã xem</span>}
                                                        </div>
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
                            </div>
                        </div>

                        {/* Typing Indicator - Fixed position above input */}
                        {isTyping && (
                            <div className="bg-gray-50 border-t px-4 py-2">
                                <div className="flex items-center gap-2">
                                    <img
                                        className="w-8 h-8 rounded-full"
                                        src="https://res.cloudinary.com/damiapdnh/image/upload/v1715395563/dotra_profile/manager_o2a4la.png"
                                        alt=""
                                    />
                                    <div className="bg-white rounded-2xl rounded-tl-none px-4 py-2 shadow-sm">
                                        <div className="flex gap-2">
                                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0.4s'}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="border-t p-4 bg-white">
                            {fileName && (
                                <div className="mb-3 bg-blue-50 text-blue-700 rounded-lg px-3 py-2 flex items-center justify-between">
                                    <span className="truncate text-sm">{fileName}</span>
                                    <button
                                        onClick={() => {
                                            setSelectedFile(null);
                                            setFileName("");
                                        }}
                                        className="ml-2 text-blue-500 hover:bg-blue-100 p-1 rounded-full"
                                    >
                                        <IoClose size={18} />
                                    </button>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <label htmlFor="file" className="cursor-pointer">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500">
                                        <AiOutlinePlus size={20} />
                                    </div>
                                    <input
                                        className="hidden"
                                        type="file"
                                        id="file"
                                        onChange={(e) => {
                                            setSelectedFile(e.target.files[0]);
                                            setFileName(e.target.files[0].name);
                                        }}
                                    />
                                </label>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={handleTyping}
                                        placeholder="Nhập tin nhắn..."
                                        className="w-full rounded-full bg-gray-100 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={() => setShowEmoji(!showEmoji)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        <BsEmojiSmile size={20} />
                                    </button>
                                    {showEmoji && (
                                        <div className="absolute bottom-full right-0 mb-2">
                                            <Picker data={data} onEmojiSelect={addEmoji} />
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handleSendMessage}
                                    className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white"
                                >
                                    <IoSend size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminChat;

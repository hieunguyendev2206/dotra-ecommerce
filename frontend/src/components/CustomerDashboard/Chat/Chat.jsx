/* eslint-disable no-unused-vars */
import {useEffect, useRef, useState} from "react";
import {Link, useParams} from "react-router-dom";
import icons from "../../../assets/icons";
import {useDispatch, useSelector} from "react-redux";
import {add_chat_friend, message_clear, send_message, update_message,} from "../../../store/reducers/chat.reducers";
import {io} from "socket.io-client";
import {formatDate} from "../../../utils/formate";
import {toast} from "react-toastify";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import useSound from "use-sound";
import sendingSound from "../../../audio/sending.mp3";
import notificationSound from "../../../audio/notification.mp3";

const socket = io("https://dotra-ecommerce.onrender.com");

const Chat = () => {
    const {BsEmojiSmile, AiOutlinePlus, IoSend, IoMdClose} = icons;
    const [sending] = useSound(sendingSound);
    const [notification] = useSound(notificationSound);
    const [showEmoji, setShowEmoji] = useState(false);
    const [message, setMessage] = useState("");
    const [fileName, setFileName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [receiveMessage, setReceiveMessage] = useState("");
    const [activeSeller, setActiveSeller] = useState([]);
    const [showSidebar, setShowSidebar] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [isViewingMessages, setIsViewingMessages] = useState(false);

    const {sellerId} = useParams();
    const scrollRef = useRef();
    const dispatch = useDispatch();
    const {userInfo} = useSelector((state) => state.customer);
    const {current_friend, my_friends, messages, success_message} = useSelector(
        (state) => state.chat
    );

    useEffect(() => {
        socket.emit("add_customer", userInfo.id, userInfo);
    }, [userInfo]);

    const addEmoji = (e) => {
        let emoji = e.native;
        setMessage((prevMessage) => prevMessage + emoji);
    };

    useEffect(() => {
        dispatch(
            add_chat_friend({
                sellerId: sellerId || "",
                customerId: userInfo.id,
            })
        );
    }, [dispatch, sellerId, userInfo.id]);

    const handleSendMesaage = () => {
        if (message || selectedFile) {
            const formData = new FormData();
            formData.append("message", message);
            formData.append("file", selectedFile);
            formData.append("customerId", userInfo.id);
            formData.append("customer_name", userInfo.name);
            formData.append("sellerId", sellerId);
            dispatch(send_message(formData));
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
        // Khi vào màn hình chat
        setIsViewingMessages(true);
        
        // Kiểm tra và cập nhật trạng thái các tin nhắn chưa đọc
        if (messages && Array.isArray(messages) && messages.length > 0) {
            messages.forEach(msg => {
                if (msg.senderId === sellerId && msg.status !== 'seen') {
                    socket.emit("message_seen", msg._id, msg.senderId);
                }
            });
        }

        // Khi rời khỏi màn hình chat
        return () => {
            setIsViewingMessages(false);
        };
    }, [sellerId, messages]);

    useEffect(() => {
        socket.on("seller_message", (msg) => {
            if (sellerId === msg.senderId && userInfo.id === msg.receiverId) {
                dispatch(update_message(msg));
                // Gửi xác nhận đã nhận tin nhắn ngay lập tức
                socket.emit("message_delivered", msg._id);
                
                // Nếu đang xem tin nhắn, đánh dấu là đã xem
                if (isViewingMessages) {
                    socket.emit("message_seen", msg._id, msg.senderId);
                }
            } else {
                toast.success("Bạn có tin nhắn mới");
            }
            notification();
        });

        // Lắng nghe sự kiện cập nhật trạng thái
        socket.on('message_status_update', ({ messageId, status }) => {
            dispatch(update_message_status({ messageId, status }));
        });

        socket.on("active_seller", (sellers) => {
            setActiveSeller(sellers);
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

        return () => {
            socket.off("seller_message");
            socket.off("message_status_update");
            socket.off("active_seller");
            socket.off("typing_start_receive");
            socket.off("typing_stop_receive");
        };
    }, [sellerId, dispatch, userInfo.id, isViewingMessages]);

    // Gửi tin nhắn realtime từ customer sang seller
    useEffect(() => {
        if (success_message) {
            const lastMessage = messages[messages.length - 1];
            socket.emit("send_message_customer_to_seller", {
                ...lastMessage,
                status: 'sent'
            });
            dispatch(message_clear());
        }
    }, [messages, dispatch, success_message]);

    // Xử lý typing
    const handleTyping = (e) => {
        setMessage(e.target.value);
        
        // Gửi sự kiện typing
        socket.emit("typing_start", {
            senderId: userInfo.id,
            receiverId: sellerId
        });

        // Clear timeout cũ nếu có
        if (typingTimeout) clearTimeout(typingTimeout);

        // Set timeout mới
        const timeout = setTimeout(() => {
            socket.emit("typing_stop", {
                senderId: userInfo.id,
                receiverId: sellerId
            });
        }, 1000);

        setTypingTimeout(timeout);
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    return (
        <div className="bg-white h-screen flex flex-col">
            {/* Mobile Header */}
            <div className="h-14 border-b flex items-center px-4 justify-between">
                <button 
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="text-gray-600 p-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <h1 className="text-base font-semibold">Chat với người bán</h1>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Sidebar - Fullscreen on mobile */}
                <div 
                    className={`
                        absolute inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out
                        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
                    `}
                >
                    <div className="flex flex-col h-full bg-gray-50">
                        <div className="p-4 bg-white">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-700">Liên hệ người bán</h2>
                                <button 
                                    onClick={() => setShowSidebar(false)}
                                    className="text-gray-500 p-2"
                                >
                                    <IoMdClose size={24} />
                                </button>
                            </div>
                    </div>
                        <div className="flex-1 overflow-y-auto">
                        {my_friends.map((f, index) => (
                            <Link
                                key={index}
                                to={`/dashboard/chat/${f.friendId}`}
                                    onClick={() => setShowSidebar(false)}
                                    className={`
                                        flex items-center gap-3 p-4 bg-white mb-[1px]
                                        ${sellerId === f.friendId ? "bg-blue-50" : ""}
                                    `}
                            >
                                <div className="relative">
                                    <img
                                            className="w-12 h-12 rounded-full object-cover"
                                        src={f?.avatar}
                                        alt=""
                                    />
                                    {activeSeller.some((c) => c.sellerId === f.friendId) && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                    )}
                                </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-medium text-gray-900 truncate">{f?.shop_name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {activeSeller.some((c) => c.sellerId === f.friendId) 
                                                ? "Đang hoạt động"
                                                : "Không hoạt động"
                                            }
                                        </p>
                                </div>
                            </Link>
                        ))}
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {current_friend ? (
                        <>
                            {/* Chat Header */}
                            <div className="bg-white border-b flex items-center px-4 py-2">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img
                                            className="w-10 h-10 rounded-full object-cover"
                                            src={current_friend?.avatar}
                                            alt=""
                                        />
                                        {activeSeller.some((c) => c.sellerId === current_friend.friendId) && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-base font-medium text-gray-900">{current_friend?.shop_name}</h2>
                                        <p className="text-xs text-gray-500">
                                            {activeSeller.some((c) => c.sellerId === current_friend.friendId)
                                                ? "Đang hoạt động"
                                                : "Không hoạt động"
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                                <div className="space-y-4">
                                    {messages.map((m, index) => {
                                        const isSender = current_friend.friendId === m.receiverId;
                                        return (
                                            <div
                                                key={index}
                                                ref={scrollRef}
                                                className={`flex gap-2 ${isSender ? 'justify-end' : 'justify-start'}`}
                                            >
                                                {!isSender && (
                                                    <img
                                                        className="w-8 h-8 rounded-full object-cover"
                                                        src={current_friend?.avatar}
                                                        alt=""
                                                    />
                                                )}
                                                <div className={`max-w-[70%] ${isSender ? 'items-end' : 'items-start'}`}>
                                                    <div 
                                                        className={`
                                                            rounded-2xl p-2.5
                                                            ${isSender 
                                                                ? 'bg-blue-500 text-white rounded-br-none' 
                                                                : 'bg-white text-gray-900 rounded-bl-none'
                                                            }
                                                        `}
                                                    >
                                                        <p className="text-sm break-words">{m?.message}</p>
                                                        {m.file && (
                                                            <div className="mt-1 rounded-lg overflow-hidden">
                                                                <img
                                                                    src={m.file}
                                                                    alt=""
                                                                    className="max-w-full h-auto"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="mt-1 flex items-center gap-1">
                                                        <span className="text-[11px] text-gray-600 font-medium">
                                                            {formatDate(m.createdAt)}
                                                        </span>
                                                        {isSender && (
                                                            <span className="text-[11px] text-gray-600">
                                                                {m.status === 'sent' && 'Đã gửi'}
                                                                {m.status === 'delivered' && 'Đã nhận'}
                                                                {m.status === 'seen' && (
                                                                    <span className="text-blue-500">Đã xem</span>
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {isSender && (
                                                    <img
                                                        className="w-8 h-8 rounded-full object-cover"
                                                        src={userInfo.avatar}
                                                        alt=""
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Typing Indicator - Fixed position above input */}
                            {isTyping && (
                                <div className="bg-gray-50 border-t px-4 py-2">
                                    <div className="flex items-center gap-2">
                                        <img
                                            className="w-8 h-8 rounded-full object-cover"
                                            src={current_friend?.avatar}
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
                            <div className="bg-white p-2">
                            {fileName && (
                                    <div className="mx-2 mb-2 bg-blue-50 text-blue-700 rounded-lg px-3 py-2 flex items-center justify-between">
                                        <span className="truncate text-sm">{fileName}</span>
                                        <button
                                        onClick={() => {
                                            setSelectedFile(null);
                                            setFileName("");
                                        }}
                                            className="ml-2 text-blue-500"
                                        >
                                            <IoMdClose size={18} />
                                        </button>
                                </div>
                            )}
                                <div className="flex items-center gap-2 px-2">
                                    <label 
                                        htmlFor="file" 
                                        className="p-2"
                                    >
                                        <AiOutlinePlus className="text-blue-500" size={24} />
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
                                        className="w-full rounded-full bg-gray-100 px-4 py-2 pr-10 focus:outline-none"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleSendMesaage();
                                            }
                                        }}
                                    />
                                        <button
                                        onClick={() => setShowEmoji(!showEmoji)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
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
                                    onClick={handleSendMesaage}
                                        className="p-2 text-blue-500"
                                >
                                        <IoSend size={24} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-gray-50">
                            <div className="text-center">
                                <div className="text-gray-400 mb-2">
                                    <BsEmojiSmile size={40} className="mx-auto" />
                                </div>
                                <p className="text-gray-500">Chọn một người bán để bắt đầu trò chuyện</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;

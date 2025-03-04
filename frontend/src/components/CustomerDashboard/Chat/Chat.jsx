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
        socket.on("seller_message", (msg) => {
            setReceiveMessage(msg);
            notification();
        });
        socket.on("active_seller", (sellers) => {
            setActiveSeller(sellers);
        });
    }, [notification]);

    useEffect(() => {
        if (receiveMessage) {
            if (
                sellerId === receiveMessage.senderId &&
                userInfo.id === receiveMessage.receiverId
            ) {
                dispatch(update_message(receiveMessage));
                notification();
            } else {
                toast.success("Bạn có tin nhắn mới");
                dispatch(message_clear());
                notification();
            }
        }
    }, [dispatch, notification, receiveMessage, sellerId, userInfo.id]);

    useEffect(() => {
        if (success_message) {
            socket.emit(
                "send_message_customer_to_seller",
                messages[messages.length - 1]
            );
            dispatch(message_clear());
        }
    }, [dispatch, messages, success_message]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    return (
        <div className="bg-white p-3 rounded-md">
            <div className="w-full flex">
                <div className="w-[230px]">
                    <div className="flex justify-start gap-3 items-center text-slate-600 text-xl h-[50px]">
                        <span className="font-semibold text-slate-500">
                          Liên hệ người bán
                        </span>
                    </div>
                    <div className="w-full flex flex-col text-slate-600 py-4 h-[500px] pr-3">
                        {my_friends.map((f, index) => (
                            <Link
                                key={index}
                                to={`/dashboard/chat/${f.friendId}`}
                                className={`h-[50px] flex justify-start gap-2 items-center px-2 py-2 rounded-md cursor-pointer ${
                                    sellerId === f.friendId ? "bg-gray-700 text-white" : ""
                                }`}
                            >
                                <div className="relative">
                                    <img
                                        className="w-[35px] h-[35px] border max-w-[35px] rounded-full"
                                        src={f?.avatar}
                                        alt=""
                                    />
                                    {activeSeller.some((c) => c.sellerId === f.friendId) && (
                                        <div
                                            className="w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0"></div>
                                    )}
                                </div>
                                <div className="flex justify-center items-start flex-col w-full">
                                    <div className="flex justify-between items-center w-full">
                                        <h2 className="text-sm">{f?.shop_name}</h2>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="w-[calc(100%-230px)]">
                    {current_friend ? (
                        <div className="w-full h-full">
                            <div className="flex justify-start gap-3 items-center text-slate-600 text-xl h-[50px]">
                                <div className="flex justify-start items-center gap-3">
                                    <div className="relative">
                                        <img
                                            className="w-[38px] h-[38px] border-green-500 border max-w-[38px] p-[2px] rounded-full"
                                            src={current_friend?.avatar}
                                            alt=""
                                        />
                                        {activeSeller.some(
                                            (c) => c.sellerId === current_friend.friendId
                                        ) && (
                                            <div
                                                className="w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0"></div>
                                        )}
                                    </div>
                                    <h2 className="text-base font-semibold">
                                        {current_friend?.shop_name}
                                    </h2>
                                </div>
                            </div>
                            <div className="py-4">
                                <div className="bg-[#dae1e7] h-[calc(100vh-200px)] rounded-md p-3 overflow-y-auto">
                                    {messages.map((m, index) => {
                                        if (current_friend.friendId !== m.receiverId) {
                                            return (
                                                <div
                                                    key={index}
                                                    ref={scrollRef}
                                                    className="flex justify-start gap-2.5 mb-5"
                                                >
                                                    <img
                                                        className="w-8 h-8 rounded-full"
                                                        src={current_friend?.avatar}
                                                        alt="Bonnie Green image"
                                                    />
                                                    <div className="flex flex-col gap-1">
                                                        <div
                                                            className="flex flex-col w-full max-w-[300px] h-auto leading-1.5 p-3 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                                                            <div
                                                                className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                                                                <span
                                                                    className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                  {current_friend?.shop_name}
                                                                </span>
                                                                <span
                                                                    className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                                                  {formatDate(m.createdAt)}
                                                                </span>
                                                            </div>
                                                            {m.file === null ? (
                                                                <p className="text-sm font-normal text-gray-900 dark:text-white block white-space-pre-wrap word-break-all">
                                                                    {m?.message}
                                                                </p>
                                                            ) : (
                                                                <>
                                                                    {" "}
                                                                    <p className="text-sm font-normal text-gray-900 dark:text-white block white-space-pre-wrap word-break-all">
                                                                        {m?.message}
                                                                    </p>
                                                                    {(() => {
                                                                        if (m && m.file) {
                                                                            const url = m.file;
                                                                            const fileName = url.split("?")[0];
                                                                            const fileExtension = fileName
                                                                                .split(".")
                                                                                .pop()
                                                                                .toLowerCase();

                                                                            if (
                                                                                fileExtension === "png" ||
                                                                                fileExtension === "jpg" ||
                                                                                fileExtension === "jpeg" ||
                                                                                fileExtension === "webp"
                                                                            ) {
                                                                                return (
                                                                                    <a
                                                                                        href={m?.file}
                                                                                        download
                                                                                        className="group relative my-2.5"
                                                                                    >
                                                                                        <div
                                                                                            className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                                                                            <button
                                                                                                data-tooltip-target="download-image"
                                                                                                className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50"
                                                                                            >
                                                                                                <svg
                                                                                                    className="w-5 h-5 text-white"
                                                                                                    aria-hidden="true"
                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                    fill="none"
                                                                                                    viewBox="0 0 16 18"
                                                                                                >
                                                                                                    <path
                                                                                                        stroke="currentColor"
                                                                                                        strokeLinecap="round"
                                                                                                        strokeLinejoin="round"
                                                                                                        strokeWidth={2}
                                                                                                        d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
                                                                                                    />
                                                                                                </svg>
                                                                                            </button>
                                                                                            <div
                                                                                                id="download-image"
                                                                                                role="tooltip"
                                                                                                className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                                                                                            >
                                                                                                Xem ảnh
                                                                                                <div
                                                                                                    className="tooltip-arrow"
                                                                                                    data-popper-arrow=""
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                        <img
                                                                                            src={m?.file}
                                                                                            className="rounded-lg"
                                                                                            alt=""/>
                                                                                    </a>
                                                                                );
                                                                            } else {
                                                                                return (
                                                                                    <a
                                                                                        href={m.file}
                                                                                        download={m.file}
                                                                                        className="group relative my-2.5"
                                                                                    >
                                                                                        <div
                                                                                            className="flex items-start my-2.5 bg-gray-50 dark:bg-gray-600 rounded-xl p-2">
                                                                                            <div className="me-2">
                                                                                                <span
                                                                                                    className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white pb-2">
                                                                                                  <svg
                                                                                                      height="200px"
                                                                                                      width="200px"
                                                                                                      version="1.1"
                                                                                                      id="Layer_1"
                                                                                                      xmlns="http://www.w3.org/2000/svg"
                                                                                                      xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                                                      viewBox="0 0 503.467 503.467"
                                                                                                      xmlSpace="preserve"
                                                                                                      fill="#000000"
                                                                                                      className="w-5 h-5 flex-shrink-0"
                                                                                                  >
                                                                                                    <g
                                                                                                        id="SVGRepo_bgCarrier"
                                                                                                        strokeWidth={0}
                                                                                                    />
                                                                                                    <g
                                                                                                        id="SVGRepo_tracerCarrier"
                                                                                                        strokeLinecap="round"
                                                                                                        strokeLinejoin="round"
                                                                                                    />
                                                                                                    <g id="SVGRepo_iconCarrier">
                                                                                                      <g transform="translate(5 1)">
                                                                                                        <path
                                                                                                            style={{
                                                                                                                fill: "#F2EDDA",
                                                                                                            }}
                                                                                                            d="M460.067,122.733v341.333c0,18.773-15.36,34.133-34.133,34.133h-358.4 c-18.773,0-34.133-15.36-34.133-34.133V37.4c0-18.773,15.36-34.133,34.133-34.133H340.6V88.6c0,18.773,15.36,34.133,34.133,34.133 H460.067z"
                                                                                                        />

                                                                                                        <path
                                                                                                            style={{
                                                                                                                fill: "#FFD0A1",
                                                                                                            }}
                                                                                                            d="M460.067,122.733h-85.333c-18.773,0-34.133-15.36-34.133-34.133V3.267L460.067,122.733z"
                                                                                                        />

                                                                                                        <path
                                                                                                            style={{
                                                                                                                fill: "#FFE079",
                                                                                                            }}
                                                                                                            d="M168.227,396.653L246.733,319v110.933C216.013,429.933,187.853,417.133,168.227,396.653 L168.227,396.653z"
                                                                                                        />

                                                                                                        <path
                                                                                                            style={{
                                                                                                                fill: "#80D6FA",
                                                                                                            }}
                                                                                                            d="M246.733,319h110.933c0,61.44-49.493,110.933-110.933,110.933V319z"
                                                                                                        />

                                                                                                        <path
                                                                                                            style={{
                                                                                                                fill: "#FF7474",
                                                                                                            }}
                                                                                                            d="M357.667,319H246.733l-78.507,77.653l0,0c-19.627-20.48-32.427-47.787-32.427-78.507 c0-61.44,49.493-110.933,110.933-110.933c49.493,0,91.307,32.427,105.813,76.8C352.547,284.867,357.667,299.373,357.667,319"
                                                                                                        />
                                                                                                      </g>

                                                                                                      <path
                                                                                                          style={{
                                                                                                              fill: "#51565F",
                                                                                                          }}
                                                                                                          d="M430.933,503.467h-358.4c-21.333,0-38.4-17.067-38.4-38.4V38.4C34.133,17.067,51.2,0,72.533,0H345.6 c0.853,0,2.56,0.853,3.413,0.853l85.333,85.333c1.707,1.707,1.707,4.267,0,5.973c-1.707,1.707-4.267,1.707-5.973,0l-84.48-84.48 H72.533c-16.213,0-29.867,13.653-29.867,29.867v426.667c0,16.213,13.653,29.867,29.867,29.867h358.4 c16.213,0,29.867-13.653,29.867-29.867V127.147h-81.067c-21.333,0-38.4-17.067-38.4-38.4V46.08c0-2.56,1.707-4.267,4.267-4.267 s4.267,1.707,4.267,4.267v42.667c0,16.213,13.653,29.867,29.867,29.867h85.333c2.56,0,4.267,1.707,4.267,4.267v341.333 C469.333,486.4,452.267,503.467,430.933,503.467z M251.733,435.2c-63.147,0-115.2-52.053-115.2-115.2s52.053-115.2,115.2-115.2 c50.347,0,93.867,32.427,109.227,79.36c0.853,2.56-0.853,4.267-2.56,5.12c-2.56,0.853-4.267-0.853-5.12-2.56 c-14.507-44.373-55.467-74.24-101.547-74.24c-58.88,0-106.667,47.787-106.667,106.667c0,28.16,11.093,52.907,28.16,71.68 l75.947-75.093c0.853-0.853,1.707-0.853,3.413-0.853l0,0l0,0H363.52c2.56,0,4.267,1.707,4.267,4.267 C366.933,383.147,314.88,435.2,251.733,435.2z M256,324.267v102.4c55.467-2.56,99.84-46.933,102.4-102.4H256z M179.2,398.507 c17.92,17.067,41.813,27.307,68.267,28.16V330.24L179.2,398.507z"
                                                                                                      />
                                                                                                    </g>
                                                                                                  </svg>

                                                                                                  <span
                                                                                                      className="block overflow-hidden whitespace-nowrap overflow-ellipsis w-[200px]">
                                                                                                    {fileName}
                                                                                                  </span>
                                                                                                </span>
                                                                                                <span
                                                                                                    className="flex text-xs font-normal text-gray-500 dark:text-gray-400 gap-2">
                                                                                                  12 Pages
                                                                                                  <svg
                                                                                                      xmlns="http://www.w3.org/2000/svg"
                                                                                                      aria-hidden="true"
                                                                                                      className="self-center"
                                                                                                      width={3}
                                                                                                      height={4}
                                                                                                      viewBox="0 0 3 4"
                                                                                                      fill="none"
                                                                                                  >
                                                                                                    <circle
                                                                                                        cx="1.5"
                                                                                                        cy={2}
                                                                                                        r="1.5"
                                                                                                        fill="#6B7280"
                                                                                                    />
                                                                                                  </svg>
                                                                                                  Dung lượng: 18 MB
                                                                                                  <svg
                                                                                                      xmlns="http://www.w3.org/2000/svg"
                                                                                                      aria-hidden="true"
                                                                                                      className="self-center"
                                                                                                      width={3}
                                                                                                      height={4}
                                                                                                      viewBox="0 0 3 4"
                                                                                                      fill="none"
                                                                                                  >
                                                                                                    <circle
                                                                                                        cx="1.5"
                                                                                                        cy={2}
                                                                                                        r="1.5"
                                                                                                        fill="#6B7280"
                                                                                                    />
                                                                                                  </svg>
                                                                                                  File
                                                                                                </span>
                                                                                            </div>
                                                                                            <div
                                                                                                className="inline-flex self-center items-center">
                                                                                                <button
                                                                                                    className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
                                                                                                    type="button"
                                                                                                >
                                                                                                    <svg
                                                                                                        className="w-4 h-4 text-gray-900 dark:text-white"
                                                                                                        aria-hidden="true"
                                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                                        fill="currentColor"
                                                                                                        viewBox="0 0 20 20"
                                                                                                    >
                                                                                                        <path
                                                                                                            d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z"/>
                                                                                                        <path
                                                                                                            d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
                                                                                                    </svg>
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </a>
                                                                                );
                                                                            }
                                                                        }
                                                                    })()}
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
                                                        <div
                                                            className="flex flex-col w-full max-w-[300px] h-auto leading-1.5 p-3 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                                                            <div
                                                                className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                                                                <span
                                                                    className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                  {m.senderName}
                                                                </span>
                                                                <span
                                                                    className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                                                  {formatDate(m.createdAt)}
                                                                </span>
                                                            </div>
                                                            {m.file === null ? (
                                                                <p className="text-sm font-normal text-gray-900 dark:text-white block white-space-pre-wrap word-break-all">
                                                                    {m?.message}
                                                                </p>
                                                            ) : (
                                                                <>
                                                                    {" "}
                                                                    <p className="text-sm font-normal text-gray-900 dark:text-white block white-space-pre-wrap word-break-all">
                                                                        {m?.message}
                                                                    </p>
                                                                    {(() => {
                                                                        if (m && m.file) {
                                                                            const url = m.file;
                                                                            const fileName = url.split("?")[0];
                                                                            const fileExtension = fileName
                                                                                .split(".")
                                                                                .pop()
                                                                                .toLowerCase();

                                                                            if (
                                                                                fileExtension === "png" ||
                                                                                fileExtension === "jpg" ||
                                                                                fileExtension === "jpeg" ||
                                                                                fileExtension === "webp"
                                                                            ) {
                                                                                return (
                                                                                    <a
                                                                                        href={m?.file}
                                                                                        download
                                                                                        className="group relative my-2.5"
                                                                                    >
                                                                                        <div
                                                                                            className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                                                                            <button
                                                                                                data-tooltip-target="download-image"
                                                                                                className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50"
                                                                                            >
                                                                                                <svg
                                                                                                    className="w-5 h-5 text-white"
                                                                                                    aria-hidden="true"
                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                    fill="none"
                                                                                                    viewBox="0 0 16 18"
                                                                                                >
                                                                                                    <path
                                                                                                        stroke="currentColor"
                                                                                                        strokeLinecap="round"
                                                                                                        strokeLinejoin="round"
                                                                                                        strokeWidth={2}
                                                                                                        d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
                                                                                                    />
                                                                                                </svg>
                                                                                            </button>
                                                                                            <div
                                                                                                id="download-image"
                                                                                                role="tooltip"
                                                                                                className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                                                                                            >
                                                                                                Xem ảnh
                                                                                                <div
                                                                                                    className="tooltip-arrow"
                                                                                                    data-popper-arrow=""
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                        <img
                                                                                            src={m?.file}
                                                                                            className="rounded-lg"
                                                                                            alt=""/>
                                                                                    </a>
                                                                                );
                                                                            } else {
                                                                                return (
                                                                                    <a
                                                                                        href={m.file}
                                                                                        download={m.file}
                                                                                        className="group relative my-2.5"
                                                                                    >
                                                                                        <div
                                                                                            className="flex items-start my-2.5 bg-gray-50 dark:bg-gray-600 rounded-xl p-2">
                                                                                            <div className="me-2">
                                                                                                <span
                                                                                                    className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white pb-2">
                                                                                                  <svg
                                                                                                      height="200px"
                                                                                                      width="200px"
                                                                                                      version="1.1"
                                                                                                      id="Layer_1"
                                                                                                      xmlns="http://www.w3.org/2000/svg"
                                                                                                      xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                                                      viewBox="0 0 503.467 503.467"
                                                                                                      xmlSpace="preserve"
                                                                                                      fill="#000000"
                                                                                                      className="w-5 h-5 flex-shrink-0"
                                                                                                  >
                                                                                                    <g
                                                                                                        id="SVGRepo_bgCarrier"
                                                                                                        strokeWidth={0}
                                                                                                    />
                                                                                                    <g
                                                                                                        id="SVGRepo_tracerCarrier"
                                                                                                        strokeLinecap="round"
                                                                                                        strokeLinejoin="round"
                                                                                                    />
                                                                                                    <g id="SVGRepo_iconCarrier">
                                                                                                      <g transform="translate(5 1)">
                                                                                                        <path
                                                                                                            style={{
                                                                                                                fill: "#F2EDDA",
                                                                                                            }}
                                                                                                            d="M460.067,122.733v341.333c0,18.773-15.36,34.133-34.133,34.133h-358.4 c-18.773,0-34.133-15.36-34.133-34.133V37.4c0-18.773,15.36-34.133,34.133-34.133H340.6V88.6c0,18.773,15.36,34.133,34.133,34.133 H460.067z"
                                                                                                        />

                                                                                                        <path
                                                                                                            style={{
                                                                                                                fill: "#FFD0A1",
                                                                                                            }}
                                                                                                            d="M460.067,122.733h-85.333c-18.773,0-34.133-15.36-34.133-34.133V3.267L460.067,122.733z"
                                                                                                        />

                                                                                                        <path
                                                                                                            style={{
                                                                                                                fill: "#FFE079",
                                                                                                            }}
                                                                                                            d="M168.227,396.653L246.733,319v110.933C216.013,429.933,187.853,417.133,168.227,396.653 L168.227,396.653z"
                                                                                                        />

                                                                                                        <path
                                                                                                            style={{
                                                                                                                fill: "#80D6FA",
                                                                                                            }}
                                                                                                            d="M246.733,319h110.933c0,61.44-49.493,110.933-110.933,110.933V319z"
                                                                                                        />

                                                                                                        <path
                                                                                                            style={{
                                                                                                                fill: "#FF7474",
                                                                                                            }}
                                                                                                            d="M357.667,319H246.733l-78.507,77.653l0,0c-19.627-20.48-32.427-47.787-32.427-78.507 c0-61.44,49.493-110.933,110.933-110.933c49.493,0,91.307,32.427,105.813,76.8C352.547,284.867,357.667,299.373,357.667,319"
                                                                                                        />
                                                                                                      </g>

                                                                                                      <path
                                                                                                          style={{
                                                                                                              fill: "#51565F",
                                                                                                          }}
                                                                                                          d="M430.933,503.467h-358.4c-21.333,0-38.4-17.067-38.4-38.4V38.4C34.133,17.067,51.2,0,72.533,0H345.6 c0.853,0,2.56,0.853,3.413,0.853l85.333,85.333c1.707,1.707,1.707,4.267,0,5.973c-1.707,1.707-4.267,1.707-5.973,0l-84.48-84.48 H72.533c-16.213,0-29.867,13.653-29.867,29.867v426.667c0,16.213,13.653,29.867,29.867,29.867h358.4 c16.213,0,29.867-13.653,29.867-29.867V127.147h-81.067c-21.333,0-38.4-17.067-38.4-38.4V46.08c0-2.56,1.707-4.267,4.267-4.267 s4.267,1.707,4.267,4.267v42.667c0,16.213,13.653,29.867,29.867,29.867h85.333c2.56,0,4.267,1.707,4.267,4.267v341.333 C469.333,486.4,452.267,503.467,430.933,503.467z M251.733,435.2c-63.147,0-115.2-52.053-115.2-115.2s52.053-115.2,115.2-115.2 c50.347,0,93.867,32.427,109.227,79.36c0.853,2.56-0.853,4.267-2.56,5.12c-2.56,0.853-4.267-0.853-5.12-2.56 c-14.507-44.373-55.467-74.24-101.547-74.24c-58.88,0-106.667,47.787-106.667,106.667c0,28.16,11.093,52.907,28.16,71.68 l75.947-75.093c0.853-0.853,1.707-0.853,3.413-0.853l0,0l0,0H363.52c2.56,0,4.267,1.707,4.267,4.267 C366.933,383.147,314.88,435.2,251.733,435.2z M256,324.267v102.4c55.467-2.56,99.84-46.933,102.4-102.4H256z M179.2,398.507 c17.92,17.067,41.813,27.307,68.267,28.16V330.24L179.2,398.507z"
                                                                                                      />
                                                                                                    </g>
                                                                                                  </svg>

                                                                                                  <span
                                                                                                      className="block overflow-hidden whitespace-nowrap overflow-ellipsis w-[200px]">
                                                                                                    {fileName}
                                                                                                  </span>
                                                                                                </span>
                                                                                                <span
                                                                                                    className="flex text-xs font-normal text-gray-500 dark:text-gray-400 gap-2">
                                                                                                  12 Pages
                                                                                                  <svg
                                                                                                      xmlns="http://www.w3.org/2000/svg"
                                                                                                      aria-hidden="true"
                                                                                                      className="self-center"
                                                                                                      width={3}
                                                                                                      height={4}
                                                                                                      viewBox="0 0 3 4"
                                                                                                      fill="none"
                                                                                                  >
                                                                                                    <circle
                                                                                                        cx="1.5"
                                                                                                        cy={2}
                                                                                                        r="1.5"
                                                                                                        fill="#6B7280"
                                                                                                    />
                                                                                                  </svg>
                                                                                                  Dung lượng: 18 MB
                                                                                                  <svg
                                                                                                      xmlns="http://www.w3.org/2000/svg"
                                                                                                      aria-hidden="true"
                                                                                                      className="self-center"
                                                                                                      width={3}
                                                                                                      height={4}
                                                                                                      viewBox="0 0 3 4"
                                                                                                      fill="none"
                                                                                                  >
                                                                                                    <circle
                                                                                                        cx="1.5"
                                                                                                        cy={2}
                                                                                                        r="1.5"
                                                                                                        fill="#6B7280"
                                                                                                    />
                                                                                                  </svg>
                                                                                                  File
                                                                                                </span>
                                                                                            </div>
                                                                                            <div
                                                                                                className="inline-flex self-center items-center">
                                                                                                <button
                                                                                                    className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
                                                                                                    type="button"
                                                                                                >
                                                                                                    <svg
                                                                                                        className="w-4 h-4 text-gray-900 dark:text-white"
                                                                                                        aria-hidden="true"
                                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                                        fill="currentColor"
                                                                                                        viewBox="0 0 20 20"
                                                                                                    >
                                                                                                        <path
                                                                                                            d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z"/>
                                                                                                        <path
                                                                                                            d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
                                                                                                    </svg>
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </a>
                                                                                );
                                                                            }
                                                                        }
                                                                    })()}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <img
                                                        className="w-8 h-8 rounded-full"
                                                        src={userInfo.avatar}
                                                        alt="Bonnie Green image"
                                                    />
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                            {fileName && (
                                <div
                                    className="ml-14 mt-2 bg-gray-600 text-white rounded-lg px-3 py-1 inline-flex items-center">
                                    {fileName}
                                    <IoMdClose
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
                                    <div
                                        className="w-[40px] h-[40px] border-2 p-2 justify-center items-center flex rounded-full border-blue-500">
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
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Nhập tin nhắn ..."
                                        className="w-full rounded-full h-full outline-none p-3 pl-6"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleSendMesaage();
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
                                    onClick={handleSendMesaage}
                                    className="w-[40px] p-2 rounded-full"
                                >
                                    <div className="text-2xl cursor-pointer hover:text-blue-300 text-blue-600">
                                        <IoSend/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="w-full h-full flex justify-center items-center flex-col text-lg text-white font-bold bg-[#b3b3b3]">
                            <span>
                                <BsEmojiSmile size={25}/>
                            </span>
                            <span>Chọn nhà cung cấp để trò chuyện</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;

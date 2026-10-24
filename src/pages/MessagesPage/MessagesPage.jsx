import Container from "../../modules/Container/Container";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { getConversationByUserId } from "../../redux/messages/messages-thunks";

import { Link } from "react-router-dom";

import { addMessageLocal } from "../../redux/messages/messages-slice";

import { getAllUsers } from "../../redux/users/users-thunks";
import { getCurrentUserById } from "../../redux/users/users-thunks";
import { getAllUsersSelector } from "../../redux/users/users-selectors";
import { getCurrentUserSelector } from "../../redux/users/users-selectors";
import { addMessage } from "../../redux/messages/messages-thunks";

import { getConversationByUserIdSelector } from "../../redux/messages/messages-selectors";
import getPersistedUserIdFromToken from "../../shared/utils/getUserIdFromToken";
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import ChatRooms from "../../modules/ChatRooms/ChatRooms";
import avatar from "../../assets/img/postAvatar.jpg";
import styles from "./MessagesPage.module.css";

const socket = io(import.meta.env.VITE_WEBSOCKET_URL, {
    auth: { token: localStorage.getItem("token") }
});

const MOBILE_MQ = "(max-width: 767px)";
const getSelectedChatStorageKey = (userId) => `ichgram:selectedChat:${userId}`;
const getMobileChatOpenStorageKey = (userId) => `ichgram:mobileChatOpen:${userId}`;

const MessagesPage = () => {
    const currentUserId = getPersistedUserIdFromToken();
    const dispatch = useDispatch();

    const { register, reset, handleSubmit } = useForm();

    const users = useSelector(getAllUsersSelector);
    const currentUser = useSelector(getCurrentUserSelector);
    const { conversations } = useSelector(getConversationByUserIdSelector);

    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== "undefined" ? window.matchMedia(MOBILE_MQ).matches : false
    );

    const [selectedUserId, setSelectedUserId] = useState(() => {
        if (!currentUserId) return null;
        return sessionStorage.getItem(getSelectedChatStorageKey(currentUserId));
    });

    const [mobileShowChat, setMobileShowChat] = useState(() => {
        if (!currentUserId || typeof window === "undefined") return false;
        if (!window.matchMedia(MOBILE_MQ).matches) return false;
        const savedUserId = sessionStorage.getItem(getSelectedChatStorageKey(currentUserId));
        const chatWasOpen = sessionStorage.getItem(getMobileChatOpenStorageKey(currentUserId)) === "1";
        return Boolean(savedUserId && chatWasOpen);
    });

    const handleSelectUser = (userId) => {
        setSelectedUserId(userId);
        if (currentUserId && userId) {
            sessionStorage.setItem(getSelectedChatStorageKey(currentUserId), userId);
        }
        if (window.matchMedia(MOBILE_MQ).matches) {
            setMobileShowChat(true);
            if (currentUserId) {
                sessionStorage.setItem(getMobileChatOpenStorageKey(currentUserId), "1");
            }
        }
    };

    const handleBackToList = () => {
        setMobileShowChat(false);
        if (currentUserId) {
            sessionStorage.setItem(getMobileChatOpenStorageKey(currentUserId), "0");
        }
    };

    useEffect(() => {
        const mediaQuery = window.matchMedia(MOBILE_MQ);
        const onChange = (event) => {
            setIsMobile(event.matches);
            if (!event.matches) {
                setMobileShowChat(false);
            }
        };

        mediaQuery.addEventListener("change", onChange);
        return () => mediaQuery.removeEventListener("change", onChange);
    }, []);

    useEffect(() => {
        socket.on("connect", () => {
            socket.emit("join", currentUserId);
        });

        socket.on("new_message", (message) => {
            dispatch(addMessageLocal({ ...message, currentUserId }));
        });

        socket.on("message_sent", (message) => {
            dispatch(addMessageLocal({ ...message, currentUserId }));
        });

        return () => {
            socket.off("connect");
            socket.off("new_message");
            socket.off("message_sent");
        };
    }, [currentUserId, dispatch]);

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getCurrentUserById(currentUserId));
    }, [dispatch, currentUserId]);

    useEffect(() => {
        if (selectedUserId) {
            dispatch(getConversationByUserId(selectedUserId));
        }
    }, [selectedUserId, dispatch]);

    useEffect(() => {
        if (!users.length || !currentUserId) return;

        const chatUsers = users.filter((user) => user._id !== currentUserId);
        if (!chatUsers.length) {
            setSelectedUserId(null);
            setMobileShowChat(false);
            sessionStorage.setItem(getMobileChatOpenStorageKey(currentUserId), "0");
            return;
        }

        const storageKey = getSelectedChatStorageKey(currentUserId);
        const mobileOpenKey = getMobileChatOpenStorageKey(currentUserId);
        const savedUserId = sessionStorage.getItem(storageKey);
        const savedUserExists = chatUsers.some((user) => user._id === savedUserId);

        if (savedUserExists) {
            setSelectedUserId(savedUserId);
            if (window.matchMedia(MOBILE_MQ).matches && sessionStorage.getItem(mobileOpenKey) === "1") {
                setMobileShowChat(true);
            }
            return;
        }

        setSelectedUserId((prev) => {
            if (prev && chatUsers.some((user) => user._id === prev)) {
                return prev;
            }
            setMobileShowChat(false);
            sessionStorage.setItem(mobileOpenKey, "0");
            if (window.matchMedia(MOBILE_MQ).matches) {
                return prev;
            }
            const fallbackId = chatUsers[0]._id;
            sessionStorage.setItem(storageKey, fallbackId);
            return fallbackId;
        });
    }, [users, currentUserId]);

    const messages = conversations[selectedUserId] || [];
    const selectedUser = users?.find((user) => user._id === selectedUserId);
    const mobileViewClass = isMobile
        ? (mobileShowChat ? styles.chatView : styles.listView)
        : "";

    const onSubmit = (data) => {
        if (!selectedUserId) return;
        dispatch(addMessage({
            recipientId: selectedUserId,
            payload: { message: data.message }
        }));
        reset();
    };

    return (
        <Container>
            <div className={`${styles.chatWrap} ${mobileViewClass}`}>
                <div className={styles.roomsPanel}>
                    <ChatRooms
                        selectedUserId={selectedUserId}
                        onSelectUser={handleSelectUser}
                        currentUserAvatar={currentUser?.avatar ? currentUser?.avatar : avatar}
                        currentUserUsername={currentUser?.username ? currentUser?.username : "username"}
                        currentUserId={currentUserId}
                    />
                </div>
                <div className={styles.chatBox}>
                    {!selectedUser ? (
                        <p className={styles.emptyChat}>Выберите пользователя, чтобы увидеть переписку</p>
                    ) : (
                        <>
                            <div className={styles.chatHead}>
                                <button
                                    type="button"
                                    className={styles.backBtn}
                                    onClick={handleBackToList}
                                    aria-label="Back to contacts"
                                >
                                    ←
                                </button>
                                <div className={styles.avatarHead}>
                                    <img src={selectedUser?.avatar ? selectedUser?.avatar : avatar} alt="avatar" />
                                </div>
                                <div className={styles.usernameHead}>{selectedUser.username}</div>
                            </div>
                            <div className={styles.chatContent}>
                                <div className={styles.userInfo}>
                                    <div className={styles.avatarMain}>
                                        <img src={selectedUser?.avatar ? selectedUser?.avatar : avatar} alt="avatar" />
                                    </div>
                                    <div className={styles.usernameMain}>{selectedUser.username}</div>
                                    <div className={styles.speakers}>{selectedUser.username} <span>{selectedUser.fullName}</span></div>
                                    <Link to={`/profile-other/${selectedUser._id}`}>
                                        <button type="button" className={styles.btn}>View profile</button>
                                    </Link>
                                    <div className={styles.date}>Jun 26, 2024, 08:49 PM.</div>
                                </div>

                                <div className={styles.messagesBlock}>
                                    {messages.map((msg) => {
                                        const isCurrentUser = msg.sender === currentUserId;
                                        return (
                                            <div
                                                key={msg._id}
                                                className={isCurrentUser ? styles.messageCurrentUser : styles.messageOtherUser}
                                            >
                                                {!isCurrentUser && (
                                                    <div className={styles.messageAvatar}>
                                                        <img
                                                            src={selectedUser?.avatar ? selectedUser?.avatar : avatar}
                                                            alt="avatar"
                                                        />
                                                    </div>
                                                )}
                                                <div className={isCurrentUser ? styles.messageTextCurrent : styles.messageTextOther}>
                                                    {msg.message}
                                                </div>
                                                {isCurrentUser && (
                                                    <div className={styles.messageAvatar}>
                                                        <img
                                                            src={currentUser?.avatar ? currentUser?.avatar : avatar}
                                                            alt="avatar"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className={styles.newMessage}>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className={styles.input}>
                                            <input {...register("message", { required: true })} type="text" placeholder="Write message" />
                                        </div>
                                        <button className={styles.button} type="submit">Send</button>
                                    </form>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default MessagesPage;

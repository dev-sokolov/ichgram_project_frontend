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
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

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
const getContactsScrollStorageKey = (userId) => `ichgram:contactsListScroll:${userId}`;

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

    const chatBoxRef = useRef(null);
    const chatContentRef = useRef(null);
    const messagesEndRef = useRef(null);
    const composerRef = useRef(null);
    const contactsListRef = useRef(null);
    const selectedUserIdRef = useRef(selectedUserId);
    const shouldFocusContactOnListRef = useRef(false);

    useEffect(() => {
        selectedUserIdRef.current = selectedUserId;
    }, [selectedUserId]);

    const saveContactsScroll = useCallback(() => {
        if (!currentUserId) return;
        const listEl = contactsListRef.current;
        if (!listEl) return;
        sessionStorage.setItem(getContactsScrollStorageKey(currentUserId), String(listEl.scrollTop));
    }, [currentUserId]);

    const applyContactsScroll = useCallback((scrollTop) => {
        const listEl = contactsListRef.current;
        if (!listEl || !Number.isFinite(scrollTop) || scrollTop < 0) return false;
        listEl.scrollTop = scrollTop;
        return Math.abs(listEl.scrollTop - scrollTop) < 2 || listEl.scrollTop > 0;
    }, []);

    const restoreContactsScroll = useCallback((options = {}) => {
        if (!currentUserId) return;
        const savedScroll = Number(sessionStorage.getItem(getContactsScrollStorageKey(currentUserId)));
        if (!Number.isFinite(savedScroll) || savedScroll < 0) return;

        const apply = () => {
            applyContactsScroll(savedScroll);
            if (options.focusUserId) {
                const contactEl = contactsListRef.current?.querySelector(
                    `[data-chat-user-id="${options.focusUserId}"]`
                );
                contactEl?.scrollIntoView({ behavior: "auto", block: "center", inline: "nearest" });
            }
        };

        apply();
        requestAnimationFrame(apply);
        setTimeout(apply, 50);
        setTimeout(apply, 120);
        setTimeout(apply, 250);
    }, [currentUserId, applyContactsScroll]);

    const scrollToLatestMessage = useCallback(() => {
        const chatContent = chatContentRef.current;
        const chatBox = chatBoxRef.current;

        if (chatContent) {
            chatContent.scrollTop = chatContent.scrollHeight;
        }
        if (chatBox) {
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
        composerRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
    }, []);

    const handleSelectUser = (userId) => {
        setSelectedUserId(userId);
        if (currentUserId && userId) {
            sessionStorage.setItem(getSelectedChatStorageKey(currentUserId), userId);
        }
        if (window.matchMedia(MOBILE_MQ).matches) {
            saveContactsScroll();
            if (currentUserId) {
                sessionStorage.setItem(getMobileChatOpenStorageKey(currentUserId), "1");
            }
            setMobileShowChat(true);
        }
    };

    const handleBackToList = () => {
        if (currentUserId) {
            sessionStorage.setItem(getMobileChatOpenStorageKey(currentUserId), "0");
        }
        shouldFocusContactOnListRef.current = true;
        setMobileShowChat(false);
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
        const previous = window.history.scrollRestoration;
        window.history.scrollRestoration = "manual";
        return () => {
            window.history.scrollRestoration = previous || "auto";
        };
    }, []);

    // Persist contacts list scrollTop on the list container itself
    useEffect(() => {
        const listEl = contactsListRef.current;
        if (!listEl || !currentUserId) return undefined;

        let ticking = false;
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                // Don't overwrite while chat covers the list on mobile — scrollTop is already saved
                if (!(isMobile && mobileShowChat)) {
                    saveContactsScroll();
                }
                ticking = false;
            });
        };

        listEl.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            if (!(isMobile && mobileShowChat)) {
                saveContactsScroll();
            }
            listEl.removeEventListener("scroll", onScroll);
        };
    }, [currentUserId, isMobile, mobileShowChat, users.length, saveContactsScroll]);

    // Restore list scroll after mount / return to Message
    useLayoutEffect(() => {
        if (!currentUserId || !users.length) return undefined;

        restoreContactsScroll();
        return () => {
            saveContactsScroll();
        };
    }, [currentUserId, users.length, restoreContactsScroll, saveContactsScroll]);

    // Prevent page scroll under chat overlay; keep list scrollTop intact
    useEffect(() => {
        if (!(isMobile && mobileShowChat)) return undefined;

        const { body } = document;
        const previousOverflow = body.style.overflow;
        body.style.overflow = "hidden";

        return () => {
            body.style.overflow = previousOverflow;
            if (shouldFocusContactOnListRef.current) {
                shouldFocusContactOnListRef.current = false;
                restoreContactsScroll({ focusUserId: selectedUserIdRef.current });
            }
        };
    }, [isMobile, mobileShowChat, restoreContactsScroll]);

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
    const isChatVisible = !isMobile || mobileShowChat;

    useEffect(() => {
        if (!isChatVisible || !selectedUserId) return undefined;

        const frameId = requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                scrollToLatestMessage();
            });
        });
        const timeouts = [50, 120, 250, 400].map((delay) =>
            setTimeout(scrollToLatestMessage, delay)
        );

        return () => {
            cancelAnimationFrame(frameId);
            timeouts.forEach(clearTimeout);
        };
    }, [isChatVisible, selectedUserId, messages.length, mobileShowChat, scrollToLatestMessage]);

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
                        ref={contactsListRef}
                        selectedUserId={selectedUserId}
                        onSelectUser={handleSelectUser}
                        currentUserUsername={currentUser?.username ? currentUser?.username : "username"}
                        currentUserId={currentUserId}
                    />
                </div>
                <div className={styles.chatBox} ref={chatBoxRef}>
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
                            <div className={styles.chatContent} ref={chatContentRef}>
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
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>
                            <div className={styles.newMessage} ref={composerRef}>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className={styles.input}>
                                        <input {...register("message", { required: true })} type="text" placeholder="Write message" />
                                    </div>
                                    <button className={styles.button} type="submit">Send</button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default MessagesPage;

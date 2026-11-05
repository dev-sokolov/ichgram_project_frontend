import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Container from "../../modules/Container/Container";
import { getShowcaseMessagesApi } from "../../shared/api/messages-api";
import { useAuthPrompt } from "../../shared/components/AuthPrompt/AuthPrompt";

import avatar from "../../assets/img/postAvatar.jpg";
import styles from "../MessagesPage/MessagesPage.module.css";
import roomStyles from "../../modules/ChatRooms/ChatRooms.module.css";

const MOBILE_MQ = "(max-width: 767px)";

const GuestMessagesPage = () => {
    const { requireAuth } = useAuthPrompt();
    const [showcase, setShowcase] = useState(null);
    const [error, setError] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== "undefined" ? window.matchMedia(MOBILE_MQ).matches : false
    );
    const [mobileShowChat, setMobileShowChat] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(MOBILE_MQ);
        const onChange = (event) => setIsMobile(event.matches);
        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, []);

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const data = await getShowcaseMessagesApi();
                if (!active) return;
                setShowcase(data);
                const firstContact = data.contacts?.[0];
                if (firstContact && !window.matchMedia(MOBILE_MQ).matches) {
                    setSelectedUserId(firstContact._id);
                }
            } catch (loadError) {
                if (!active) return;
                setError(loadError.response?.data?.message || "Demo dialogs are unavailable.");
            }
        };

        load();
        return () => {
            active = false;
        };
    }, []);

    const viewer = showcase?.viewer;
    const contacts = showcase?.contacts || [];
    const selectedUser = contacts.find((user) => user._id === selectedUserId);
    const messages = selectedUserId ? showcase?.conversations?.[selectedUserId] || [] : [];
    const mobileViewClass = isMobile ? (mobileShowChat ? styles.chatView : styles.listView) : "";

    const onSelectUser = (userId) => {
        setSelectedUserId(userId);
        if (isMobile) setMobileShowChat(true);
    };

    return (
        <Container>
            <div className={`${styles.chatWrap} ${mobileViewClass}`}>
                <div className={styles.roomsPanel}>
                    <div className={roomStyles.chatRoomsWrap}>
                        <div className={roomStyles.chatRoomsHead}>
                            {viewer?.username || "Sample dialogs"}
                        </div>
                        {contacts.map((user) => (
                            <div
                                key={user._id}
                                onClick={() => onSelectUser(user._id)}
                                className={`${roomStyles.chatElement} ${user._id === selectedUserId ? roomStyles.active : ""}`}
                            >
                                <div className={roomStyles.avatar}>
                                    <img src={user.avatar || avatar} alt="" />
                                </div>
                                <div className={roomStyles.content}>
                                    <div className={roomStyles.username}>{user.username}</div>
                                </div>
                            </div>
                        ))}
                        {!contacts.length && <p className={styles.emptyChat}>{error || "No sample dialogs yet."}</p>}
                    </div>
                </div>
                <div className={styles.chatBox}>
                    {!selectedUser ? (
                        <p className={styles.emptyChat}>Choose a sample conversation</p>
                    ) : (
                        <>
                            <div className={styles.chatHead}>
                                <button
                                    type="button"
                                    className={styles.backBtn}
                                    onClick={() => setMobileShowChat(false)}
                                    aria-label="Back to contacts"
                                >
                                    ←
                                </button>
                                <div className={styles.avatarHead}>
                                    <img src={selectedUser.avatar || avatar} alt="" />
                                </div>
                                <div className={styles.usernameHead}>{selectedUser.username}</div>
                            </div>
                            <div className={styles.chatContent}>
                                <div className={styles.userInfo}>
                                    <div className={styles.avatarMain}>
                                        <img src={selectedUser.avatar || avatar} alt="" />
                                    </div>
                                    <div className={styles.usernameMain}>{selectedUser.username}</div>
                                    <div className={styles.speakers}>{selectedUser.username} <span>{selectedUser.fullName}</span></div>
                                    <Link to={`/profile-other/${selectedUser._id}`}>
                                        <button type="button" className={styles.btn}>View profile</button>
                                    </Link>
                                </div>
                                <div className={styles.messagesBlock}>
                                    {messages.map((msg) => {
                                        const isViewer = String(msg.sender) === String(viewer?._id);
                                        return (
                                            <div
                                                key={msg._id}
                                                className={isViewer ? styles.messageCurrentUser : styles.messageOtherUser}
                                            >
                                                {!isViewer && (
                                                    <div className={styles.messageAvatar}>
                                                        <img src={selectedUser.avatar || avatar} alt="" />
                                                    </div>
                                                )}
                                                <div className={isViewer ? styles.messageTextCurrent : styles.messageTextOther}>
                                                    {msg.message}
                                                </div>
                                                {isViewer && (
                                                    <div className={styles.messageAvatar}>
                                                        <img src={viewer?.avatar || avatar} alt="" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className={styles.newMessage}>
                                <button type="button" className={styles.button} onClick={() => requireAuth()}>
                                    Sign in to send a message
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default GuestMessagesPage;

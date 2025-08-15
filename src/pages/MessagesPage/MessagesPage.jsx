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

const MessagesPage = () => {
    const currentUserId = getPersistedUserIdFromToken();
    const dispatch = useDispatch();

    const { register, reset, handleSubmit, formState: { errors } } = useForm();

    const users = useSelector(getAllUsersSelector);
    const currentUser = useSelector(getCurrentUserSelector);
    const { conversations } = useSelector(getConversationByUserIdSelector);

    const [selectedUserId, setSelectedUserId] = useState(null);

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
        if (users.length > 0) {
            setSelectedUserId(users[0]._id); 
        }
    }, [users]);

    const messages = conversations[selectedUserId] || [];
    const selectedUser = users?.find(user => user._id === selectedUserId);

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
            <div className={styles.chatWrap}>
                <ChatRooms
                    selectedUserId={selectedUserId}
                    onSelectUser={setSelectedUserId}
                    currentUserAvatar={currentUser?.avatar ? currentUser?.avatar : avatar}
                    currentUserUsername={currentUser?.username ? currentUser?.username : "username"}
                    currentUserId={currentUserId}
                />
                <div className={styles.chatBox}>
                    {!selectedUser ? (
                        <p style={{ padding: "20px" }}>Выберите пользователя, чтобы увидеть переписку</p>
                    ) : (
                        <>
                            <div className={styles.chatHead}>
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
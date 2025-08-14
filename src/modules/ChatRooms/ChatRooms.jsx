import { useSelector } from "react-redux";
import { getAllUsersSelector } from "../../redux/users/users-selectors";

import avatar from "../../assets/img/postAvatar.jpg";
import styles from "./ChatRooms.module.css";

const ChatRooms = ({ selectedUserId, onSelectUser, currentUserAvatar, currentUserUsername, currentUserId }) => {

    const users = useSelector(getAllUsersSelector);

    const visibleUsers = users?.filter(user => user._id !== currentUserId);

    const elements = visibleUsers.map(user => (
        <div
            key={user._id}
            onClick={() => onSelectUser(user._id)}
            className={`${styles.chatElement} ${user._id === selectedUserId ? styles.active : ''}`}
        >
            <div className={styles.avatar}>
                <img src={user?.avatar ? user?.avatar : avatar} alt="avatar" />
            </div>
            <div className={styles.content}>
                <div className={styles.username}>{user.username}</div>
            </div>
        </div>
    ))
    return (
        <>
            <div className={styles.chatRoomsWrap}>
                <div className={styles.chatRoomsHead}>
                    {currentUserUsername}
                </div>
                {visibleUsers?.length === 0 && <p>No conversations yet.</p>}
                {elements}
            </div>
        </>
    )
}

export default ChatRooms;







import getDaysAgo from "../../utils/getDaysAgo";

import notificationImg from "../../../assets/img/notificationImg.jpg"
import avatar from "../../../assets/img/postAvatar.jpg";
import styles from "./NotificationElement.module.css";

const NotificationElement = ({ sender, post, createdAt, type }) => {

    const daysAgo = createdAt ? getDaysAgo(createdAt) : 0;
    const notificationTypes = ["commented your photo", "started following", "liked your photo"]
    let notificationType = "";
    if (type === "comment") {
        notificationType = notificationTypes[0];
    } else if (type === "follow") {
        notificationType = notificationTypes[1];
    } else {
        notificationType = notificationTypes[2];
    }

    return (
        <>
            <div className={styles.notification}>
                <div className={`${styles.liked} ${styles.item}`}>
                    <div className={styles.avatar}> <img src={sender?.avatar ? sender?.avatar : avatar} alt="avatar" /> </div>
                    <p className={styles.username}> {sender?.username ? sender?.username : "username"} <span className={styles.descr}>{notificationType}</span><span className={styles.timeAgo}> {daysAgo} day{daysAgo !== 1 ? "s" : ""} </span> </p>
                    {notificationType === "commented your photo" || notificationType === "liked your photo" &&
                        <div className={styles.img}><img src={post?.image ? post?.image : notificationImg} alt="notification" /></div>
                    }
                </div>
            </div>
        </>
    )
};

export default NotificationElement
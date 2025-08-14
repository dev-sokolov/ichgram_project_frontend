import getDaysAgo from "../../utils/getDaysAgo";

import avatar from "../../../assets/img/postAvatar.jpg";
import styles from "./PostElement.module.css";

const PostElement = ({ commetnAvatar, commetnAuthor, postLikesCount, createdAt, text }) => {

    const daysAgo = createdAt ? getDaysAgo(createdAt) : 0;
    return (
        <>
            <div className={styles.post}>
                <div className={styles.avatar}><img src={commetnAvatar ? commetnAvatar : avatar} alt="avatar" /></div>
                <div className={styles.content}>
                    <div className={styles.mainContent}>
                        <p className={styles.username}>{commetnAuthor}</p>
                        <p className={styles.text}>{text}</p>
                    </div>
                    <div className={styles.info}>
                        <div className={styles.time}>{daysAgo} day{daysAgo !== 1 ? "s" : ""}</div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default PostElement
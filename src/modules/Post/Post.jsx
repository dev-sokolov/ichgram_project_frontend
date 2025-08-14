import { useState } from "react";
import { useDispatch } from "react-redux";

import { toggleLike } from "../../redux/likes/likes-thunks";
import { Link } from "react-router-dom";

import Notification from "../../assets/icons/Notification";
import Message from "../../assets/icons/Message";

import getDaysAgo from "../../shared/utils/getDaysAgo";
import heart from "../../assets/icons/heart.png"

import avatar from "../../assets/img/postAvatar.jpg"
import styles from "./Post.module.css";

const Post = ({ _id, author, userId, currentUserId, description, image, commentsCount, likesCount: initialLikesCount, createdAt, likedUserIds = [], onUnfollow, onFollow, isFollowing }) => {
    const dispatch = useDispatch();
    const hasLiked = likedUserIds.includes(String(currentUserId));

    const [liked, setLiked] = useState(hasLiked);
    const [likesCount, setLikesCount] = useState(initialLikesCount);

    const daysAgo = getDaysAgo(createdAt);

    const onToggleLike = async () => {
        try {
            const nextLiked = !liked;
            await dispatch(toggleLike(_id));
            setLiked(nextLiked);
            setLikesCount(prev => nextLiked ? prev + 1 : prev - 1);
        } catch (error) {
            console.error("Failed to like:", error);
        }
    };

    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <div className={styles.avatar}><img src={author?.avatar ? author?.avatar : avatar} alt="avatar" /></div>
                    <div className={styles.title} >
                        <p className={styles.username}>{author.username}</p>
                        <p className={styles.visit}>&middot; {daysAgo} day{daysAgo !== 1 ? "s" : ""} ago &middot;</p>
                        {currentUserId !== author._id && (
                            isFollowing ? (
                                <button onClick={() => onUnfollow(author._id)} type="button" className={styles.follow}>Unfollow</button>
                            ) : (
                                <button onClick={() => onFollow(author._id)} type="button" className={styles.follow}>Follow</button>
                            )
                        )}
                    </div>
                </div>
                <Link to={`/post-other/${_id}`}>
                    <div className={styles.postImg}><img src={image} alt="postImg" /></div>
                </Link>
                <div className={styles.deskr}>
                    <div className={styles.icons}>
                        <div className={styles.icon}>
                            <button onClick={onToggleLike} type="button">
                                <div className={styles.heart}>{liked ? <img src={heart} alt="heart" /> : <Notification />}    </div>
                            </button>
                        </div>
                        <div className={styles.icon}>< Message /></div>
                    </div>
                    <div className={styles.likesAmount}>{likesCount} like{likesCount !== 1 ? "s" : ""}</div>
                    <div className={styles.text}>{description} <span>more</span> </div>
                    <div className={styles.comments}>View all comments {commentsCount}</div>
                </div>
            </div>
        </>
    )
}

export default Post
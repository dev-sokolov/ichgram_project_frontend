import PostElement from "../../shared/components/PostElement/PostElement";

import { useForm } from "react-hook-form";

import Error from "../../shared/components/Error/Error";

import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../../redux/comments/comments-thunks";
import { getCommentsfromPost } from "../../redux/comments/comments-thunks";
import { getCommentsSelector } from "../../redux/comments/comments-selectors";

import { useEffect } from "react";

import PostAddComment from "../../assets/icons/PostAddComment";
import Notification from "../../assets/icons/Notification";
import Message from "../../assets/icons/Message";

import getDaysAgo from "../../shared/utils/getDaysAgo";

import avatar from "../../assets/img/postAvatar.jpg"

import styles from "./PostContent.module.css";

const PostContent = ({ likesCount, commentsCount, createdAt, _id: postId, author, description }) => {
    const dispatch = useDispatch();
    const { comments = [], loading, error } = useSelector(getCommentsSelector) || {};
    const daysAgo = createdAt ? getDaysAgo(createdAt) : 0;
    const { register, reset, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        if (postId) {
            dispatch(getCommentsfromPost(postId));
        }
    }, [dispatch, postId]);

    const onSubmit = (data) => {
        const payload = { text: data.comment };
        dispatch(addComment({ postId, payload }));
        dispatch(getCommentsfromPost(postId));
        reset();
    };

    const elements = comments.map(comment => <div key={comment._id}>
        <PostElement
            commetnAvatar={comment?.user?.avatar ? comment?.user?.avatar : avatar}
            commetnAuthor={comment?.user?.username ? comment?.user?.username : "username"}
            postLikesCount={likesCount}
            createdAt={comment.createdAt}
            text={comment.text}
        />
    </div>)

    return (
        <>
            {loading && <p>Loading...</p>}
            {error && <Error>{error}</Error>}
            <div className={styles.wrap}>
                <div className={styles.topik}>
                    <div className={styles.post}>
                        <div className={styles.avatar}><img src={author?.avatar ?  author?.avatar : avatar} alt="avatar" /></div>
                        <div className={styles.content}>
                            <div className={styles.mainContent}>
                                <p className={styles.username}>{author?.username ? author?.username: "username"}</p>
                                <p className={styles.text}>{description}</p>
                            </div>
                            <div className={styles.info}>
                                <div className={styles.time}>{daysAgo} day{daysAgo !== 1 ? "s" : ""}</div>
                            </div>
                        </div>
                    </div>
                </div>
                {elements}

                <div className={styles.wrapInfoBlock}>
                    <div className={styles.infoBlock}>
                        <div className={styles.infoBlockImg}>
                            <div className={styles.img}><Notification /></div>
                            <div className={styles.img}><Message /></div>
                        </div>
                        <div className={styles.infoBlockCount}>
                            <p className={styles.likesAmount}>{likesCount} likes</p>
                            <p className={styles.timeAgo}>{daysAgo} day{daysAgo !== 1 ? "s" : ""}</p>
                        </div>
                    </div>
                    <div className={styles.addCommentBlock}>
                        <form onSubmit={handleSubmit(onSubmit)} >
                            <div className={styles.inputContainer}>
                                <span className={styles.inputIcon}><PostAddComment /></span>
                                <input {...register("comment")} type="text" placeholder="Add comment" />
                                {errors.comment && <Error>{errors.comment.message} </Error>}
                                <button type="submit">Send</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PostContent;
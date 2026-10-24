import PostElement from "../../shared/components/PostElement/PostElement";

import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

import Error from "../../shared/components/Error/Error";

import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../../redux/comments/comments-thunks";
import { getCommentsfromPost } from "../../redux/comments/comments-thunks";
import { getCommentsSelector } from "../../redux/comments/comments-selectors";
import { toggleLike } from "../../redux/likes/likes-thunks";

import { useEffect, useRef, useState } from "react";

import PostAddComment from "../../assets/icons/PostAddComment";
import Notification from "../../assets/icons/Notification";
import Message from "../../assets/icons/Message";
import heart from "../../assets/icons/heart.png";

import getDaysAgo from "../../shared/utils/getDaysAgo";
import getPersistedUserIdFromToken from "../../shared/utils/getUserIdFromToken";

import avatar from "../../assets/img/postAvatar.jpg"

import styles from "./PostContent.module.css";

const PostContent = ({
    likesCount: initialLikesCount = 0,
    commentsCount,
    createdAt,
    _id: postId,
    author,
    description,
    likedUserIds = [],
}) => {
    const dispatch = useDispatch();
    const currentUserId = getPersistedUserIdFromToken();
    const [searchParams, setSearchParams] = useSearchParams();
    const commentInputRef = useRef(null);
    const { comments = [], loading, error } = useSelector(getCommentsSelector) || {};
    const daysAgo = createdAt ? getDaysAgo(createdAt) : 0;
    const { register, reset, handleSubmit, formState: { errors } } = useForm();
    const { ref: commentRegisterRef, ...commentRegisterProps } = register("comment");

    const hasLiked = likedUserIds.some((id) => String(id) === String(currentUserId));
    const [liked, setLiked] = useState(hasLiked);
    const [likesCount, setLikesCount] = useState(initialLikesCount);

    useEffect(() => {
        setLiked(likedUserIds.some((id) => String(id) === String(currentUserId)));
        setLikesCount(initialLikesCount ?? 0);
    }, [likedUserIds, initialLikesCount, currentUserId, postId]);

    useEffect(() => {
        if (postId) {
            dispatch(getCommentsfromPost(postId));
        }
    }, [dispatch, postId]);

    useEffect(() => {
        if (searchParams.get("focus") !== "comment") return undefined;

        const timeoutId = setTimeout(() => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            commentInputRef.current?.focus({ preventScroll: true });
        }, 100);

        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete("focus");
        setSearchParams(nextParams, { replace: true });

        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when landing with focus=comment
    }, [searchParams.get("focus")]);

    const onToggleLike = async () => {
        if (!postId) return;
        try {
            const nextLiked = !liked;
            await dispatch(toggleLike(postId)).unwrap();
            setLiked(nextLiked);
            setLikesCount((prev) => nextLiked ? prev + 1 : Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to like:", err);
        }
    };

    const onFocusComment = () => {
        commentInputRef.current?.focus({ preventScroll: true });
    };

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
                            <button
                                type="button"
                                className={styles.likeBtn}
                                onClick={onToggleLike}
                                aria-label={liked ? "Unlike" : "Like"}
                            >
                                {liked
                                    ? <img src={heart} alt="liked" className={styles.heartImg} />
                                    : <Notification />
                                }
                            </button>
                            <button
                                type="button"
                                className={styles.likeBtn}
                                onClick={onFocusComment}
                                aria-label="Add comment"
                            >
                                <Message />
                            </button>
                        </div>
                        <div className={styles.infoBlockCount}>
                            <p className={styles.likesAmount}>{likesCount} like{likesCount !== 1 ? "s" : ""}</p>
                            <p className={styles.timeAgo}>{daysAgo} day{daysAgo !== 1 ? "s" : ""}</p>
                        </div>
                    </div>
                    <div className={styles.addCommentBlock}>
                        <form onSubmit={handleSubmit(onSubmit)} >
                            <div className={styles.inputContainer}>
                                <span className={styles.inputIcon}><PostAddComment /></span>
                                <input
                                    {...commentRegisterProps}
                                    ref={(element) => {
                                        commentRegisterRef(element);
                                        commentInputRef.current = element;
                                    }}
                                    type="text"
                                    placeholder="Add comment"
                                />
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

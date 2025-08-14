import { useSelector, useDispatch } from "react-redux";
import { getAllPostsSelector } from "../../redux/posts/posts-selectors";
import { getOnePostById } from "../../redux/posts/posts-thunks";
import { addFollower } from "../../redux/follows/follows-thunks";
import { getFollowsSelector } from "../../redux/follows/follows-selectors";
import { unfollow } from "../../redux/follows/follows-thunks";
import { getFollowing } from "../../redux/follows/follows-thunks";

import getPersistedUserIdFromToken from "../../shared/utils/getUserIdFromToken";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import PostContent from "../../modules/PostContent/PostContent";

import OtherProfileHead from "../../modules/OtherProfileHead/OtherProfileHead";
import ProfileMedia from "../../modules/ProfileMedia/ProfileMedia";

import Container from "../../modules/Container/Container";

import Error from "../../shared/components/Error/Error";

import avatar from "../../assets/img/postAvatar.jpg";
import styles from "./PostOtherPage.module.css";

const PostOtherPage = () => {
    const dispatch = useDispatch();
    const { onePost: post, loading, error } = useSelector(getAllPostsSelector);

    const [followError, setFollowError] = useState(null);

    const followings = useSelector(getFollowsSelector).followings;
    const currentUserId = getPersistedUserIdFromToken();

    useEffect(() => {
        if (currentUserId) {
            dispatch(getFollowing(currentUserId))
        }
    }, [dispatch, currentUserId])

    const { id } = useParams();

    const authorId = post?.author?._id;

    const followObject = followings?.find(
        (user) => user.following && user.following._id === authorId
    );

    const isFollowed = Boolean(followObject);

    useEffect(() => {
        if (id) {
            dispatch(getOnePostById(id))
        }
    }, [dispatch, id])

    const handleFollowToggle = async () => {
        if (!authorId) return;

        try {
            setFollowError(null);

            if (isFollowed) {
                await dispatch(unfollow(followObject.following._id)).unwrap();
            } else {
                await dispatch(addFollower(authorId)).unwrap();
            }

            await dispatch(getFollowing(currentUserId));
        } catch (err) {
            setFollowError(err);
        }
    };

    return (
        <>
            {loading && <p>Loading...</p>}
            {error && <Error>{error}</Error>}
            <Container>
                <div className={styles.wrapper}>
                    <div className={styles.wrapBackgroundSection}>
                        <div className={styles.backgroundSection}>
                            <OtherProfileHead authorId={authorId} />
                            <ProfileMedia authorId={authorId} />
                        </div>
                        <div className={styles.overlay}></div>
                    </div>
                    <div className={styles.wrapContent}>
                        <div className={styles.postImg}>
                            <img src={post?.image} alt="profileImg" />
                        </div>
                        <div className={styles.content}>
                            <div className={styles.wrapHead}>
                                <div className={styles.avatar}>
                                    {authorId && (
                                        <Link to={`/profile-other/${authorId}`}>
                                            <img src={post?.author?.avatar ? post?.author?.avatar : avatar} alt="avatar" />
                                        </Link>
                                    )}
                                </div>
                                <p className={styles.username}>{post?.author?.username}</p>
                                <button onClick={handleFollowToggle} type="button" className={styles.subscribe}>{isFollowed ? "Unfollow" : " Follow"}</button>
                            </div>
                            {followError && <p className={styles.error} >{followError}</p>}
                            <PostContent {...post} />
                        </div>
                    </div>
                </div>
            </Container>
        </>
    )
}

export default PostOtherPage;
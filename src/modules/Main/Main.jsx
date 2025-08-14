import Post from "../Post/Post";
import infoBlockLogo from "../../assets/img/infoBlockLogo.png";

import getPersistedUserIdFromToken from "../../shared/utils/getUserIdFromToken";

import Error from "../../shared/components/Error/Error";

import { useDispatch, useSelector } from "react-redux";

import { unfollow } from "../../redux/follows/follows-thunks";
import { getAllPosts } from "../../redux/posts/posts-thunks";
import { getFollowing, addFollower } from "../../redux/follows/follows-thunks";
import { getAllPostsSelector } from "../../redux/posts/posts-selectors";
import { getFollowsSelector } from "../../redux/follows/follows-selectors";
import { useEffect } from "react";
import { useState } from "react";

import styles from "./Main.module.css";

const Main = () => {
    const dispatch = useDispatch();
    const currentUserId = getPersistedUserIdFromToken();
    const followings = useSelector(getFollowsSelector).followings;
    const [visibleCount, setVisibleCount] = useState(6);

    useEffect(() => {
        dispatch(getAllPosts());
    }, [dispatch])

    useEffect(() => {
        dispatch(getFollowing(currentUserId))
    }, [dispatch, currentUserId])


    const onUnfollow = async (authorId) => {
        try {
            await dispatch(unfollow(authorId)).unwrap();
            await dispatch(getFollowing(currentUserId)).unwrap();
        } catch (err) {
            console.error("Ошибка при отписке:", err);
        }
    };

    const onFollow = async (authorId) => {
        try {
            await dispatch(addFollower(authorId)).unwrap();
            await dispatch(getFollowing(currentUserId)).unwrap();
        } catch (err) {
            console.error("Ошибка при подписке:", err);
        }
    };

    const { allPosts = [], loading, error } = useSelector(getAllPostsSelector) || {};

    const followingIds = followings
        .filter(item => item?.following?._id)
        .map(item => item.following._id);

    let followingsPosts = allPosts.filter(post => followingIds.includes(post?.author?._id));

    if (followingsPosts.length === 0) {
        followingsPosts = [...allPosts] 
            .sort(() => 0.5 - Math.random()) 
            .slice(0, 6);
    } else {
        followingsPosts = followingsPosts.slice(0, visibleCount);
    }

    const elements = followingsPosts.map(post => <Post key={post?._id} currentUserId={currentUserId} {...post} onUnfollow={onUnfollow} onFollow={onFollow} isFollowing={followingIds.includes(post?.author?._id)}/>)

    return (
        <>
            <div className={styles.wrap}>
                {followingsPosts.length === 0 ? (
                    <p className={styles.emptyMessage}>На данный момент Вы ни на кого не подписаны</p>
                ) : (
                    <>
                        <div className={styles.posts}>
                            {elements}
                        </div>
                        <button onClick={() => setVisibleCount(prev => prev + 6)} className={styles.btn}>
                            Show more
                        </button>
                        <div className={styles.infoBlock}>
                            <div className={styles.infoLogo}><img src={infoBlockLogo} alt="logo" /></div>
                            <p className={styles.infoTitle}>You've seen all the updates</p>
                            <p className={styles.infoText}>You have viewed all new publications</p>
                        </div>
                    </>
                )}
            </div>
            {loading && "Loading..."}
            {error && <Error>{error}</Error>}
        </>
    )
}

export default Main
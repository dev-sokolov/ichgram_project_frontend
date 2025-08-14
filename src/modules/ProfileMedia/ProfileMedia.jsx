import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPostsFromUserById } from "../../redux/posts/posts-thunks";
import { getAllPostsSelector } from "../../redux/posts/posts-selectors";
import { getPostsFromUserByIdSelector } from "../../redux/posts/posts-selectors";

import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

import getPersistedUserIdFromToken from "../../shared/utils/getUserIdFromToken";

import Error from "../../shared/components/Error/Error";

import styles from "./ProfileMedia.module.css";

const ProfileMedia = () => {

    const dispatch = useDispatch();
    const userPosts = useSelector(getPostsFromUserByIdSelector);
    const { loading, error } = useSelector(getAllPostsSelector);

    const currentUserId = getPersistedUserIdFromToken();
    const { authorId } = useParams();

    useEffect(() => {
        const targetId = authorId || currentUserId;
        if (targetId) {
            dispatch(getPostsFromUserById(targetId));
        }
    }, [dispatch, authorId, currentUserId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className={styles.noPosts}>У данного пользователя ещё нет постов</p>
    }

    if (!userPosts || userPosts.length === 0) {
        return <p>No posts found.</p>;
    }

    const isMyProfile = !authorId || String(authorId) === String(currentUserId);

    const pathToMedia = isMyProfile ? "/post-my/" : "/post-other/";

    const elements = userPosts.map(post => (
        <Link to={`${pathToMedia}${post._id}`} key={post._id}>
            <div className={styles.imgItem}>
                <img src={post.image} alt="Post image" loading="lazy" />
            </div>
        </Link>
    ));

    return (
        <>
            <div className={styles.imgBlock}>
                {elements}
            </div>
        </>
    )
}

export default ProfileMedia;
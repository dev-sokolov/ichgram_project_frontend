import { useSelector, useDispatch } from "react-redux";
import { getAllPostsSelector } from "../../redux/posts/posts-selectors";
import { getOnePostById } from "../../redux/posts/posts-thunks";

import { useEffect } from "react";

import { useParams, Link } from "react-router-dom";

import MyProfileHead from "../../modules/MyProfileHead/MyProfileHead";
import ProfileMedia from "../../modules/ProfileMedia/ProfileMedia";
import PostContent from "../../modules/PostContent/PostContent";
import Container from "../../modules/Container/Container";

import Error from "../../shared/components/Error/Error";

import avatar from "../../assets/img/postAvatar.jpg";
import styles from "./PostMyPage.module.css";

const PostMyPage = () => {
    const dispatch = useDispatch();
    const { onePost: post, loading, error } = useSelector(getAllPostsSelector);
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            dispatch(getOnePostById(id))
        }
    }, [dispatch, id])

    return (
        <>
            {loading && <p>Loading...</p>}
            {error && <Error>{error}</Error>}
            <Container>
                <div className={styles.wrapper}>
                    <div className={styles.wrapBackgroundSection}>
                        <div className={styles.backgroundSection}>
                            <MyProfileHead />
                            <ProfileMedia />
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
                                    <img src={post?.author?.avatar ? post?.author?.avatar : avatar} alt="avatar" />
                                </div>
                                <p className={styles.username}>{post?.author?.username}</p>
                                <Link to={`/post-edit-menu/${id}`} className={styles.link}>
                                    <div className={styles.more}>...</div>
                                </Link>
                            </div>
                            <PostContent {...post} />
                        </div>
                    </div>
                </div>
            </Container>
        </>
    )
}

export default PostMyPage;
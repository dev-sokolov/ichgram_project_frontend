import MyProfileHead from "../../modules/MyProfileHead/MyProfileHead";

import ProfileMedia from "../../modules/ProfileMedia/ProfileMedia";

import { useDispatch, useSelector } from "react-redux";
import { deletePost } from "../../redux/posts/posts-thunks";
import { useNavigate } from "react-router-dom";
import { getOnePostById } from "../../redux/posts/posts-thunks";
import { getOnePostByIdSelector } from "../../redux/posts/posts-selectors";

import PostContent from "../../modules/PostContent/PostContent";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

import Container from "../../modules/Container/Container";

import avatar from "../../assets/img/postAvatar.jpg";
import profileImg from "../../assets/img/profileImg.jpg";
import styles from "./EditPostPageMenu.module.css";

const EditPostPageMenu = () => {
    const dispatch = useDispatch();
    const { id: postId } = useParams();
    const navigate = useNavigate();

    const post = useSelector(getOnePostByIdSelector);

    useEffect(() => {
        dispatch(getOnePostById(postId))
    }, [dispatch, postId])

    const onDeletePost = async (postId) => {
        const resultAction = await dispatch(deletePost(postId));
        if (!resultAction.error) {
            navigate("/profile-my");
        }
    }

    return (
        <>
            <Container>
                <div className={styles.wrapper}>
                    <div className={styles.wrap}>
                        <div className={styles.backgroundSection}>
                            <MyProfileHead />
                            <ProfileMedia />
                        </div>
                        <div className={styles.overlay}></div>
                    </div>
                    <div className={styles.wrapPage}>
                        <div className={styles.postImg}>
                            <img src={post?.image ? post?.image : profileImg} alt="postImage" />
                        </div>
                        <div className={styles.content}>
                            <div className={styles.wrapHead}>
                                <div className={styles.avatar}>
                                    <img src={post?.author?.avatar ?  post?.author?.avatar : avatar} alt="avatar" />
                                </div>
                                <p className={styles.username}>{post?.author?.username}</p>
                                <div className={styles.more}>...</div>
                            </div> <PostContent {...post} />
                        </div>
                    </div>
                    <div className={styles.overlayCover}></div>
                    <div className={styles.editList}>
                        <div className={styles.item} onClick={() => onDeletePost(postId)}><p>Delete</p></div>
                        <div className={styles.item} onClick={() => navigate(`/post-edit/${post._id}`)}><p>Edit</p></div>
                        <div className={styles.item} onClick={() => navigate(`/post-my/${post._id}`)}><p>Go to post</p></div>
                        <div className={styles.item}><p>Copy link</p></div>
                        <div className={`${styles.item} ${styles.borderNone}`} onClick={() => navigate(`/post-my/${post._id}`)}><p>Cancel</p></div>
                    </div>
                </div>
            </Container>
        </>
    )
}

export default EditPostPageMenu;
import avatar from "../../assets/img/postAvatar.jpg";
import PostLink from "../../assets/icons/PostLink";

import { useSelector } from "react-redux";
import { getCurrentUserSelector } from "../../redux/users/users-selectors";
import { useDispatch } from "react-redux";
import { getCurrentUserById } from "../../redux/users/users-thunks";
import { useEffect } from "react";
import { logout } from "../../redux/auth/auth-thunks";

import getPersistedUserIdFromToken from "../../shared/utils/getUserIdFromToken";

import { useNavigate } from "react-router-dom";

import Button from "../../shared/components/Button/Button";
import styles from "./MyProfileHead.module.css";

const MyProfileHead = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const userId = getPersistedUserIdFromToken();
        if (userId) {

            dispatch(getCurrentUserById(userId))
        }
    }, [dispatch]);

    const user = useSelector(getCurrentUserSelector);

    const onLogout = () => {
        dispatch(logout())
    }

    return (
        <>
            <div className={styles.wpapHead}>
                <div className={styles.avatar}><img src={user?.avatar ? user?.avatar : avatar} alt="avatar" /></div>
                <div className={styles.content}>
                    <div>
                        <div className={styles.heading}>
                            <div className={styles.username}>{user?.username}</div>
                            <div className={styles.btn}>
                                <button onClick={() => navigate("/profile-edit")} className={`${styles.btnEdit}`}>Edit profile</button>
                            </div>
                            <div><Button className={styles.btnLogout}  onClick={onLogout}>Logout</Button></div>
                        </div>
                    </div>
                    <div className={styles.generalDaten}>
                        <div className={styles.posts}>{user?.posts.length}<span>posts</span></div>
                        <div className={styles.followers}>{user?.followers.length}<span>followers</span></div>
                        <div className={styles.following}>{user?.followings.length}<span>followings</span></div>
                    </div>
                    <div className={styles.descr}>{user?.description}</div>
                    <div className={styles.link}>
                        <div className={styles.linkIcon}><PostLink /></div>
                        <p>{user?.link}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyProfileHead;
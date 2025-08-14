import avatar from "../../assets/img/postAvatar.jpg";
import PostLink from "../../assets/icons/postLink";

import { useSelector, useDispatch } from "react-redux";
import { getPostUserSelector } from "../../redux/users/users-selectors";
import { getPostUserById } from "../../redux/users/users-thunks";
import { useEffect, useState } from "react";

import { addFollower, unfollow } from "../../redux/follows/follows-thunks";
import getPersistedUserIdFromToken from "../../shared/utils/getUserIdFromToken";

import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import Button from "../../shared/components/Button/Button";
import styles from "./OtherProfileHead.module.css";

const OtherProfileHead = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUserId = getPersistedUserIdFromToken();

  const { authorId } = useParams();
  const user = useSelector(getPostUserSelector);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authorId) {
      dispatch(getPostUserById(authorId));
    }
  }, [dispatch, authorId]);

  const isFollowed = user?.followers?.some(
    (follower) => (typeof follower === "string" ? follower : follower._id) === currentUserId
  );

  const followAction = async () => {
    if (!authorId) return;

    setError(null);
    try {
      if (isFollowed) {
        await dispatch(unfollow(authorId)).unwrap();
      } else {
        await dispatch(addFollower(authorId)).unwrap();
      }
      await dispatch(getPostUserById(authorId));
    } catch (err) {
      setError("Ошибка при изменении подписки");
      console.error(err);
    }
  };

  const addMessage = () => {
    navigate(`/message/${authorId}`)
  }

  return (
    <>
      <div className={styles.wpapHead}>
        <div className={styles.avatar}>
          <img src={user?.avatar ? user?.avatar : avatar} alt="avatar" />
        </div>
        <div className={styles.content}>
          <div>
            <div className={styles.heading}>
              <div className={styles.username}>{user?.username}</div>
              <div className={styles.btn}>
                <Button onClick={followAction} className={styles.btnBlue}>
                  {isFollowed ? "Unfollow" : "Follow"}
                </Button>
                <button className={`${styles.btnGrey}`} onClick={addMessage} >Message</button>
              </div>
            </div>
          </div>
          <div className={styles.generalDaten}>
            <div className={styles.posts}>
              {user?.posts?.length || 0}
              <span>posts</span>
            </div>
            <div className={styles.followers}>
              {user?.followers?.length || 0}
              <span>followers</span>
            </div>
            <div className={styles.following}>
              {user?.followings?.length || 0}
              <span>following</span>
            </div>
          </div>
          <div className={styles.descr}>{user?.description}</div>
          <div className={styles.link}>
            <div className={styles.linkIcon}>
              <PostLink />
            </div>
            <p>{user?.link}</p>
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
    </>
  );
};

export default OtherProfileHead;
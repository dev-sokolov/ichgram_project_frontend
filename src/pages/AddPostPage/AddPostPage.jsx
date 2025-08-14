import { addPost } from "../../redux/posts/posts-thunks";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Error from "../../shared/components/Error/Error";

import MyProfileHead from "../../modules/MyProfileHead/MyProfileHead";

import ProfileMedia from "../../modules/ProfileMedia/ProfileMedia";
import AddPostForm from "./AddPostForm/AddPostForm";

import Container from "../../modules/Container/Container";

import styles from "./AddPostPage.module.css";

const AddPostPage = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch();

    const [error, setError] = useState(null);

    const submitForm = async (payload) => {
        try {
            setError(null);
            await dispatch(addPost(payload)).unwrap();
            navigate("/profile-my")

        } catch (error) {
            setError(error);
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
                    {error && <Error>{error}</Error>}
                    <AddPostForm submitForm={submitForm} />
                </div>
            </Container>
        </>
    )
}

export default AddPostPage;
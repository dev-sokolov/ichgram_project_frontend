import { useSelector, useDispatch } from "react-redux";
import { getCurrentUserSelector } from "../../../redux/users/users-selectors";
import { getCurrentUserById } from "../../../redux/users/users-thunks";
import getPersistedUserIdFromToken from "../../../shared/utils/getUserIdFromToken";

import { useEffect, useRef, useState } from "react";

import Error from "../../../shared/components/Error/Error";

import { useForm } from "react-hook-form";

import PostSmile from "../../../assets/icons/PostSmile";
import addPost from "../../../assets/icons/addPost.png";
import avatar from "../../../assets/img/postAvatar.jpg"
import styles from "./AddPostForm.module.css";

const AddPostForm = ({ submitForm }) => {
    const dispatch = useDispatch();
    const user = useSelector(getCurrentUserSelector);
    const userId = getPersistedUserIdFromToken();

    const [preview, setPreview] = useState(null); 
    const fileInputRef = useRef(null);
    const { register, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        dispatch(getCurrentUserById(userId));
    }, [dispatch])

    const onSubmit = (data) => {
        const formData = new FormData();
        if (data.addPhoto?.[0]) {
            formData.append("image", data.addPhoto[0]);
        }
        formData.append("description", data.addMessage);
        submitForm(formData);
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    return (
        <>
            <div className={styles.createForm}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.header}>
                        <div>
                            <p>Create new post</p>
                            <div className={styles.btn}>
                                <button type="submit" >Share</button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.input}>
                               <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                {...register("addPhoto", {
                                    required: "Please add a photo",
                                    onChange: (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setPreview(URL.createObjectURL(file));
                                        } else {
                                            setPreview(null);
                                        }
                                    }
                                })}
                                ref={(el) => {
                                    register("addPhoto").ref(el); 
                                    fileInputRef.current = el;    
                                }}
                            />
                            {errors.addPhoto && <Error>{errors.addPhoto.message}</Error>}
                            <img
                                src={preview || addPost}
                                alt="add post"
                                onClick={handleImageClick}
                                style={{ cursor: "pointer", maxWidth: "200px" }}
                            />
                        </div>
                        <div className={styles.text}>
                            <div className={styles.dataText}>
                                <div className={styles.postTitle}>
                                    <div className={styles.avatar}><img src={user?.avatar ?  user?.avatar : avatar} alt="avatar" /> </div>
                                    <p>{user?.username}</p>
                                </div>
                                <textarea {...register("addMessage", { required: "Please add a message" })}></textarea>
                                {errors.addMessage && <Error>{errors.addMessage.message} </Error>}
                                <div className={styles.smile}><PostSmile /></div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default AddPostForm;
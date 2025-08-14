import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getOnePostByIdSelector } from "../../redux/posts/posts-selectors";
import { getOnePostById, updatePostData } from "../../redux/posts/posts-thunks";

import Container from "../../modules/Container/Container";
import Button from "../../shared/components/Button/Button";
import Error from "../../shared/components/Error/Error";

import styles from "./EditPostPage.module.css";
import placeholderImage from "../../assets/img/postAvatar.jpg";

const EditPostPage = () => {
    const { id: postId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const post = useSelector(getOnePostByIdSelector);
    const [previewImage, setPreviewImage] = useState(placeholderImage);
    const imageInputRef = useRef(null);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            description: ""
        }
    });

    useEffect(() => {
        if (postId) {
            dispatch(getOnePostById(postId));
        }
    }, [postId, dispatch]);

    useEffect(() => {
        if (post) {
            setValue("description", post.description || "");
            if (post.image) {
                setPreviewImage(post.image);
            }
        }
    }, [post, setValue]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setPreviewImage(URL.createObjectURL(file));
    };

    const onSubmit = async (formData) => {
        try {
            const data = new FormData();
            data.append("description", formData.description || "");

            if (imageInputRef.current?.files?.[0]) {
                data.append("image", imageInputRef.current.files[0]);
            }

            await dispatch(updatePostData({ postId, payload: data })).unwrap();
            navigate(`/post-my/${postId}`);
        } catch (error) {
            console.error("Ошибка обновления поста:", error);
        }
    };

    return (
        <Container>
            <div className={styles.editWrapper}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h2 className={styles.heading}>Edit post</h2>

                    <div className={styles.editImage}>
                        <div className={styles.postImg}>
                            <img src={previewImage} alt="preview" />
                        </div>
                        <div className={styles.newFotoBtn}>
                            <Button type="button" onClick={() => imageInputRef.current.click()}>
                                Change image
                            </Button>
                            <input
                                type="file"
                                ref={imageInputRef}
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>

                    <div className={styles.editAbout}>
                        <div className={styles.title}>Description</div>
                        <textarea
                            {...register("description")}
                            className={styles.textarea}
                        />
                        {errors.description && <Error>{errors.description.message}</Error>}
                    </div>

                    <div className={styles.btn}>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </div>
        </Container>
    );
};

export default EditPostPage;
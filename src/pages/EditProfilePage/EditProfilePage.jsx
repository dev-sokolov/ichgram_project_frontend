import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/users/users-thunks";
import { useSelector } from "react-redux";
import { getAllUsersSelector } from "../../redux/users/users-selectors";
import { getCurrentUserById } from "../../redux/users/users-thunks";
import { getCurrentUserSelector } from "../../redux/users/users-selectors";
import getPersistedUserIdFromToken from "../../shared/utils/getUserIdFromToken";
import Error from "../../shared/components/Error/Error";

import { useForm } from "react-hook-form";
import { useRef, useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import Container from "../../modules/Container/Container";
import Button from "../../shared/components/Button/Button";
import postAvatar from "../../assets/img/postAvatar.jpg"

import styles from "./EditProfilePage.module.css";

const EditProfilePage = () => {
    const [preview, setPreview] = useState(postAvatar);
    const fileInputRef = useRef(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector(getCurrentUserSelector);
    const { error, loading } = useSelector(getAllUsersSelector);

    useEffect(() => {
        const userId = getPersistedUserIdFromToken();
        if (userId) {
            dispatch(getCurrentUserById(userId))
        }
    }, [dispatch]);

    useEffect(() => {
        if (user?.avatar) {
            setPreview(user?.avatar);
        }
    }, [user]);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            username: user?.username || "",
            link: user?.link || "",
            description: user?.description || "",
        },
    });

    useEffect(() => {
        if (user) {
            setValue("username", user.username || "");
            setValue("link", user.link || "");
            setValue("description", user.description || "");
        }
    }, [user, setValue]);


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const previewURL = URL.createObjectURL(file);
            setPreview(previewURL);
        }
    };

    const onSubmit = async (formData) => {
        try {
            const data = new FormData();
            data.append("username", formData.username || user.username);
            data.append("link", formData.link || user.link);
            data.append("description", formData.description || user.description);
            if (fileInputRef.current?.files?.[0]) {
                data.append("avatar", fileInputRef.current.files[0]);
            }
            await dispatch(updateUser(data)).unwrap();
            navigate("/profile-my")
        } catch (error) {
            console.error("Ошибка обновления пользователя:", error);
        }
    }

    const openFileDialog = () => {
        fileInputRef.current?.click(); 
    };

    return (
        <>
            <Container>
                {loading && "Loading..."}
                {error && <Error>{error}</Error>}
                <div className={styles.editWrapper}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h2 className={styles.heading}>Edit profile</h2>
                        <div className={styles.editFoto}>
                            <div className={styles.avatar}><img src={preview} alt="avatar" /></div>
                            <div className={styles.editFotoData}>
                                <div className={styles.title}>{user?.username}</div>
                                <div className={styles.descr}>{user?.description}</div>
                            </div>
                            <div className={styles.newFotoBtn}>
                                <Button onClick={openFileDialog} >New photo</Button>
                                <input type="file" name="images" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />

                            </div>
                        </div>
                        <div className={styles.editUsername}>
                            <div className={styles.title}>Username</div>
                            <input {...register("username")} type="text" placeholder={user?.username} />
                            {errors.username && <Error>{errors.username.message}</Error>}
                        </div>
                        <div className={styles.editWebsite}>
                            <div className={styles.title}>Website</div>
                            <input {...register("link")} className={styles.inputWebsite} type="text" placeholder={user?.link} />
                            {errors.link && <Error>{errors.link.message}</Error>}
                        </div>
                        <div className={styles.editAbout}>
                            <div className={styles.title}>About</div>
                            <textarea {...register("description")} defaultValue={user?.description} className={styles.textarea} />
                            {errors.description && <Error>{errors.description.message}</Error>}
                        </div>
                        <div className={styles.btn}><Button type="submit">Save</Button></div>
                    </form>
                </div>
            </Container>
        </>
    )
}

export default EditProfilePage;
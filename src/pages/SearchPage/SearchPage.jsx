import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getUsersByUsername } from "../../redux/users/users-thunks";

import debounce from "lodash.debounce";
import { useCallback } from "react";

import { getAllUsersSelector } from "../../redux/users/users-selectors";

import Container from "../../modules/Container/Container";
import Main from "../../modules/Main/Main";
import { Link } from "react-router-dom";

import Error from "../../shared/components/Error/Error";

import avatar from "../../assets/img/postAvatar.jpg";
import styles from "./SearchPage.module.css"

const SearchPage = () => {
    const dispatch = useDispatch();
    const { register, formState: { errors } } = useForm()

    const usersArray = useSelector(getAllUsersSelector); 
    const loading = useSelector(state => state.users.loading);
    const error = useSelector(state => state.users.error);

    const debouncedSearch = useCallback(
        debounce((value) => {
            if (value.trim() === "") return;
            dispatch(getUsersByUsername(value));
        }, 300),
        [dispatch]
    );

    const handleChange = (e) => {
        debouncedSearch(e.target.value);
    };

    const noRender = (event) => {
        event.preventDefault();
    }

    const element = usersArray.map(user => (
        <div className={styles.item} key={user._id}>
            <Link to={`/profile-other/${user._id}`}>
                <div className={styles.avatar}> <img src={user?.avatar ? user?.avatar : avatar} alt="avatar" /> </div>
            </Link>
            <p className={styles.username}> {user.username} </p>
        </div>
    ));

    return (
        <>
            <Container>
                {loading && "Loading..."}
                {error && <Error>{error}</Error>}
                <div className={styles.wrapper}>
                    <div className={styles.backSection} >
                        <Main />
                        <div className={styles.overlay}></div>
                    </div>
                    <div className={styles.frontSection}>
                        <h2 className={styles.title}>Search</h2>
                        <div>
                            <form onSubmit={noRender}>
                                <input {...register("username")} className={styles.input} type="text"
                                    placeholder="Search" onChange={handleChange} />
                                {errors.username && <Error>{errors.username.message}</Error>}
                            </form>
                        </div>
                        <p className={styles.text}>Recent</p>
                        <div className={styles.search}>
                            {element}
                        </div>
                    </div>
                </div>
            </Container>
        </>
    )
}

export default SearchPage;


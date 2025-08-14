import { useSelector } from "react-redux";
import { selectAuth } from "../../../redux/auth/auth-selectors.js";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "../../../shared/components/Button/Button";
import Error from "../../../shared/components/Error/Error.jsx";

import loginSchema from "./LoginSchema.js";

import styles from "./LoginForm.module.css";

const LoginForm = ({ submitForm }) => {

    const { loading, error } = useSelector(selectAuth);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema)
    });

    const onSubmit = (values) => {
        submitForm(values);
    }
    return (
        <>
            <form className={styles.formStyle} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.inputBlock}>
                    <input {...register("email")} className={styles.inputStyle} type="email" placeholder="Email" />
                    {errors.email && <Error>{errors.email.message} </Error>}
                    {!errors.email && error ===`User not found` ? <Error>{error}</Error> : null}
                    <input {...register("password")} className={styles.inputStyle} type="password" placeholder="Password" />
                    {errors.password && <Error>{errors.password.message} </Error>}
                    {!errors.password && error === "Password invalid" ? <Error>{error}</Error> : null}
                </div>
                <div>
                    <Button type="submit">{loading ? "loading..." : "Log in"}</Button>
                </div>
            </form>
        </>
    )

}

export default LoginForm;
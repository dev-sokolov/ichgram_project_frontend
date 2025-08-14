import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useSelector } from "react-redux";
import { selectAuth } from "../../../redux/auth/auth-selectors";

import Error from "../../../shared/components/Error/Error";
import Button from "../../../shared/components/Button/Button";

import registrSchema from "./RegistrSchema";

import styles from "./RegistrForm.module.css";

const RegistrForm = ({ submitForm }) => {
    const { loading, error } = useSelector(selectAuth)

    const { register: formRegister, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(registrSchema)
    });

    const onSubmit = (values) => {
        submitForm(values);
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.formStyle}>
                <div className={styles.inputBlock}>
                    <input {...formRegister("email")} className={styles.inputStyle} type="email" placeholder="Email" />
                    {errors.email && <Error>{errors.email.message} </Error>}
                    {!errors.email && error === `This email is already taken.` ? <Error>{error}</Error> : null}
                    <input {...formRegister("fullName")} className={styles.inputStyle} type="text" placeholder="Full Name" />
                    {errors.fullName && <Error>{errors.fullName.message} </Error>}
                    <input {...formRegister("username")} className={styles.inputStyle} type="text" placeholder="Username" />
                    {errors.username && <Error>{errors.username.message} </Error>}
                    {!errors.username && error === `This username is already taken.` ? <Error>{error}</Error> : null}
                    <input {...formRegister("password")} className={styles.inputStyle} type="password" placeholder="Password" />
                    {errors.password && <Error>{errors.password.message} </Error>}
                </div>
                <div className={styles.descriptionBlock}>
                    <div className={styles.descriptionItem}>
                        <p>
                            People who use our service may have uploaded your contact information to Instagram. <a href="#">Learn More</a>
                        </p>
                    </div>
                    <div className={styles.descriptionItem}>
                        <p>
                            By signing up, you agree to our <a href="#">Terms</a>, <a href="#">Privacy</a>, <a href="#">Policy</a> and <a href="#">Cookies Policy</a>
                        </p>

                    </div>
                </div>
                <div>
                    <Button type="submit">{loading ? "loading..." : "Sign up"}</Button>
                </div>
            </form>
        </>
    )

}

export default RegistrForm;
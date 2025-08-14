import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "../../../shared/components/Button/Button.jsx";

import changeLoginSchema from "./ChangeLoginSchema.js";

import styles from "./ChangeLoginForm.module.css";

const ChangeLoginForm = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(changeLoginSchema)
    });
    
    return (
        <>
            <form className={styles.formStyle}>
                <div className={styles.inputBlock}>
                    <input className={styles.inputStyle} type="email" placeholder="Email" />
                </div>
                <div>
                    <Button type="submit">Reset your password</Button>
                </div>
            </form>
        </>
    )

}

export default ChangeLoginForm;
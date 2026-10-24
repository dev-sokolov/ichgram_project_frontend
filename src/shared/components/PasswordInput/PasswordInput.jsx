import { useState, forwardRef } from "react";

import Eye from "../../../assets/icons/Eye";
import EyeOff from "../../../assets/icons/EyeOff";

import styles from "./PasswordInput.module.css";

const PasswordInput = forwardRef(({ className, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
        <div className={styles.wrap}>
            <input
                {...props}
                ref={ref}
                type={visible ? "text" : "password"}
                className={`${styles.input}${className ? ` ${className}` : ""}`}
            />
            <button
                type="button"
                className={styles.toggle}
                onClick={() => setVisible((prev) => !prev)}
                aria-label={visible ? "Hide password" : "Show password"}
            >
                {visible ? <EyeOff /> : <Eye />}
            </button>
        </div>
    );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;

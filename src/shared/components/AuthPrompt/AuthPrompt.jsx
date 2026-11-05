import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Button from "../Button/Button";
import { login } from "../../../redux/auth/auth-thunks";
import { selectAuth, selectToken } from "../../../redux/auth/auth-selectors";
import { DEMO_EMAIL, DEMO_PASSWORD } from "../../constants/demoAccount";

import styles from "./AuthPrompt.module.css";

const AuthPromptContext = createContext(null);

export const AuthPromptProvider = ({ children }) => {
    const dispatch = useDispatch();
    const token = useSelector(selectToken);
    const { loading, error } = useSelector(selectAuth);
    const [open, setOpen] = useState(false);

    const openPrompt = useCallback(() => setOpen(true), []);
    const closePrompt = useCallback(() => setOpen(false), []);

    const requireAuth = useCallback(() => {
        if (token) return true;
        setOpen(true);
        return false;
    }, [token]);

    const enterDemo = () => {
        dispatch(login({ email: DEMO_EMAIL, password: DEMO_PASSWORD }));
    };

    useEffect(() => {
        if (token) setOpen(false);
    }, [token]);

    useEffect(() => {
        if (!open) return undefined;
        const onKeyDown = (event) => {
            if (event.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open]);

    return (
        <AuthPromptContext.Provider value={{ requireAuth, openPrompt }}>
            {children}
            {open && (
                <div className={styles.backdrop} onClick={closePrompt} role="presentation">
                    <div
                        className={styles.dialog}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="auth-prompt-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h2 id="auth-prompt-title" className={styles.title}>Sign in to continue</h2>
                        <p className={styles.text}>
                            Guests can browse posts, profiles, comments, and sample dialogs.
                            Likes, comments, follows, posts, and messages need an account.
                        </p>
                        {error && <p className={styles.error}>{error}</p>}
                        <div className={styles.actions}>
                            <Link to="/" className={styles.primaryLink} onClick={closePrompt}>Log in</Link>
                            <Link to="/registr" className={styles.secondaryLink} onClick={closePrompt}>Sign up</Link>
                            <Button type="button" onClick={enterDemo} disabled={loading}>
                                {loading ? "Signing in..." : "Try demo account"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AuthPromptContext.Provider>
    );
};

export const useAuthPrompt = () => {
    const context = useContext(AuthPromptContext);
    if (!context) {
        throw new Error("useAuthPrompt must be used inside AuthPromptProvider");
    }
    return context;
};

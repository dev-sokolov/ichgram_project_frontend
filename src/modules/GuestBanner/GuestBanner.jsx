import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { login } from "../../redux/auth/auth-thunks";
import { selectAuth } from "../../redux/auth/auth-selectors";
import { DEMO_EMAIL, DEMO_PASSWORD } from "../../shared/constants/demoAccount";

import styles from "./GuestBanner.module.css";

const GuestBanner = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector(selectAuth);

    const enterDemo = () => {
        dispatch(login({ email: DEMO_EMAIL, password: DEMO_PASSWORD }));
    };

    return (
        <div className={styles.banner}>
            <p>Guest mode. Browsing is open. Sign in to like, comment, follow, or post.</p>
            <div className={styles.actions}>
                <Link to="/">Log in</Link>
                <button type="button" onClick={enterDemo} disabled={loading}>
                    {loading ? "Signing in..." : "Try demo"}
                </button>
            </div>
        </div>
    );
};

export default GuestBanner;

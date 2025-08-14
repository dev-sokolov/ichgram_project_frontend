import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

import { selectToken } from "../../redux/auth/auth-selectors";

import styles from "./PrivateRoute.module.css";

const PrivateRoute = () => {
    const token = useSelector(selectToken);

    if (!token) return <Navigate to="/" />;

    return (
        <>
            <div className={styles.privateLayout}>
                <div className={styles.content}>
                    <Outlet />
                </div>
                <footer className={styles.footer}>
                </footer>
            </div>
        </>
    )
}

export default PrivateRoute;
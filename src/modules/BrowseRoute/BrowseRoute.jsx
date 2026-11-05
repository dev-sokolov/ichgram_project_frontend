import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import { selectIsGuest, selectToken } from "../../redux/auth/auth-selectors";

import styles from "../PrivateRoute/PrivateRoute.module.css";

const BrowseRoute = () => {
    const token = useSelector(selectToken);
    const isGuest = useSelector(selectIsGuest);

    if (!token && !isGuest) return <Navigate to="/" />;

    return (
        <div className={styles.privateLayout}>
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    );
};

export default BrowseRoute;

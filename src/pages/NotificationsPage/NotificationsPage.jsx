import Container from "../../modules/Container/Container";
import Main from "../../modules/Main/Main";
import NotificationElement from "../../shared/components/NotificationElement/NotificationElement";

import { useDispatch, useSelector } from "react-redux";
import { getNotifications } from "../../redux/notifications/notifications-thunks";
import { getNotificationsSelector } from "../../redux/notifications/notifications-selectors";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import { selectIsGuest } from "../../redux/auth/auth-selectors";

import styles from "./NotificationsPage.module.css"

const NotificationsPage = () => {
    const dispatch = useDispatch();
    const isGuest = useSelector(selectIsGuest);

    const notificationsStore = useSelector(getNotificationsSelector) || {};
    const notifications = notificationsStore.notifications || [];

    useEffect(() => {
        if (isGuest) return;
        dispatch(getNotifications());
    }, [dispatch, isGuest])

    const elements = notifications.map(item => <div key={item._id}><NotificationElement
        sender={item.sender}
        post={item.post}
        createdAt={item.createdAt}
        type={item.type}
    /></div>)

    return (
        <>
            <Container>
                <div className={styles.wrapper}>
                    <div className={styles.backSection} >
                        <Main />
                        <div className={styles.overlay}></div>
                    </div>
                    <div className={styles.frontSection}>
                        <h2 className={styles.title}>Notifications</h2>
                        {isGuest ? (
                            <div className={styles.guestNote}>
                                <p>Notifications are available after you sign in.</p>
                                <Link to="/">Log in</Link>
                                <Link to="/registr">Sign up</Link>
                            </div>
                        ) : (
                            <>
                                <p className={styles.text}>New</p>
                                {elements}
                            </>
                        )}
                    </div>
                </div>
            </Container>
        </>
    )
}

export default NotificationsPage;
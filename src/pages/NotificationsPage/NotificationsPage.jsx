import Container from "../../modules/Container/Container";
import Main from "../../modules/Main/Main";
import NotificationElement from "../../shared/components/NotificationElement/NotificationElement";

import { useDispatch, useSelector } from "react-redux";
import { getNotifications } from "../../redux/notifications/notifications-thunks";
import { getNotificationsSelector } from "../../redux/notifications/notifications-selectors";
import { useEffect } from "react";

import styles from "./NotificationsPage.module.css"

const NotificationsPage = () => {
    const dispatch = useDispatch();

    const notificationsStore = useSelector(getNotificationsSelector) || {};
    const notifications = notificationsStore.notifications || [];

    useEffect(() => {
        dispatch(getNotifications());
    }, [dispatch])

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
                        <p className={styles.text}>New</p>
                        {elements}
                    </div>
                </div>
            </Container>
        </>
    )
}

export default NotificationsPage;
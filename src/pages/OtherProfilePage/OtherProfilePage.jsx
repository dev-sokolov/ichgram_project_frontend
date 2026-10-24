import { useLayoutEffect } from "react";
import { useParams } from "react-router-dom";

import OtherProfileHead from "../../modules/OtherProfileHead/OtherProfileHead";
import ProfileMedia from "../../modules/ProfileMedia/ProfileMedia";

import styles from "./OtherProfilePage.module.css";

const OtherProfilePage = () => {
    const { authorId } = useParams();

    useLayoutEffect(() => {
        const previous = window.history.scrollRestoration;
        window.history.scrollRestoration = "manual";
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        return () => {
            window.history.scrollRestoration = previous || "auto";
        };
    }, [authorId]);

    return (
        <>
            <div className={styles.wrap}>
                <OtherProfileHead />
                <ProfileMedia />
            </div>
        </>
    )
}

export default OtherProfilePage;

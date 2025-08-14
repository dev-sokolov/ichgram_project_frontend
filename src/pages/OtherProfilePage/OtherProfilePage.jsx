import OtherProfileHead from "../../modules/OtherProfileHead/OtherProfileHead";

import ProfileMedia from "../../modules/ProfileMedia/ProfileMedia";

import styles from "./OtherProfilePage.module.css";

const OtherProfilePage = () => {
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
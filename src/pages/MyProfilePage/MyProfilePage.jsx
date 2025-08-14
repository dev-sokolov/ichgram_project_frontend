import MyProfileHead from "../../modules/MyProfileHead/MyProfileHead";

import ProfileMedia from "../../modules/ProfileMedia/ProfileMedia";

import styles from "./MyProfilePage.module.css";

const MyProfilePage = () => {
    return (
        <>
            <div className={styles.wrap}>
                <MyProfileHead />
                <ProfileMedia />
            </div>
        </>
    )
}

export default MyProfilePage;
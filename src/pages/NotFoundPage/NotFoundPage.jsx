import Container from "../../modules/Container/Container";

import loginImg from "../../assets/logo/loginImg.webp";
import styles from "./NotFoundPage.module.css";

const NotFoundPage = () => {
    return (
        <>
            <Container>
                <div className={styles.wrapper}>
                    <div className={styles.notFoundImg}>
                        <img src={loginImg} alt="Image" />
                    </div>
                    <div className={styles.notFoundDescr}>
                        <h2 className={styles.title}>
                            Oops! Page Not Found (404 Error)
                        </h2>
                        <p className={styles.text}>
                            We're sorry, but the page you're looking for doesn't seem to exist.
                            If you typed the URL manually, please double-check the spelling.
                            If you clicked on a link, it may be outdated or broken.
                        </p>
                    </div>
                </div>
            </Container>
        </>
    )
}

export default NotFoundPage;
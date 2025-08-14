import ChangeLoginForm from "./ChangeLoginForm/ChangeLoginForm";

import { Link } from "react-router-dom";

import Container from "../Container/Container";
import changeLoginPng from "../../assets/logo/changeLoginPng.png";


import styles from "./ChangeLogin.module.css";

const ChangeLogin = () => {
    return (
        <>
            <Container>
                <div className={styles.container}>
                    <div>
                        <div className={styles.wrappForm}>
                            <div className={styles.titleBlock}>
                                <div className={styles.img}>
                                    <img src={changeLoginPng} alt="Change Login Img" />
                                </div>
                                <p className={styles.title}>
                                    Trouble logging in?
                                </p>
                                <p className={styles.descr}>
                                    Enter your email, phone, or username and we'll
                                    send you a link to get back into your account.
                                </p>
                            </div>
                            <ChangeLoginForm />
                            <div className={styles.divider}>OR</div>
                            <div className={styles.text}> <Link to={"/registr"}>Create new account</Link> </div>
                        </div>
                        <div className={styles.wrappInfo}>
                            <p><Link to={"/"}>Back to login</Link> </p>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    )
};

export default ChangeLogin;
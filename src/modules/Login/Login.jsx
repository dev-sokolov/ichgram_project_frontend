import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import LoginForm from "./LoginForm/LoginForm";

import { selectAuth } from "../../redux/auth/auth-selectors";
import { login } from "../../redux/auth/auth-thunks";
import { verifyUserApi } from "../../shared/api/auth-api";
import { clearAuthError, enterGuest } from "../../redux/auth/auth-slice";
import { DEMO_EMAIL, DEMO_PASSWORD } from "../../shared/constants/demoAccount";
import backendInstance from "../../shared/api/instance";

import { Link } from "react-router-dom";

import Container from "../Container/Container";

import logo from "../../assets/logo/logo.png";
import loginImg from "../../assets/logo/loginImg.webp";
import styles from "./Login.module.css";

const Login = () => {
    const [searchParams, setSearcParams] = useSearchParams();
    const [successVerify, setSuccessVerify] = useState(false);
    const { token, loading, error } = useSelector(selectAuth);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const verificationCode = searchParams.get("verificationCode");

    useEffect(() => {
        dispatch(clearAuthError());
    }, [dispatch]);

    useEffect(() => {
        if (verificationCode) {
            const fetchVerify = async () => {
                try {
                    await verifyUserApi(verificationCode);
                    setSuccessVerify(true);
                    setSearcParams();
                    dispatch(clearAuthError());
                }
                catch (error) {
                    console.log(error);
                }
            }
            fetchVerify();
        }
    }, [verificationCode, dispatch, setSearcParams]);

    const submitForm = (payload) => dispatch(login(payload));

    const exploreAsGuest = () => {
        localStorage.removeItem("token");
        delete backendInstance.defaults.headers["Authorization"];
        dispatch(enterGuest());
        navigate("/home");
    };

    const enterDemo = () => {
        dispatch(login({ email: DEMO_EMAIL, password: DEMO_PASSWORD }));
    };

    useEffect(() => {
        if (token) {
            navigate("/home")
        }
    }, [token, navigate]);

    return (
        <>
            <Container>
                <div className={styles.container}>
                    <div className={styles.imgWrap}>
                        <img src={loginImg} alt="login Image" />
                    </div>
                    <div>
                        <div className={styles.wrappForm}>
                            {loading && <p>Loading...</p>}
                            {error && <p style={{ color: "red" }}>{error}</p>}

                            {!successVerify && !error && <p style={{ textAlign: "center"}}></p>}
                            {successVerify && !error && <p style={{ color: "green", textAlign: "center" }}>Email successfully verified</p>}
                            <div className={styles.logo}>
                                <div className={styles.img}>
                                    <img src={logo} alt="logo" />
                                </div>
                            </div>
                            <LoginForm submitForm={submitForm} />
                            <div className={styles.divider}>OR</div>
                            <div className={styles.access}>
                                <button type="button" className={styles.guestBtn} onClick={exploreAsGuest}>
                                    Explore as Guest
                                </button>
                                <div className={styles.demoCard}>
                                    <p className={styles.demoTitle}>Try Demo Account</p>
                                    <p className={styles.demoText}>
                                        Each login restores a clean profile, so visitors do not overwrite each other.
                                    </p>
                                    <p className={styles.demoCred}><span>Email</span> {DEMO_EMAIL}</p>
                                    <p className={styles.demoCred}><span>Password</span> {DEMO_PASSWORD}</p>
                                    <button type="button" className={styles.demoBtn} onClick={enterDemo} disabled={loading}>
                                        {loading ? "Signing in..." : "Continue as demo"}
                                    </button>
                                </div>
                            </div>
                            {successVerify && "Email successfully verified"}
                            <div className={styles.text}> <Link to={"/changeLogin"}>Forgot password?</Link> </div>
                        </div>
                        <div className={styles.wrappInfo}>
                            <p>Don't have an account? <Link to={"/registr"}>Sign up</Link> </p>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    )
};

export default Login;
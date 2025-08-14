import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/auth/auth-thunks";

import { useNavigate } from "react-router-dom";

import RegistrForm from "./RegistrForm/RegistrForm";

import { Link } from "react-router-dom";

import Container from "../Container/Container";
import logo from "../../assets/logo/logo.png";

import styles from "./Registr.module.css";

const Registr = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitForm = async (payload) => {
        const resultAction = await dispatch(register(payload));

        if (register.fulfilled.match(resultAction)) {
            navigate("/")
        }
    }

    return (
        <>
            <Container>
                <div className={styles.container}>
                    <div >
                        <div className={styles.wrappForm}>
                            <div className={styles.logo}>
                                <div className={styles.img}>
                                    <img src={logo} alt="logo" />
                                </div>
                            </div>
                            <RegistrForm submitForm={submitForm} />
                        </div>
                        <div className={styles.wrappInfo}>
                            <p>Have an account? <Link to={"/"}>Log in</Link></p>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    )
};

export default Registr
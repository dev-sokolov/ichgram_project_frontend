import { useSelector, useDispatch } from "react-redux";
import { getCurrentUserSelector } from "../../redux/users/users-selectors";
import { getCurrentUserById } from "../../redux/users/users-thunks";
import getPersistedUserIdFromToken from "../../shared/utils/getUserIdFromToken";

import { useEffect } from "react";
import { NavLink } from "react-router-dom";

import { logout } from "../../redux/auth/auth-thunks";

import NavbarMenu from "./NavbarMenu/NavbarMenu";

import logo from "../../assets/logo/logo.png";
import avatar from "../../assets/img/postAvatar.jpg";
import styles from "./Navbar.module.css";

const Navbar = () => {
    const dispatch = useDispatch();
    const user = useSelector(getCurrentUserSelector);
    const userId = getPersistedUserIdFromToken();

    useEffect(() => {
        if (userId) {
            dispatch(getCurrentUserById(userId));
        }
    }, [dispatch, userId]);

    const onLogout = () => {
        dispatch(logout())
    }

    return (
        <>
            <div className={styles.wrap}>
                <div className={styles.navLogo}>
                    <img src={logo} alt="logo" />
                </div>
                <NavbarMenu />
                <div className={styles.elem}>
                    <div className={styles.iconWrap}>
                        <NavLink to={"/profile-my"} className={styles.img} > <img src={user?.avatar ? user?.avatar : avatar} alt="avatar" />  </NavLink>
                    </div>
                    <div><NavLink to={"/profile-my"} className={styles.item}>Profile</NavLink></div>
                </div>
            </div>
        </>
    )
}

export default Navbar;

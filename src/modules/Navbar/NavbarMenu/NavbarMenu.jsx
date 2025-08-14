import Home from "../../../assets/icons/Home";
import Search from "../../../assets/icons/Search";
import Explore from "../../../assets/icons/Explore";
import Message from "../../../assets/icons/Message";
import Notification from "../../../assets/icons/Notification";
import Create from "../../../assets/icons/Create";

import { NavLink } from "react-router-dom";

import styles from "./NavbarMenu.module.css"

const NavbarMenu = () => {
    return (
        <>
            <div className={styles.navMenu}>
                <div className={styles.elem}>
                    <div className={styles.iconWrap}><NavLink to="/home" end>{({ isActive }) => <Home active={isActive} />}</NavLink></div>
                    <div><NavLink to={"/home"} className={styles.item}>Home</NavLink></div>
                </div>
                <div className={styles.elem}>
                    <div className={styles.iconWrap}><NavLink to="/search" end>{({ isActive }) => <Search active={isActive} />}</NavLink></div>
                    <div><NavLink to={"/search"} className={styles.item}>Search</NavLink></div>
                </div>
                <div className={styles.elem}>
                    <div className={styles.iconWrap}><NavLink to="/explore" end>{({ isActive }) => <Explore active={isActive} />}</NavLink></div>
                    <div><NavLink to={"/explore"} className={styles.item}>Explore</NavLink></div>
                </div>
                <div className={styles.elem}>
                    <div className={styles.iconWrap}><NavLink to="/message" end>{({ isActive }) => <Message active={isActive} />}</NavLink></div>
                    <div><NavLink to={"/message"} className={styles.item}>Message</NavLink></div>
                </div>
                <div className={styles.elem}>
                     <div className={styles.iconWrap}><NavLink to="/notification" end>{({ isActive }) => <Notification active={isActive} />}</NavLink></div>
                    <div><NavLink to={"/notification"} className={styles.item}>Notification</NavLink></div>
                </div>
                <div className={styles.elem}>
                    <div className={styles.iconWrap}><NavLink to="/post-add" end>{({ isActive }) => <Create active={isActive} />}</NavLink></div>
                    <div><NavLink to={"/post-add"} className={styles.item}>Create</NavLink></div>
                </div>
            </div>
        </>
    )
}

export default NavbarMenu;
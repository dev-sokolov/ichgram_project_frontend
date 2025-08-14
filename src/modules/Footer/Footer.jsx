import Container from "../Container/Container";

import Copiright from "../../assets/icons/Copiright";

import { NavLink } from "react-router-dom";

import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <>
            {/* <Container> */}
                <div className={styles.wrap}>
                    <div className={styles.menu}>
                        <p><NavLink to={"/home"}>Home</NavLink></p>
                        <p><NavLink to={"/search"}>Search</NavLink></p>
                        <p><NavLink to={"/explore"}>Explore</NavLink></p>
                        <p><NavLink to={"/message"}>Message</NavLink></p>
                        <p><NavLink to={"/notification"}>Notification</NavLink></p>
                        <p><NavLink to={"/post-add"}>Create</NavLink></p>
                    </div>
                    <div className={styles.copiright}>
                        <Copiright />
                    </div>
                </div>



            {/* </Container > */}
        </>
    )
}

export default Footer
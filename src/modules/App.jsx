import Navbar from "./Navbar/Navbar";
import Navigation from "../pages/Navigation";
import FooterPage from "../pages/FooterPage/FooterPage";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getCurrent } from "../redux/auth/auth-thunks";
import { selectToken } from "../redux/auth/auth-selectors";

import { useLocation } from "react-router-dom";

import backendInstance from "../shared/api/instance";
import "../shared/styles/style.css";

import styles from "./App.module.css";

function App() {
  const location = useLocation();
  const hideLayout = ["/", "/registr", "/changeLogin"].includes(location.pathname);

  const token = useSelector(selectToken);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      backendInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
      dispatch(getCurrent());
    }
  }, [dispatch, token]);

  return (
    <>
      <div className={styles.layout}>
        <div className={styles.app}>
          {!hideLayout && <Navbar />}
          <div className={styles.main}>
            <Navigation />
          </div>
        </div>
        {!hideLayout && (
          <footer className={styles.footer}>
            <FooterPage />
          </footer>
        )}

      </div >
    </>
  )
}

export default App;

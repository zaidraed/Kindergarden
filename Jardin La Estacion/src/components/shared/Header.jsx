//import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import styles from "../../styles/Header.module.css";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.link}>
          <h1 className={styles.title}>Jardin De la Estacion</h1>
        </Link>
        <div className={styles.buttons}>
          {isAuthenticated ? (
            <>
              <button onClick={handleLogout} className={styles.button}>
                Cerrar Sesión
              </button>
              <span className={styles.greeting}>Hola, {user.name}</span>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.link}>
                <button className={styles.button}>Iniciar Sesión</button>
              </Link>
              <Link
                to="/register"
                className={`${styles.link} ${styles.registerLink}`}
              >
                <button className={styles.button}>Registrarse</button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;

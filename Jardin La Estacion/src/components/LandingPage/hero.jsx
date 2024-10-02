//import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/hero.module.css";

function Hero() {
  return (
    <div className={styles.hero}>
      <h1 className={styles.title}>Bienvenido a Kinder Garden</h1>
      <h2 className={styles.subtitle}>
        Un lugar seguro y cálido para que tu hijo aprenda y crezca.
      </h2>
      <div className={styles.buttonContainer}>
        <Link to="/login" className={styles.button}>
          Iniciar Sesión
        </Link>
        <Link to="/register" className={styles.button}>
          Registrarse
        </Link>
      </div>
    </div>
  );
}

export default Hero;

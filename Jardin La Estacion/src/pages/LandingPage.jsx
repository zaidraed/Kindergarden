//import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/LandingPage.module.css";
import logo from "../assets/logo.png";
function LandingPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <img
            src={logo}
            alt="Logo del Jardín La Estacion"
            className={styles.logo}
          />
          <h1 className={styles.title}>Bienvenidos al Jardín De la Estacion</h1>
        </header>
        ;
        <h2 className={styles.subtitle}>
          Un lugar seguro y cálido para que tu hijo aprenda y crezca.
        </h2>
        <p className={styles.description}>
          En Kinder Garden, nos esforzamos por brindar una educación de calidad
          a nuestros alumnos. Contamos con un equipo de maestros altamente
          capacitados y un entorno seguro y estimulante para que tu hijo pueda
          desarrollarse plenamente.
        </p>
        <div className={styles.buttonContainer}>
          <Link to="/login" className={styles.button}>
            Iniciar Sesión
          </Link>
          <Link to="/register" className={styles.button}>
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

//import React from "react";
import styles from "../../styles/Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        {"Copyright © "} Jardin De la Estacion {new Date().getFullYear()}
        {"."}
      </p>
    </footer>
  );
}

export default Footer;

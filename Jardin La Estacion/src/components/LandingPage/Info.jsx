//import React from "react";
import styles from "../../styles/Info.module.css";

function Info() {
  return (
    <div className={styles.container}>
      <h2 className={styles.mainTitle}>Sobre Kinder Garden</h2>
      <div className={styles.grid}>
        <div className={styles.gridItem}>
          <h3 className={styles.title}>Nuestro Enfoque</h3>
          <p className={styles.text}>
            En Jardin De la Estacion, nos enfocamos en brindar una educación de calidad
            a nuestros alumnos. Contamos con un equipo de maestros altamente
            capacitados y un entorno seguro y estimulante para que tu hijo pueda
            desarrollarse plenamente.
          </p>
        </div>
        <div className={styles.gridItem}>
          <h3 className={styles.title}>Nuestras Instalaciones</h3>
          <p className={styles.text}>
            Nuestras instalaciones están diseñadas específicamente para
            satisfacer las necesidades de los niños en edad preescolar. Contamos
            con aulas espaciosas, áreas de juego seguras y un patio amplio para
            que los niños puedan explorar y aprender.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Info;

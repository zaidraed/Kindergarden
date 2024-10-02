import Register from "../components/Auth/Register";
import styles from "../styles/Register.module.css";

function RegisterPage() {
  return (
    <div className={styles.container}>
      <div className={styles.Register}>
        <Register />
      </div>
    </div>
  );
}

export default RegisterPage;

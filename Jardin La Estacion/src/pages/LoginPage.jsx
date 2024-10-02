import Login from "../components/Auth/login";
import styles from "../styles/LoginPage.module.css";

function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <Login />
      </div>
    </div>
  );
}

export default LoginPage;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  login,
  clearAuthError,
  // validateGoogleToken,
} from "../../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/Login.module.css";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Email inválido").required("Requerido"),
  password: Yup.string().required("Requerido"),
});

// Configure this based on your backend URL
const GOOGLE_LOGIN_URL =
  "https://kindergarden-production.up.railway.app/api/auth/google/login";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  //useEffect(() => {
  //const urlParams = new URLSearchParams(location.search);
  //const token = urlParams.get("token");
  //if (token) {
  // dispatch(validateGoogleToken(token));
  //}
  //}, [location, dispatch]);

  const handleLogin = (values, { setSubmitting }) => {
    dispatch(login(values));
    setSubmitting(false);
  };

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_LOGIN_URL;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Iniciar Sesión</h1>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className={styles.form}>
            <div className={styles.fieldContainer}>
              <Field
                name="email"
                placeholder="Email"
                className={`${styles.field} ${
                  errors.email && touched.email ? styles.errorField : ""
                }`}
              />
              {touched.email && errors.email && (
                <div className={styles.errorText}>{errors.email}</div>
              )}
            </div>
            <div className={styles.fieldContainer}>
              <Field
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                className={`${styles.field} ${
                  errors.password && touched.password ? styles.errorField : ""
                }`}
              />
              <span
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
              {touched.password && errors.password && (
                <div className={styles.errorText}>{errors.password}</div>
              )}
            </div>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || loading}
            >
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </button>
          </Form>
        )}
      </Formik>
      <button onClick={handleGoogleLogin} className={styles.googleButton}>
        Iniciar sesión con Google
      </button>
      {error && <div className={styles.errorText}>{error}</div>}
      <p>
        ¿Olvidaste tu contraseña?{" "}
        <Link to="/forgot-password">Recuperar Contraseña</Link>
      </p>
    </div>
  );
}

export default Login;

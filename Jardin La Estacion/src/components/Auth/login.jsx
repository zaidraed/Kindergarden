import { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  login,
  clearAuthError,
  googleLogin,
} from "../../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/Login.module.css";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Email inválido").required("Requerido"),
  password: Yup.string().required("Requerido"),
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const handleLogin = (values, { setSubmitting }) => {
    dispatch(login(values));
    setSubmitting(false);
  };
  const handleGoogleSuccess = async (response) => {
    try {
      await dispatch(googleLogin(response.credential)).unwrap();
      // No need to navigate here, the useEffect above will handle it
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Sign-In Error:", error);
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
            <GoogleOAuthProvider clientId="566063083458-51k9fvuupd3kju0klptht1p5ocuppqu7.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onFailure={handleGoogleFailure}
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    Login with Google
                  </button>
                )}
              />
            </GoogleOAuthProvider>
          </Form>
        )}
      </Formik>
      {error && <div className={styles.errorText}>{error}</div>}
      <p>
        ¿Olvidaste tu contraseña?{" "}
        <Link to="/forgot-password">Recuperar Contraseña</Link>
      </p>
    </div>
  );
}

export default Login;

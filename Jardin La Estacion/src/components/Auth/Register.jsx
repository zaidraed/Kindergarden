import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { register } from "../../features/auth/authSlice";
import styles from "../../styles/Register.module.css";

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Requerido"),
  email: Yup.string().email("Email inválido").required("Requerido"),
  password: Yup.string().required("Requerido"),
});

function Register() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Registrarse</h1>
      <Formik
        initialValues={{ name: "", email: "", password: "" }}
        validationSchema={RegisterSchema}
        onSubmit={(values, { setSubmitting }) => {
          dispatch(register(values));
          setSubmitting(false);
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className={styles.form}>
            <div className={styles.fieldContainer}>
              <Field
                name="name"
                placeholder="Nombre"
                className={`${styles.field} ${
                  errors.name && touched.name ? styles.errorField : ""
                }`}
              />
              {touched.name && errors.name && (
                <div className={styles.errorText}>{errors.name}</div>
              )}
            </div>
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
                type="password"
                placeholder="Contraseña"
                className={`${styles.field} ${
                  errors.password && touched.password ? styles.errorField : ""
                }`}
              />
              {touched.password && errors.password && (
                <div className={styles.errorText}>{errors.password}</div>
              )}
            </div>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || loading}
            >
              {loading ? "Cargando..." : "Registrarse"}
            </button>
          </Form>
        )}
      </Formik>
      {error && <div className={styles.errorText}>{error}</div>}
    </div>
  );
}

export default Register;

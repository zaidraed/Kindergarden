import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { TextField, Button, Typography, Box } from "@mui/material";
import { login, clearAuthError } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

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

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Iniciar Sesión
      </Typography>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              name="email"
              label="Email"
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
            />
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              name="password"
              label="Contraseña"
              type="password"
              error={touched.password && !!errors.password}
              helperText={touched.password && errors.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting || loading}
              sx={{ mt: 2 }}
            >
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </Button>
          </Form>
        )}
      </Formik>
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default Login;

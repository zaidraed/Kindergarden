//import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { TextField, Button, Typography, Box } from "@mui/material";
import { register } from "../../features/auth/authSlice";

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Requerido"),
  email: Yup.string().email("Email inválido").required("Requerido"),
  password: Yup.string().required("Requerido"),
});

function Register() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Registrarse
      </Typography>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
        }}
        validationSchema={RegisterSchema}
        onSubmit={(values, { setSubmitting }) => {
          dispatch(register(values));
          setSubmitting(false);
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              name="name"
              label="Nombre"
              error={touched.name && errors.name}
              helperText={touched.name && errors.name}
            />
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              name="email"
              label="Email"
              error={touched.email && errors.email}
              helperText={touched.email && errors.email}
            />
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              name="password"
              label="Contraseña"
              type="password"
              error={touched.password && errors.password}
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
              {loading ? "Cargando..." : "Registrarse"}
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

export default Register;

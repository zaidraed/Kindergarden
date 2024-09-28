//import React from "react";
import { Link } from "react-router-dom";
import { Typography, Box, Button } from "@mui/material";

function LandingPage() {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Bienvenido a Kinder Garden
      </Typography>
      <Typography variant="h5" gutterBottom>
        Un lugar seguro y cálido para que tu hijo aprenda y crezca.
      </Typography>
      <Typography variant="body1" gutterBottom>
        En Kinder Garden, nos esforzamos por brindar una educación de calidad a
        nuestros alumnos. Contamos con un equipo de maestros altamente
        capacitados y un entorno seguro y estimulante para que tu hijo pueda
        desarrollarse plenamente.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <Button variant="contained" color="primary">
            Iniciar Sesión
          </Button>
        </Link>
        <Link to="/register" style={{ textDecoration: "none", marginLeft: 2 }}>
          <Button variant="contained" color="secondary">
            Registrarse
          </Button>
        </Link>
      </Box>
    </Box>
  );
}

export default LandingPage;

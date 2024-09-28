//import React from "react";
import { Box, Typography, Button } from "@mui/material";

function Hero() {
  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        color: "white",
        padding: 8,
        textAlign: "center",
      }}
    >
      <Typography variant="h2" component="h1" gutterBottom>
        Bienvenido a Kinder Garden
      </Typography>
      <Typography variant="h5" gutterBottom>
        Un lugar seguro y cálido para que tu hijo aprenda y crezca.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="secondary" href="/login">
          Iniciar Sesión
        </Button>
        <Button
          variant="contained"
          color="secondary"
          href="/register"
          sx={{ ml: 2 }}
        >
          Registrarse
        </Button>
      </Box>
    </Box>
  );
}

export default Hero;

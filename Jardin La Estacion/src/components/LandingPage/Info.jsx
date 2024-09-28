//import React from "react";
import { Container, Typography, Grid, Box } from "@mui/material";

function Info() {
  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Sobre Kinder Garden
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Nuestro Enfoque
            </Typography>
            <Typography variant="body1">
              En Kinder Garden, nos enfocamos en brindar una educación de
              calidad a nuestros alumnos. Contamos con un equipo de maestros
              altamente capacitados y un entorno seguro y estimulante para que
              tu hijo pueda desarrollarse plenamente.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Nuestras Instalaciones
            </Typography>
            <Typography variant="body1">
              Nuestras instalaciones están diseñadas específicamente para
              satisfacer las necesidades de los niños en edad preescolar.
              Contamos con aulas espaciosas, áreas de juego seguras y un patio
              amplio para que los niños puedan explorar y aprender.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Info;

//import React from "react";
import { Box } from "@mui/material";
import Register from "../components/Auth/Register";

function RegisterPage() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Register />
    </Box>
  );
}

export default RegisterPage;

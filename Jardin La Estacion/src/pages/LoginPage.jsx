//import React from "react";
import { Box } from "@mui/material";
import Login from "../components/Auth/login";

function LoginPage() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Login />
    </Box>
  );
}

export default LoginPage;

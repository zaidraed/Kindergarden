//import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Kinder Garden
          </Typography>
        </Link>
        <Box>
          {isAuthenticated ? (
            <>
              <Button color="inherit" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
              <Typography variant="body1" sx={{ ml: 2 }}>
                Hola, {user.name}
              </Typography>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button color="inherit">Iniciar Sesión</Button>
              </Link>
              <Link
                to="/register"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button color="inherit" sx={{ ml: 2 }}>
                  Registrarse
                </Button>
              </Link>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;

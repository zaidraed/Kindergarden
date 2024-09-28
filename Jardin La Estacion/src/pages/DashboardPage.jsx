import { useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import ParentDashboard from "../components/Dashboard/ParentDashboard";
import TeacherDashboard from "../components/Dashboard/TeacherDashboard";
import AdminDashboard from "../components/Dashboard/AdminDashboard";

function DashboardPage() {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  console.log("DashboardPage props:", { user, isAuthenticated, loading });

  useEffect(() => {
    console.log("DashboardPage rendered");
    console.log("Auth state:", { user, isAuthenticated, loading });

    if (user) {
      console.log("User role:", user.Role);
      console.log("User object:", user);
    }
  }, [user, isAuthenticated, loading]);

  if (loading) {
    console.log("Loading...");
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    console.log("Not authenticated");
    return (
      <Typography>Por favor, inicie sesión para ver el dashboard.</Typography>
    );
  }

  if (!user || !user.Role) {
    console.log("No user data");
    return <Typography>Error: Información de usuario no disponible</Typography>;
  }

  const renderDashboard = () => {
    const userRole = (user.Role || user.role || "").toUpperCase();
    console.log("Rendering dashboard for role:", userRole);

    try {
      switch (userRole) {
        case "PARENT":
          console.log("Rendering ParentDashboard");
          return <ParentDashboard user={user} />;
        case "TEACHER":
          console.log("Rendering TeacherDashboard");
          return <TeacherDashboard user={user} />;
        case "ADMIN":
          console.log("Rendering AdminDashboard");
          return <AdminDashboard user={user} />;
        default:
          console.error("Unrecognized role:", userRole);
          return (
            <Typography>Rol de usuario no reconocido: {userRole}</Typography>
          );
      }
    } catch (error) {
      console.error("Error rendering dashboard:", error);
      return <Typography>Error al renderizar el dashboard.</Typography>;
    }
  };

  return <Box sx={{ padding: 4 }}>{renderDashboard()}</Box>;
}

export default DashboardPage;

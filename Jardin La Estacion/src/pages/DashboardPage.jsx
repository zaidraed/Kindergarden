//import React from "react";
import { useSelector } from "react-redux";
import { Typography, Container } from "@mui/material";
import AdminDashboard from "../components/Dashboard/AdminDashboard";
import TeacherDashboard from "../components/Dashboard/TeacherDashboard";
import ParentDashboard from "../components/Dashboard/ParentDashboard";

const DashboardPage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return (
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Por favor, inicie sesión para acceder al dashboard.
        </Typography>
      </Container>
    );
  }

  const renderDashboard = () => {
    switch (user.Role) {
      case "ADMIN":
        return <AdminDashboard />;
      case "TEACHER":
        return <TeacherDashboard user={user} />;
      case "PARENT":
        return <ParentDashboard user={user} />;
      default:
        return (
          <Typography variant="h4" component="h1" gutterBottom>
            Rol no reconocido. Contacte al administrador.
          </Typography>
        );
    }
  };

  return <Container>{renderDashboard()}</Container>;
};

export default DashboardPage;

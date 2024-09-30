//import React from "react";
import { useSelector } from "react-redux";
import AdminDashboard from "../components/Dashboard/AdminDashboard";
import TeacherDashboard from "../components/Dashboard/TeacherDashboard";
import ParentDashboard from "../components/Dashboard/ParentDashboard";

const DashboardPage = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  console.log("DashboardPage props:", { user, isAuthenticated, loading });

  if (loading) {
    console.log("Loading...");
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated || !user) {
    console.log("User not authenticated or user data missing");
    return <div>Por favor, inicie sesión para acceder al dashboard.</div>;
  }

  console.log("DashboardPage rendered");
  console.log("Auth state:", { user, isAuthenticated, loading });
  console.log("User role:", user.Role);
  console.log("User object:", user);

  const renderDashboard = () => {
    console.log("Rendering dashboard for role:", user.Role);
    switch (user.Role) {
      case "ADMIN":
        console.log("Rendering AdminDashboard");
        return <AdminDashboard />;
      case "TEACHER":
        console.log("Rendering TeacherDashboard");
        return <TeacherDashboard />;
      case "PARENT":
        console.log("Rendering ParentDashboard");
        return <ParentDashboard />;
      default:
        console.log("Unknown role, rendering default message");
        return <div>No se ha encontrado un dashboard para su rol.</div>;
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {renderDashboard()}
    </div>
  );
};

export default DashboardPage;

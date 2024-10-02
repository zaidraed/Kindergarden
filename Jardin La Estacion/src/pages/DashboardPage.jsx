import { useSelector } from "react-redux";
import AdminDashboard from "../components/Dashboard/AdminDashboard";
import TeacherDashboard from "../components/Dashboard/TeacherDashboard";
import ParentDashboard from "../components/Dashboard/ParentDashboard";
import styles from "../styles/DashboardPage.module.css";

const DashboardPage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return (
      <div className={styles.container}>
        <h1 className={styles.message}>
          Por favor, inicie sesión para acceder al dashboard.
        </h1>
      </div>
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
          <h1 className={styles.message}>
            Rol no reconocido. Contacte al administrador.
          </h1>
        );
    }
  };

  return <div className={styles.container}>{renderDashboard()}</div>;
};

export default DashboardPage;

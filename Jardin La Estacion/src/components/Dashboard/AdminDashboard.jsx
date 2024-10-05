import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  toggleUseractive,
  updateUser,
} from "../../features/auth/authSlice";
import styles from "../../styles/AdminDashboard.module.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDisableUser = (userEmail) => {
    dispatch(toggleUseractive(userEmail)).then(() => {
      dispatch(fetchUsers()); // Para actualizar la lista de usuarios inmediatamente
    });
  };

  const handleUpdateUserRole = (user, newRole) => {
    confirmAlert({
      title: "Confirmar cambio de rol",
      message: `¿Estás seguro de que quieres cambiar el rol de ${user.name} a ${newRole}?`,
      buttons: [
        {
          label: "Sí",
          onClick: () => {
            dispatch(updateUser({ ...user, Role: newRole })).then(() => {
              dispatch(fetchUsers()); // Para refrescar la lista tras el cambio
            });
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1>Admin Dashboard</h1>
      <input
        type="text"
        placeholder="Buscar usuario..."
        value={searchTerm}
        onChange={handleSearch}
        className={styles.input}
      />
      {loading && <p>Cargando usuarios...</p>}
      {error && <p>Error: {error}</p>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.Role}</td>
              <td>{user.Active ? "Sí" : "No"}</td>
              <td>
                <button
                  onClick={() => handleDisableUser(user.email)}
                  className={styles.button}
                >
                  {user.Active ? "Desactivar" : "Activar"}
                </button>
                <button
                  onClick={() => handleUpdateUserRole(user, "ADMIN")}
                  className={styles.button}
                >
                  ADMIN
                </button>
                <button
                  onClick={() => handleUpdateUserRole(user, "TEACHER")}
                  className={styles.button}
                >
                  TEACHER
                </button>
                <button
                  onClick={() => handleUpdateUserRole(user, "PARENT")}
                  className={styles.button}
                >
                  PARENT
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;

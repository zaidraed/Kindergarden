import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, updateUser } from "../../features/auth/authSlice";
import styles from "../../styles/AdminDashboard.module.css";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUsers())
      .unwrap()
      .then((data) => console.log("Usuarios:", data))
      .catch((err) => console.error("Error al obtener usuarios:", err));
  }, [dispatch]);

  const handleRoleChange = (userId, newRole) => {
    dispatch(updateUser({ id: userId, Role: newRole }));
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.dashboard}>
      <h1>Administrar Roles de Usuarios</h1>
      {users.length === 0 ? (
        <p>No hay usuarios disponibles.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.Role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="TEACHER">Teacher</option>
                    <option value="PARENT">Parent</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => handleRoleChange(user.id, "DISABLED")}
                    disabled={user.Role === "DISABLED"}
                  >
                    Deshabilitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;

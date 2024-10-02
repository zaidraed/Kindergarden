import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  updateUser,
  disableUser,
} from "../../features/auth/authSlice";
import styles from "../../styles/AdminDashboard.module.css";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setRole(user.Role || "");
    setIsActive(user.active ?? true);
  };

  const handleUpdateUser = () => {
    if (selectedUser) {
      dispatch(updateUser({ ...selectedUser, Role: role, active: isActive }));
    }
  };

  const handleDisableUser = (userEmail) => {
    dispatch(disableUser(userEmail));
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
            <th>Name</th>
            <th>Role</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} onClick={() => handleUserSelect(user)}>
              <td>{user.name}</td>
              <td>{user.Role}</td>
              <td>{user.Active ? "Sí" : "No"}</td>
              <td>
                <button
                  onClick={() => handleDisableUser(user.email)}
                  className={styles.button}
                >
                  Desactivar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <div className={styles["selected-user"]}>
          <h2>Editar usuario: {selectedUser.name}</h2>
          <div>
            <label>
              Rol:
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="ADMIN">ADMIN</option>
                <option value="TEACHER">TEACHER</option>
                <option value="PARENT">PARENT</option>
              </select>
            </label>
            <label>
              Activo:
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            </label>
          </div>
          <button onClick={handleUpdateUser} className={styles.button}>
            Guardar cambios
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  toggleUseractive,
  updateUser,
} from "../../features/auth/authSlice";
import {
  fetchClassrooms,
  createClassroom,
  updateClassroom,
  deleteClassroom,
} from "../../features/classrooms/classroomSlice";
import styles from "../../styles/AdminDashboard.module.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { classrooms, status } = useSelector((state) => state.classrooms);
  const { users, loading, error } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");

  const [newClassroomName, setNewClassroomName] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState([]); // Estado para manejar los profesores seleccionados
  const [editingClassroom, setEditingClassroom] = useState(null);
  useEffect(() => {
    dispatch(fetchClassrooms());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleCreateClassroom = async () => {
    if (newClassroomName && selectedTeachers.length) {
      try {
        await dispatch(
          createClassroom({
            name: newClassroomName,
            teacherIds: selectedTeachers,
          })
        ).unwrap();
        // Refresh the classrooms list after successful creation
        dispatch(fetchClassrooms());
        setNewClassroomName("");
        setSelectedTeachers([]);
      } catch (error) {
        console.error("Failed to create classroom:", error);
        alert("Error al crear el aula. Por favor, inténtelo de nuevo.");
      }
    } else {
      alert(
        "Por favor, introduce un nombre y selecciona al menos un profesor."
      );
    }
  };

  const handleEditClassroom = (classroom) => {
    setEditingClassroom(classroom);
    setNewClassroomName(classroom.name);
    setSelectedTeachers(classroom.teachers.map((teacher) => teacher.id)); // Preseleccionamos los profesores actuales
  };
  const handleUpdateClassroom = () => {
    if (editingClassroom && newClassroomName && selectedTeachers.length) {
      dispatch(
        updateClassroom({
          id: editingClassroom.id,
          name: newClassroomName,
          teacherIds: selectedTeachers, // Enviamos los IDs de los profesores seleccionados
        })
      );
      setEditingClassroom(null);
      setNewClassroomName("");
      setSelectedTeachers([]);
    } else {
      alert(
        "Por favor, introduce un nombre y selecciona al menos un profesor."
      );
    }
  };
  const handleDeleteClassroom = (id) => {
    confirmAlert({
      title: "Confirmar eliminación",
      message:
        "¿Estás seguro de que quieres eliminar esta aula? Esta acción no se puede deshacer.",
      buttons: [
        {
          label: "Sí",
          onClick: async () => {
            try {
              await dispatch(deleteClassroom(id)).unwrap();
              // Actualizar la lista de aulas después de la eliminación
              dispatch(fetchClassrooms());
            } catch (error) {
              console.error("Error al eliminar el aula:", error);
              alert(
                "Hubo un problema al eliminar el aula. Por favor, inténtalo de nuevo."
              );
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

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
      <div className={styles.tableContainer}>
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

      {/* Classrooms Section */}
      <h2>Classrooms</h2>
      {/* Formulario para crear/editar aula */}
      <div className={styles.form}>
        <h2>{editingClassroom ? "Editar Aula" : "Crear Nueva Aula"}</h2>
        <input
          type="text"
          placeholder="Nombre del Aula"
          value={newClassroomName}
          onChange={(e) => setNewClassroomName(e.target.value)}
          className={styles.input}
        />

        {/* Selección de profesores */}
        <div className={styles.teachers}>
          <h3>Seleccionar Profesores</h3>
          <select
            multiple
            value={selectedTeachers}
            onChange={(e) =>
              setSelectedTeachers(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
            className={styles.select}
          >
            {users
              .filter((user) => user.Role === "TEACHER")
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
          </select>
        </div>

        <button
          onClick={
            editingClassroom ? handleUpdateClassroom : handleCreateClassroom
          }
          className={styles.button}
        >
          {editingClassroom ? "Actualizar Aula" : "Crear Aula"}
        </button>
      </div>

      {/* Listado de aulas */}
      <div className={styles.classroomList}>
        <h2>Lista de Aulas</h2>
        {status === "loading" && <p>Cargando aulas...</p>}
        {status === "failed" && <p>Error: No se pudieron cargar las aulas</p>}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre del Aula</th>
              <th>Profesores</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {classrooms && classrooms.length > 0 ? (
              classrooms.map((classroom) => (
                <tr key={classroom.id}>
                  <td>{classroom.name}</td>
                  <td>
                    {classroom.teachers && classroom.teachers.length > 0
                      ? classroom.teachers
                          .map((teacherRel) => teacherRel.user.name)
                          .join(", ")
                      : "Sin profesores"}
                  </td>
                  <td>
                    <button
                      onClick={() => handleEditClassroom(classroom)}
                      className={styles.button}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteClassroom(classroom.id)}
                      className={styles.button}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No hay aulas disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

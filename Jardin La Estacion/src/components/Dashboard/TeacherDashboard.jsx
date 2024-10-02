import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPhotos } from "../../features/photos/photosSlice";
import PhotoUpload from "../../pages/PhotoUpload";
import styles from "../../styles/TeacherDashboard.module.css";
import PropTypes from "prop-types";

const TeacherDashboard = ({ user }) => {
  const dispatch = useDispatch();
  const { photos, loading, error } = useSelector((state) => state.photos);

  useEffect(() => {
    dispatch(fetchAllPhotos());
  }, [dispatch]);

  if (loading) return <p>Cargando fotos...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) {
    return <p>Error: Información de usuario no disponible</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Bienvenido, {user.name || "Profesor"}</h1>

      <div className={styles["upload-container"]}>
        <PhotoUpload userId={user.name} />
      </div>

      <h2>Todas las Fotos</h2>
      <div className={styles.grid}>
        {photos.map((photo) => (
          <div key={photo.id} className={styles.card}>
            <img src={photo.url} alt={`Foto de la clase ${photo.classId}`} />
            <p>Clase: {photo.classroomId}</p>
            <p>Clase: {photo.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
TeacherDashboard.propTypes = {
  user: PropTypes.object.isRequired,
};
export default TeacherDashboard;

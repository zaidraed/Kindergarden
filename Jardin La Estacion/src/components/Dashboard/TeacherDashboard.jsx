import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPhotos } from "../../features/photos/photosSlice";
import PhotoUpload from "../../pages/PhotoUpload";
import VideoUpload from "../../pages/VideoUpload"; // Nuevo componente para videos
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
        <VideoUpload userId={user.name} /> {/* Carga de videos */}
      </div>

      <h2>Todas las Fotos y Videos</h2>
      <div className={styles.grid}>
        {photos.map((media) => (
          <div key={media.id} className={styles.card}>
            {media.url.includes(".mp4") ? (
              <video controls>
                <source src={media.url} type="video/mp4" />
                Tu navegador no soporta la reproducción de video.
              </video>
            ) : (
              <img src={media.url} alt={`Media de la clase ${media.classId}`} />
            )}
            <p>Clase: {media.classroomId}</p>
            <p>Descripción: {media.description}</p>
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

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPhotos } from "../../features/photos/photosSlice";
import { fetchAllVideos } from "../../features/photos/videoSlice";
import PhotoUpload from "../../pages/PhotoUpload";
import VideoUpload from "../../pages/VideoUpload";
import styles from "../../styles/TeacherDashboard.module.css";
import PropTypes from "prop-types";

const TeacherDashboard = ({ user }) => {
  const dispatch = useDispatch();
  const { photos } = useSelector((state) => state.photos);
  const { videos } = useSelector((state) => state.videos);

  useEffect(() => {
    dispatch(fetchAllPhotos());
    dispatch(fetchAllVideos());
  }, [dispatch]);

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

            <p>{media.description}</p>
          </div>
        ))}
      </div>
      <div className={styles.sectionDivider}></div> {/* Línea divisoria */}
      <div className={styles.grid}>
        {videos.map((video) => (
          <div key={video.id} className={styles.card}>
            <video
              src={video.url}
              poster={video.thumbnail || "/placeholder-thumbnail.jpg"} // Miniatura opcional
              className={styles.thumbnail}
              onMouseEnter={(e) => e.target.play()} // Reproducción al hacer hover
              onMouseLeave={(e) => e.target.pause()} // Pausa al salir del hover
              muted
              controls={false} // Sin controles en miniatura
            />
            <p className={styles.description}>{video.description}</p>{" "}
            {/* Descripción del video */}
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

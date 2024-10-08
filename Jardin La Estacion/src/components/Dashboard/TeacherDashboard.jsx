import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPhotos } from "../../features/photos/photosSlice";
import { fetchAllVideos } from "../../features/videos/videosSlice";
import { fetchClassrooms } from "../../features/classrooms/classroomSlice"; // Importamos la acción para obtener aulas
import PhotoUpload from "../../pages/PhotoUpload";
import VideoUpload from "../../pages/VideoUpload";
import styles from "../../styles/TeacherDashboard.module.css";
import PropTypes from "prop-types";

const TeacherDashboard = ({ user }) => {
  const dispatch = useDispatch();

  // Obtener fotos, videos y aulas desde Redux
  const { photos } = useSelector((state) => state.photos);
  const { videos } = useSelector((state) => state.videos);
  const { classrooms, status: classroomStatus } = useSelector(
    (state) => state.classrooms
  );

  const [selectedClassroom, setSelectedClassroom] = useState("");

  // Fetch de aulas al cargar el componente
  useEffect(() => {
    if (classroomStatus === "idle") {
      dispatch(fetchClassrooms());
    }
  }, [dispatch, classroomStatus]);

  // Fetch de fotos y videos al cambiar el aula seleccionada
  useEffect(() => {
    if (selectedClassroom) {
      dispatch(fetchAllPhotos(selectedClassroom));
      dispatch(fetchAllVideos(selectedClassroom));
    }
  }, [dispatch, selectedClassroom]);

  if (!user) {
    return <p>Error: Información de usuario no disponible</p>;
  }

  const handleClassroomChange = (event) => {
    setSelectedClassroom(event.target.value);
  };

  // Ordenar fotos y videos por el campo 'createdAt', de más reciente a más antiguo
  const sortedPhotos = [...photos].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const sortedVideos = [...videos].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Bienvenido, {user.name || "Profesor"}</h1>
      <div className={styles["upload-container"]}>
        <PhotoUpload userId={user.name} />
        <VideoUpload userId={user.name} /> {/* Carga de videos */}
      </div>
      {/* Select para elegir aula */}
      <select
        className={styles["form-control"]}
        value={selectedClassroom}
        onChange={handleClassroomChange}
      >
        <option value="">Selecciona un aula</option>
        {classrooms.map((classroom) => (
          <option key={classroom.id} value={classroom.id}>
            {classroom.name}
          </option>
        ))}
      </select>
      <h2>Todas las Fotos y Videos</h2>
      {/* Fotos ordenadas */}
      <div className={styles.grid}>
        {sortedPhotos.map((media) => (
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
      {/* Videos ordenados */}
      <div className={styles.grid}>
        {sortedVideos.map((video) => (
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

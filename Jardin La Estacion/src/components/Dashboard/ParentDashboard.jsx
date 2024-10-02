import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClassroomPhotos } from "../../features/photos/photosSlice";
import styles from "../../styles/ParentDashboard.module.css";
import PropTypes from "prop-types";
const ParentDashboard = ({ user }) => {
  const dispatch = useDispatch();
  const { photos, loading, error } = useSelector((state) => state.photos);
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [fullscreenPhotoIndex, setFullscreenPhotoIndex] = useState(null);
  const controls = "modal-controls";
  useEffect(() => {
    if (selectedClassroom) {
      dispatch(fetchClassroomPhotos(selectedClassroom));
    }
  }, [dispatch, selectedClassroom]);

  const handleClassroomChange = (event) => {
    setSelectedClassroom(event.target.value);
  };

  const openFullscreen = (index) => {
    setFullscreenPhotoIndex(index);
  };

  const closeFullscreen = () => {
    setFullscreenPhotoIndex(null);
  };

  const navigatePhoto = (direction) => {
    setFullscreenPhotoIndex((prevIndex) => {
      if (prevIndex === null) return null;
      const newIndex = (prevIndex + direction + photos.length) % photos.length;
      return newIndex;
    });
  };

  if (loading) return <p>Cargando fotos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Bienvenido, {user.name}</h1>

      <select
        className={styles["form-control"]}
        value={selectedClassroom}
        onChange={handleClassroomChange}
      >
        <option value="">Selecciona un aula</option>
        <option value="aula1">Aula 1</option>
        <option value="aula2">Aula 2</option>
        <option value="aula3">Aula 3</option>
      </select>

      <div className={styles.grid}>
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={styles.card}
            onClick={() => openFullscreen(index)}
          >
            <img src={photo.url} alt={`Foto de la clase ${photo.classId}`} />
            <p>Clase: {photo.classroomId}</p>
            <p>Clase: {photo.description}</p>
          </div>
        ))}
      </div>

      {fullscreenPhotoIndex !== null && (
        <div className={styles.modal}>
          <img src={photos[fullscreenPhotoIndex].url} alt="Imagen ampliada" />
          <div className={styles.modal - controls}>
            <button onClick={() => navigatePhoto(-1)}>Anterior</button>
            <button onClick={closeFullscreen}>Cerrar</button>
            <button onClick={() => navigatePhoto(1)}>Siguiente</button>
          </div>
        </div>
      )}
    </div>
  );
};
ParentDashboard.propTypes = {
  user: PropTypes.object.isRequired,
};

export default ParentDashboard;

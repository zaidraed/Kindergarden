import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClassroomPhotos } from "../../features/photos/photosSlice";
import { fetchClassroomVideos } from "../../features/videos/videosSlice";
import { fetchClassrooms } from "../../features/classrooms/classroomSlice"; // Importamos la acción para obtener aulas
import styles from "../../styles/ParentDashboard.module.css";
import PropTypes from "prop-types";

const ParentDashboard = ({ user }) => {
  const dispatch = useDispatch();

  // Obtener fotos, videos, y aulas desde Redux
  const { photos } = useSelector((state) => state.photos);
  const { videos } = useSelector((state) => state.videos);
  const { classrooms, status: classroomStatus } = useSelector(
    (state) => state.classrooms
  );

  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [fullscreenPhotoIndex, setFullscreenPhotoIndex] = useState(null);
  const [fullscreenVideoIndex, setFullscreenVideoIndex] = useState(null);
  const [touchStartX, setTouchStartX] = useState(null);

  // Fetch de las aulas al montar el componente
  useEffect(() => {
    if (classroomStatus === "idle") {
      dispatch(fetchClassrooms());
    }
  }, [dispatch, classroomStatus]);

  // Fetch de las fotos y videos al seleccionar aula
  useEffect(() => {
    if (selectedClassroom) {
      dispatch(fetchClassroomPhotos(selectedClassroom));
      dispatch(fetchClassroomVideos(selectedClassroom));
    }
  }, [dispatch, selectedClassroom]);

  const handleClassroomChange = (event) => {
    setSelectedClassroom(event.target.value);
  };

  const openFullscreenPhoto = (index) => {
    setFullscreenPhotoIndex(index);
  };

  const closeFullscreenPhoto = () => {
    setFullscreenPhotoIndex(null);
  };

  const openFullscreenVideo = (index) => {
    setFullscreenVideoIndex(index);
  };

  const closeFullscreenVideo = () => {
    setFullscreenVideoIndex(null);
  };

  const handleNextPhoto = () => {
    setFullscreenPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    setFullscreenPhotoIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  const handleNextVideo = () => {
    setFullscreenVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const handlePrevVideo = () => {
    setFullscreenVideoIndex((prevIndex) =>
      prevIndex === 0 ? videos.length - 1 : prevIndex - 1
    );
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEndPhoto = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 50) {
      handleNextPhoto();
    } else if (touchEndX - touchStartX > 50) {
      handlePrevPhoto();
    }
  };

  const handleTouchEndVideo = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 50) {
      handleNextVideo();
    } else if (touchEndX - touchStartX > 50) {
      handlePrevVideo();
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Bienvenido, {user.name}</h1>
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
      {/* Photo Section */}
      <div className={styles.grid}>
        {photos.map((photo, index) => (
          <div key={photo.id} className={styles.card}>
            <img
              src={photo.url}
              alt={photo.description || "Classroom photo"}
              onClick={() => openFullscreenPhoto(index)}
            />
            <p>Descripción: {photo.description}</p>
          </div>
        ))}
      </div>
      <div className={styles.sectionDivider}></div> {/* Línea divisoria */}
      {/* Video Section */}
      <div className={styles.grid}>
        {videos.map((video, index) => (
          <div key={video.id} className={styles.card}>
            <video
              src={video.url}
              poster={video.thumbnail}
              onMouseEnter={(e) => e.target.play()}
              onMouseLeave={(e) => e.target.pause()}
              onClick={() => openFullscreenVideo(index)}
              controls={false}
              muted
            />
            <p>{video.description}</p>
          </div>
        ))}
      </div>
      {/* Fullscreen Photo Viewer */}
      {fullscreenPhotoIndex !== null && (
        <div
          className={styles.fullscreenViewer}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEndPhoto}
          onClick={closeFullscreenPhoto}
        >
          <button
            className={styles.prevButton}
            onClick={(e) => {
              e.stopPropagation();
              handlePrevPhoto();
            }}
          >
            ⟨
          </button>
          <img
            src={photos[fullscreenPhotoIndex].url}
            alt={photos[fullscreenPhotoIndex].description}
            className={styles.fullscreenImage}
          />
          <button
            className={styles.nextButton}
            onClick={(e) => {
              e.stopPropagation();
              handleNextPhoto();
            }}
          >
            ⟩
          </button>
          <button
            className={styles.closeButton}
            onClick={(e) => {
              e.stopPropagation();
              closeFullscreenPhoto();
            }}
          >
            ✖
          </button>
        </div>
      )}
      {/* Fullscreen Video Player */}
      {fullscreenVideoIndex !== null && (
        <div
          className={styles.fullscreenViewer}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEndVideo}
        >
          <button className={styles.prevButton} onClick={handlePrevVideo}>
            ⟨
          </button>
          <video
            src={videos[fullscreenVideoIndex].url}
            controls
            autoPlay
            className={styles.fullscreenVideo}
          />
          <button className={styles.nextButton} onClick={handleNextVideo}>
            ⟩
          </button>
          <button className={styles.closeButton} onClick={closeFullscreenVideo}>
            ✖
          </button>
        </div>
      )}
    </div>
  );
};

ParentDashboard.propTypes = {
  user: PropTypes.object.isRequired,
};

export default ParentDashboard;

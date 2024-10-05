import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClassroomPhotos } from "../../features/photos/photosSlice";
import { fetchClassroomVideos } from "../../features/photos/videoSlice";
import styles from "../../styles/ParentDashboard.module.css";
import PropTypes from "prop-types";

const ParentDashboard = ({ user }) => {
  const dispatch = useDispatch();
  const { photos } = useSelector((state) => state.photos);
  const { videos } = useSelector((state) => state.videos);
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [fullscreenPhotoIndex, setFullscreenPhotoIndex] = useState(null);
  const [fullscreenVideoIndex, setFullscreenVideoIndex] = useState(null);
  const [touchStartX, setTouchStartX] = useState(null);

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
      handleNextPhoto(); // Swipe left (next)
    } else if (touchEndX - touchStartX > 50) {
      handlePrevPhoto(); // Swipe right (previous)
    }
  };

  const handleTouchEndVideo = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 50) {
      handleNextVideo(); // Swipe left (next)
    } else if (touchEndX - touchStartX > 50) {
      handlePrevVideo(); // Swipe right (previous)
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
        <option value="aula1">Aula 1</option>
        <option value="aula2">Aula 2</option>
        <option value="aula3">Aula 3</option>
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
              e.stopPropagation(); // Evita que se cierre al hacer click en la flecha
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
              e.stopPropagation(); // Evita que se cierre al hacer click en la flecha
              handleNextPhoto();
            }}
          >
            ⟩
          </button>
          <button
            className={styles.closeButton}
            onClick={(e) => {
              e.stopPropagation(); // Evita que se cierre al hacer click en otras áreas
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

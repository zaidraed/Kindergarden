import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadVideo } from "../features/videos/videosSlice";
import { fetchClassrooms } from "../features/classrooms/classroomSlice"; // Importamos la acción para obtener aulas
import styles from "../styles/VideoUpload.module.css";
import PropTypes from "prop-types";

const VideoUpload = ({ classroomId: initialClassroomId }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.videos);
  const { classrooms, status: classroomStatus } = useSelector(
    (state) => state.classrooms
  );

  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [classroomId, setClassroomId] = useState(initialClassroomId || "");
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  // Fetch de aulas al montar el componente
  useEffect(() => {
    if (classroomStatus === "idle") {
      dispatch(fetchClassrooms());
    }
  }, [dispatch, classroomStatus]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setFile(selectedFile);
    } else {
      setUploadStatus("Por favor, seleccione un archivo de video válido.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file && classroomId && description) {
      setUploading(true);
      setUploadStatus("");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("classroomId", classroomId);
      formData.append("description", description);

      try {
        await dispatch(uploadVideo({ formData, classroomId })).unwrap();
        setFile(null);
        setDescription("");
        setClassroomId("");
        setUploadStatus("Video subido con éxito");
      } catch (error) {
        console.error("Error al subir el video:", error);
        setUploadStatus(
          error.message ||
            "Error al subir el video. Por favor, inténtelo de nuevo."
        );
      } finally {
        setUploading(false);
      }
    } else {
      setUploadStatus("Por favor, complete todos los campos necesarios.");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Subir Nuevo Video</h2>

      <label className={styles.button}>
        Seleccionar Video
        <input
          type="file"
          hidden
          onChange={handleFileChange}
          accept="video/*"
        />
      </label>
      {file && <p className={styles.fileName}>{file.name}</p>}

      <textarea
        className={styles.textField}
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
      />

      <select
        className={styles.select}
        value={classroomId}
        onChange={(e) => setClassroomId(e.target.value)}
      >
        <option value="">Seleccione un aula</option>
        {classrooms.map((classroom) => (
          <option key={classroom.id} value={classroom.id}>
            {classroom.name}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className={styles.button}
        disabled={loading || !file || !classroomId || !description || uploading}
      >
        {loading || uploading ? "Subiendo..." : "Subir Video"}
      </button>

      {uploadStatus && <p className={styles.status}>{uploadStatus}</p>}
      {error && (
        <p className={styles.error}>{error.message || JSON.stringify(error)}</p>
      )}
    </form>
  );
};

VideoUpload.propTypes = {
  classroomId: PropTypes.string,
};

export default VideoUpload;

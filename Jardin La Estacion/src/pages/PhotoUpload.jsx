import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadPhoto } from "../features/photos/photosSlice";
import { fetchClassrooms } from "../features/classrooms/classroomSlice"; // Importamos la acción para obtener aulas
import PropTypes from "prop-types";
import styles from "../styles/PhotoUpload.module.css";

const PhotoUpload = ({ classroomId: initialClassroomId }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.photos);
  const { classrooms, status: classroomStatus } = useSelector(
    (state) => state.classrooms
  );

  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [classroomId, setClassroomId] = useState(initialClassroomId || "");

  // Fetch de aulas al montar el componente
  useEffect(() => {
    if (classroomStatus === "idle") {
      dispatch(fetchClassrooms());
    }
  }, [dispatch, classroomStatus]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
    } else {
      alert("Por favor, seleccione un archivo de imagen válido.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file && classroomId && description) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("classroomId", classroomId);
      formData.append("description", description);

      await dispatch(uploadPhoto({ formData, classroomId }));

      setFile(null);
      setDescription("");
      setClassroomId("");
    } else {
      alert("Por favor, complete todos los campos necesarios.");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Subir Nueva Foto</h2>

      <label className={styles.button}>
        Seleccionar Foto
        <input
          type="file"
          hidden
          onChange={handleFileChange}
          accept="image/*"
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
        disabled={loading || !file || !classroomId || !description}
      >
        {loading ? "Subiendo..." : "Subir Foto"}
      </button>

      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
};

PhotoUpload.propTypes = {
  classroomId: PropTypes.string,
};

export default PhotoUpload;

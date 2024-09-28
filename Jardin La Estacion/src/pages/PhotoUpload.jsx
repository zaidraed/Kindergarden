import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { uploadPhoto } from "../features/photos/photosSlice";
import PropTypes from "prop-types";

// Lista de aulas de ejemplo
const classrooms = [
  { id: "aula1", name: "Aula 1" },
  { id: "aula2", name: "Aula 2" },
  { id: "aula3", name: "Aula 3" },
  { id: "aula4", name: "Aula 4" },
  { id: "aula5", name: "Aula 5" },
];

const PhotoUpload = ({ classroomId: initialClassroomId }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.photos);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [classroomId, setClassroomId] = useState(initialClassroomId || "");

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
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ "& > *": { margin: 1 } }}
    >
      <Typography variant="h6">Subir Nueva Foto</Typography>

      <Button variant="contained" component="label">
        Seleccionar Foto
        <input
          type="file"
          hidden
          onChange={handleFileChange}
          accept="image/*"
        />
      </Button>
      {file && <Typography variant="body2">{file.name}</Typography>}

      <TextField
        label="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        rows={2}
      />

      <FormControl fullWidth>
        <InputLabel id="classroom-select-label">Aula</InputLabel>
        <Select
          labelId="classroom-select-label"
          value={classroomId}
          onChange={(e) => setClassroomId(e.target.value)}
          label="Aula"
        >
          <MenuItem value="">
            <em>Seleccione un aula</em>
          </MenuItem>
          {classrooms.map((classroom) => (
            <MenuItem key={classroom.id} value={classroom.id}>
              {classroom.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading || !file || !classroomId || !description}
        startIcon={loading && <CircularProgress size={20} />}
      >
        {loading ? "Subiendo..." : "Subir Foto"}
      </Button>

      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

PhotoUpload.propTypes = {
  classroomId: PropTypes.string,
};

export default PhotoUpload;

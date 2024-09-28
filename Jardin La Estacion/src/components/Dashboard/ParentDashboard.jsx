import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Modal,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { fetchClassroomPhotos } from "../../features/photos/photosSlice";

const ParentDashboard = ({ user }) => {
  const dispatch = useDispatch();
  const { photos, loading, error } = useSelector((state) => state.photos);
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [fullscreenPhotoIndex, setFullscreenPhotoIndex] = useState(null);

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
      if (prevIndex === null) return null; // Asegúrate de que prevIndex no sea null
      const newIndex = (prevIndex + direction + photos.length) % photos.length; // Asegúrate de que el nuevo índice esté dentro de los límites
      return newIndex; // Devuelve el nuevo índice
    });
  };

  if (loading) return <Typography>Cargando fotos...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div className="p-4">
      <Typography variant="h4" component="h1" className="mb-4">
        Bienvenido, {user.name}
      </Typography>

      <FormControl fullWidth variant="outlined" className="mb-4">
        <InputLabel>Aula</InputLabel>
        <Select
          value={selectedClassroom}
          onChange={handleClassroomChange}
          label="Aula"
        >
          <MenuItem value="aula1">Aula 1</MenuItem>
          <MenuItem value="aula2">Aula 2</MenuItem>
          <MenuItem value="aula3">Aula 3</MenuItem>
        </Select>
      </FormControl>

      <Grid container spacing={2}>
        {photos.map((photo, index) => (
          <Grid item xs={6} sm={4} md={3} key={photo.id}>
            <Card
              onClick={() => openFullscreen(index)}
              className="cursor-pointer"
            >
              <CardMedia
                component="img"
                className="w-full h-32 object-cover"
                image={photo.url}
                alt={`Foto de la clase ${photo.classId}`}
              />
              <CardContent>
                <Typography variant="caption" display="block">
                  Clase: {photo.classroomId}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal
        open={fullscreenPhotoIndex !== null}
        onClose={closeFullscreen}
        className="flex items-center justify-center"
      >
        <div className="relative bg-black w-full h-full flex flex-col">
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-gray-800 bg-opacity-75 z-10">
            <Typography variant="h6" className="text-white">
              Foto{" "}
              {fullscreenPhotoIndex !== null ? fullscreenPhotoIndex + 1 : 0} de{" "}
              {photos.length}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={closeFullscreen}
              startIcon={<CloseIcon />}
            >
              Cerrar
            </Button>
          </div>
          <div className="flex-grow flex items-center justify-center p-4 overflow-hidden">
            {fullscreenPhotoIndex !== null && (
              <img
                src={photos[fullscreenPhotoIndex]?.url}
                alt={photos[fullscreenPhotoIndex]?.description}
                className="max-w-full object-contain"
                style={{ maxHeight: "90vh", width: "auto" }}
              />
            )}
          </div>
          <IconButton
            onClick={() => navigatePhoto(-1)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 bg-opacity-75 hover:bg-opacity-100 z-10"
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={() => navigatePhoto(1)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 bg-opacity-75 hover:bg-opacity-100 z-10"
          >
            <ChevronRightIcon />
          </IconButton>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-800 bg-opacity-75 z-10">
            <Typography variant="body1" className="text-white">
              {fullscreenPhotoIndex !== null &&
                photos[fullscreenPhotoIndex]?.description}
            </Typography>
          </div>
        </div>
      </Modal>
    </div>
  );
};

ParentDashboard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default ParentDashboard;

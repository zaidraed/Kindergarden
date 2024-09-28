import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Grid, Card, CardMedia, CardContent } from "@mui/material";
import { fetchAllPhotos } from "../../features/photos/photosSlice";
import PhotoUpload from "../../pages/PhotoUpload";
import PropTypes from "prop-types";

function TeacherDashboard({ user }) {
  const dispatch = useDispatch();
  const { photos, loading, error } = useSelector((state) => state.photos);

  useEffect(() => {
    dispatch(fetchAllPhotos());
  }, [dispatch]);

  if (loading) return <Typography>Cargando fotos...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!user) {
    return <Typography>Error: Información de usuario no disponible</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Bienvenido, {user.name || "Profesor"}
      </Typography>
      {/* Elimina la referencia a classroomId */}
      <PhotoUpload userId={user.name} />
      <Typography variant="h5" component="h2" gutterBottom>
        Todas las Fotos
      </Typography>
      <Grid container spacing={2}>
        {photos.map((photo) => (
          <Grid item xs={12} sm={6} md={4} key={photo.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={photo.url}
                alt={`Foto de la clase ${photo.classId}`}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {photo.description}
                </Typography>
                <Typography variant="caption" display="block">
                  Clase: {photo.classroomId}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

TeacherDashboard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    classroomId: PropTypes.string,
  }),
};

export default TeacherDashboard;

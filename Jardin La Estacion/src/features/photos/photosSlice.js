import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchClassroomPhotos = createAsyncThunk(
  "photos/fetchClassroomPhotos",
  async (classroomId, thunkAPI) => {
    try {
      const response = await api.get(`/photos/classroom/${classroomId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const uploadPhoto = createAsyncThunk(
  "photos/uploadPhoto",
  async ({ formData, classroomId }, thunkAPI) => {
    try {
      const response = await api.post(
        `/photos/upload/${classroomId}`, // La ruta debe contener el classroomId
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }, // Indicar multipart/form-data
        }
      );
      return response.data; // Retornar la respuesta del backend
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error al subir la foto"
      ); // Manejar error
    }
  }
);

export const fetchAllPhotos = createAsyncThunk(
  "photos/fetchAllPhotos",
  async () => {
    const response = await api.get("/photos/all");
    return response.data;
  }
);

const photosSlice = createSlice({
  name: "photos",
  initialState: {
    photos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassroomPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassroomPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.photos = action.payload;
      })
      .addCase(fetchClassroomPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.photos.push(action.payload);
      })
      .addCase(uploadPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.photos = action.payload;
      })
      .addCase(fetchAllPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default photosSlice.reducer;

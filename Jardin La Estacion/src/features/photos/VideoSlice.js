import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchClassroomVideos = createAsyncThunk(
  "videos/fetchClassroomVideos",
  async (classroomId, thunkAPI) => {
    try {
      const response = await api.get(`/api/videos/classroom/${classroomId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error al obtener los videos"
      );
    }
  }
);

export const uploadVideo = createAsyncThunk(
  "videos/uploadVideo",
  async ({ formData, classroomId }, thunkAPI) => {
    try {
      const response = await api.post(
        `/api/videos/upload/${classroomId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error al subir el video"
      );
    }
  }
);

export const fetchAllVideos = createAsyncThunk(
  "videos/fetchAllVideos",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/api/videos/all");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error al obtener todos los videos"
      );
    }
  }
);

const videosSlice = createSlice({
  name: "videos",
  initialState: {
    videos: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearVideos: (state) => {
      state.videos = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassroomVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassroomVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload;
      })
      .addCase(fetchClassroomVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.videos.push(action.payload);
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload;
      })
      .addCase(fetchAllVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearVideos, clearError } = videosSlice.actions;
export default videosSlice.reducer;

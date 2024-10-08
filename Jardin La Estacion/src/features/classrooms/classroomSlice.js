import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Thunks
export const fetchClassrooms = createAsyncThunk(
  "classrooms/fetchClassrooms",
  async () => {
    const response = await api.get("/api/classrooms");
    console.log("response.data:", response.data);
    return response.data;
  }
);

export const createClassroom = createAsyncThunk(
  "classrooms/createClassroom",
  async (classroomData) => {
    const { name, teacherIds } = classroomData; // Extraemos name y teacherIds
    const response = await api.post("/api/classrooms", { name, teacherIds }); // Enviamos ambos campos

    return response.data;
  }
);

export const updateClassroom = createAsyncThunk(
  "classrooms/updateClassroom",
  async ({ id, ...updateData }) => {
    const { name, teacherIds } = updateData;
    const response = await api.put(`/api/classrooms/${id}`, {
      name,
      teacherIds,
    });
    return response.data;
  }
);

export const deleteClassroom = createAsyncThunk(
  "classrooms/deleteClassroom",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/classrooms/${id}`);
      return id;
    } catch (error) {
      console.error("Error deleting classroom:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

const classroomSlice = createSlice({
  name: "classrooms",
  initialState: {
    classrooms: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassrooms.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchClassrooms.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.classrooms = action.payload;
      })
      .addCase(fetchClassrooms.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createClassroom.fulfilled, (state, action) => {
        state.classrooms.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(updateClassroom.fulfilled, (state, action) => {
        const index = state.classrooms.findIndex(
          (classroom) => classroom.id === action.payload.id
        );
        if (index !== -1) {
          state.classrooms[index] = action.payload;
        }
        state.status = "succeeded";
      })
      .addCase(deleteClassroom.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteClassroom.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.classrooms = state.classrooms.filter(
          (classroom) => classroom.id !== action.payload
        );
      })
      .addCase(deleteClassroom.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error al eliminar el aula";
      });
  },
});

export default classroomSlice.reducer;

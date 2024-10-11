import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (token, thunkAPI) => {
    try {
      const response = await api.post("/api/auth/google-login", { token });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await api.post("/api/auth/login", credentials);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

// Thunk para registrar un nuevo usuario
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await api.post("/api/auth/register", userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

// Thunk para obtener usuarios (si es necesario)
export const fetchUsers = createAsyncThunk("/auth/fetchusers", async () => {
  const response = await api.get("api/auth/users?include=classrooms");

  return response.data;
});

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (userData) => {
    const response = await api.patch(`/api/auth/update-role`, userData);
    return response.data;
  }
);
export const assignTeacherToClassroom = createAsyncThunk(
  "users/assignTeacherToClassroom",
  async ({ userId, classroomId }) => {
    const response = await api.post(`/api/users/${userId}/assign`, {
      classroomId,
    });
    return response.data;
  }
);

export const toggleUseractive = createAsyncThunk(
  "auth/toggleUseractive",
  async (userEmail, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/auth/toggle-active`, {
        email: userEmail,
      });
      return response.data; // Puedes devolver el resultado completo o solo el estado actualizado si lo deseas
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      // Log the error for debugging
      console.error("Error in forgotPassword thunk:", error);

      // Return a more informative error message
      return rejectWithValue(
        error.response?.data?.message ||
          "An error occurred while processing your request"
      );
    }
  }
);
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, thunkAPI) => {
    try {
      const response = await api.post("/api/auth/reset-password", {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  status: "idle",
  error: null,
  users: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // El token será eliminado en el backend cuando el usuario cierre sesión (logout)
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al obtener usuarios";
      })
      .addCase(toggleUseractive.fulfilled, (state, action) => {
        const userEmail = action.payload.email;
        const user = state.users.find((user) => user.email === userEmail);
        if (user) {
          // Toggle the active status
          user.Active = !user.Active;
        }
      })
      .addCase(assignTeacherToClassroom.fulfilled, (state, action) => {
        // Actualizamos el estado del usuario asignado a un aula
        const index = state.users.findIndex(
          (user) => user.id === action.payload.userId
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(toggleUseractive.rejected, (state, action) => {
        // Manejo de errores, si es necesario
        state.error = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;

export default authSlice.reducer;

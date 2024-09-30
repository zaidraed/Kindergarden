import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await api.post("/auth/login", credentials);
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
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

// Thunk para obtener usuarios (si es necesario)
export const fetchUsers = createAsyncThunk("auth/fetchusers", async () => {
  const response = await api.get("/auth/users");
  console.log("fetchUsers:", response.data);
  return response.data;
});

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (userData) => {
    const response = await api.patch(
      `/auth/update-role/${userData.id}`,
      userData
    );
    return response.data;
  }
);

export const disableUser = createAsyncThunk(
  "auth/disableUser",
  async (userId) => {
    await api.patch(`/auth/${userId}`);
    return userId; // Retorna el ID para eliminar del estado
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
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
        state.error = null; // Limpia cualquier error anterior
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false; // Detiene la carga
        state.users = action.payload; // Guarda los usuarios
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false; // Detiene la carga
        state.error = action.payload || "Error al obtener usuarios"; // Guarda el error
      });
    //.addCase(updateUser.fulfilled, (state, action) => {
    //  const index = state.users.findIndex(
    //   (user) => user.id === action.payload.id
    // );
    //  if (index !== -1) {
    //    state.users[index] = action.payload; // Actualizar el usuario
    //  }
    // })

    //  .addCase(disableUser.fulfilled, (state, action) => {
    //  state.users = state.users.filter((user) => user.id !== action.payload); // Eliminar usuario
    // });
  },
});

export const { logout, clearAuthError } = authSlice.actions;

export default authSlice.reducer;

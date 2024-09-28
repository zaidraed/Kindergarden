import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import photosReducer from "../features/photos/photosSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    photos: photosReducer,
  },
});

export default store;

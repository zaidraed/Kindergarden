import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import photosReducer from "../features/photos/photosSlice";
import videosReducer from "../features/video/videoSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    photos: photosReducer,
    videos: videosReducer,
  },
});

export default store;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import photosReducer from "../features/photos/photosSlice";
import videosReducer from "../features/videos/videosSlice";
import classroomReducer from "../features/classrooms/classroomSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    photos: photosReducer,
    videos: videosReducer,
    classrooms: classroomReducer,
  },
});

export default store;

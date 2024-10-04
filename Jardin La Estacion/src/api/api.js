import axios from "axios";

const api = axios.create({
  baseURL: kindergarden-production.up.railway.app,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Esto asegura que las cookies se envíen automáticamente
});

export default api;

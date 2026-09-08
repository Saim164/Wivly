import axios from "axios";


const clientServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

clientServer.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default clientServer;
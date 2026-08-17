import axios from "axios";

const clientServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export default clientServer;
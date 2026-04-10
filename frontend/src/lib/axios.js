import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "https://fullstack-chat-app-4gl1.onrender.com/api" : "/api",
  withCredentials: true,
});

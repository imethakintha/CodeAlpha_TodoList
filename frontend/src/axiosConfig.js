import axios from "axios";
import { AuthContext } from "./context/AuthContext.jsx";
import { useContext } from "react";

const useAxios = () => {
  const { token } = useContext(AuthContext);

  const axiosInstance = axios.create();

  axiosInstance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return axiosInstance;
};

export default useAxios;

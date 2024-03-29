import axios, { AxiosError } from "axios";
import { useEffect } from "react";
import { useAuthStore } from "../state/useAuthStore";

const baseURL = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL,
});
export const useAxios = () => {
  const { accessToken, refreshToken } = useAuthStore();

  useEffect(() => {
    const request = instance.interceptors.request.use(
      (config) => {
        if (accessToken) {
          // const current = new Date(Date.now())
          // const expires = new Date(expirationAccessToken! * 1000)

          // if (current > expires && refreshToken) {
          //   // alert("se rompio")
          //   getNewAccessToken({
          //     refreshToken
          //   });
          // }
          config.headers?.setAuthorization(accessToken);
        }
        return config;
      },
      (error) => error,
    );

    const response = instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError) => {
        switch (error.code) {
          case AxiosError.ERR_NETWORK:
            error.message = "Error de conexion con el servidor";
            break;
        }

        return Promise.reject(error);
      },
    );

    return () => {
      instance.interceptors.request.eject(request);
      instance.interceptors.response.eject(response);
    };
  }, [accessToken, refreshToken]);

  return instance;
};

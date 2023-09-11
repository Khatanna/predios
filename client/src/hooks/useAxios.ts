import axios, { AxiosError } from "axios";
import { useEffect } from "react";
import { useAuth } from ".";
import { getNewAccessToken } from "../pages/Login/services";
import Swal from "sweetalert2";

const baseURL = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL,
  // headers: {
  //   Language: "es",
  //   'Access-Control-Allow-Origin': "*"
  // },
  // withCredentials: true
});

export const useAxios = () => {
  const {
    accessToken,
    expirationAccessToken,
    expirationRefreshToken,
    refreshToken,
    logout,
  } = useAuth();
  useEffect(() => {
    if (!accessToken || !refreshToken) {
      return;
    }
    const request = instance.interceptors.request.use(
      async (config) => {
        if (
          expirationAccessToken &&
          expirationAccessToken < Math.floor(Date.now() / 1000)
        ) {
          if (
            expirationRefreshToken &&
            expirationRefreshToken < Math.floor(Date.now() / 1000)
          ) {
            const token = await getNewAccessToken(refreshToken!);
            config.headers?.setAuthorization(token.data.data.accessToken);
          } else {
            Swal.fire({
              icon: "info",
              title: "Mensaje de sesión",
              text: "La sesión expiro",
            });
            logout();
            // Como no existe el refresh token significa que la sesion expiro
          }
        } else {
          config.headers?.setAuthorization(accessToken);
        }
        return config;
      },
      (error: AxiosError) => {
        switch (error.code) {
          case AxiosError.ERR_NETWORK:
            error.message = "Error de conexion";
            break;
        }

        return Promise.reject(error);
      },
    );

    return () => {
      instance.interceptors.request.eject(request);
    };
  }, [
    accessToken,
    refreshToken,
    expirationAccessToken,
    expirationRefreshToken,
    logout,
  ]);

  return instance;
};

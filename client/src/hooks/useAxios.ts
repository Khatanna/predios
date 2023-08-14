import axios, { AxiosError } from "axios";
import { useEffect } from "react";
import { useAuth } from ".";
import { getNewAccessToken } from "../pages/Login/services";

const instance = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    Language: "es",
  },
});

export const useAxios = () => {
  const { accessToken, expirationToken, refreshToken } = useAuth();
  useEffect(() => {
    if (!accessToken) {
      return;
    }
    const request = instance.interceptors.request.use(
      async (config) => {
        console.log("seteando accesstoken");
        // console.log(expirationToken, Date.now() / 1000, new Date(expirationToken!).getTime())
        if (
          expirationToken &&
          expirationToken < Math.floor(Date.now() / 1000)
        ) {
          const token = await getNewAccessToken(refreshToken!);
          config.headers?.setAuthorization(token.data.data.accessToken);
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
  }, [accessToken, refreshToken, expirationToken]);

  return instance;
};

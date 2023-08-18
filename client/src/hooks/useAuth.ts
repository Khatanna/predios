import { useAuthStore } from "../state/useAuthStore";
import { useSessionStore } from "../pages/Login/state";
import { getNewAccessToken } from "../pages/Login/services";

export const useAuth = () => {
  const { isAuth, reset, accessToken, setAccessToken, expirationAccessToken } =
    useAuthStore();
  const { refreshToken, deleteRefreshToken, setRefreshToken, expirationRefreshToken } =
    useSessionStore();

  const logout = () => {
    deleteRefreshToken();
    reset();
  };

  const checkAuth = async () => {
    if (!accessToken && refreshToken) {
      console.log("refrescando el accestoken");
      const response = await getNewAccessToken(refreshToken);
      setAccessToken(response.data.data.accessToken);
    }
  };

  return {
    isAuth,
    logout,
    accessToken,
    refreshToken,
    setAccessToken,
    setRefreshToken,
    checkAuth,
    expirationAccessToken,
    expirationRefreshToken
  };
};

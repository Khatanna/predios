import { useSessionStore } from "../pages/Login/state";
import { useAuthStore } from "../state/useAuthStore";

export const useAuth = () => {
  const { user, isAuth, reset, accessToken, setAccessToken, expirationAccessToken } =
    useAuthStore();
  const { refreshToken, deleteRefreshToken, setRefreshToken, expirationRefreshToken } =
    useSessionStore();

  const logout = () => {
    deleteRefreshToken();
    reset();
  };

  return {
    isAuth,
    logout,
    accessToken,
    refreshToken,
    setAccessToken,
    setRefreshToken,
    expirationAccessToken,
    expirationRefreshToken,
    user
  };
};

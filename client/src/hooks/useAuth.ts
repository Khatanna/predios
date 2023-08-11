import { useAuthStore } from '../state/useAuthStore';
import { useSessionStore } from '../pages/Login/state';
import { getNewAccessToken } from '../pages/Login/services';
import { instance } from '../utilities/config/axios';

export const useAuth = () => {
  const { isAuth, reset, accessToken, setAccessToken, expirationToken } = useAuthStore();
  const { refreshToken, deleteRefreshToken, setRefreshToken } = useSessionStore();

  const logout = () => {
    deleteRefreshToken();
    reset()
  }

  // const checkTokenExpiration = () => {
  //   if (accessToken && expirationToken) {
  //     const currentTime = Date.now();

  //     if (currentTime > expirationToken) {
  //       console.log("el token exprio")
  //     } else {
  //       console.log("el token aun no expiro")
  //     }
  //   }
  // }

  const checkAuth = async () => {
    if (!accessToken && refreshToken) {
      console.log("refrescando el accestoken")
      const response = await getNewAccessToken(refreshToken);
      setAccessToken(response.data.data.accessToken)
    }
  }

  return {
    isAuth,
    logout,
    accessToken,
    refreshToken,
    setAccessToken,
    setRefreshToken,
    checkAuth,
    expirationToken
  }
}
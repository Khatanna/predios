import { useAuthStore } from '../../../state/useAuthStore';
import { useSessionStore } from '../state';

export const useAuth = () => {
  const { isAuth, reset } = useAuthStore();
  const { deleteRefreshToken } = useSessionStore();

  const logout = () => {
    deleteRefreshToken();
    reset()
  }

  return {
    isAuth,
    logout
  }
}
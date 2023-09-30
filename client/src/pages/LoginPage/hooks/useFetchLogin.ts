import { useAuth } from '../../../hooks';
import { useCustomMutation } from '../../../hooks/useCustomMutation';
import type { LoginResponse, FormLoginValues } from "../models/types";
import { customSwalError } from '../../../utilities/alerts';

const LOGIN_MUTATION = `
	mutation Login($username: String, $password: String)	{
		auth: login(username: $username, password: $password) {
      accessToken
      refreshToken
    }
	}
`;

export const useFetchLogin = () => {
  const { setRefreshToken, setAccessToken } = useAuth()
  const [login, { isLoading }] = useCustomMutation<LoginResponse, FormLoginValues>(LOGIN_MUTATION, {
    onSuccess({ auth: { accessToken, refreshToken } }) {
      setRefreshToken(refreshToken);
      setAccessToken(accessToken);
    },
    onError(error) {
      customSwalError(error, 'Intento de inicio de sesión fallido')
    }
  }, {
    headers: {
      operation: 'Login',
    }
  });

  return {
    isLoading,
    login
  }
}
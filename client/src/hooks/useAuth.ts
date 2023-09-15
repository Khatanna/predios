import { useMutation } from "@tanstack/react-query";
import { useSessionStore } from "../pages/Login/state";
import { useAuthStore } from "../state/useAuthStore";
import { customSwalError } from "../utilities/alerts";
import axios, { AxiosError, AxiosResponse } from "axios";
import { GraphQLErrorResponse } from "../types";
const GET_NEW_ACCESS_TOKEN_QUERY = `
	mutation GetNewAccessToken($refreshToken: String)	{
		accessToken: getNewAccessToken(refreshToken: $refreshToken)
	}
`;
const baseURL = import.meta.env.VITE_API_URL;
export const useAuth = () => {
  const { user, isAuth, reset, accessToken, setAccessToken, expirationAccessToken } =
    useAuthStore();
  const { refreshToken, deleteRefreshToken, setRefreshToken, expirationRefreshToken } =
    useSessionStore();

  const logout = () => {
    deleteRefreshToken();
    reset();
  };

  const { mutate: getNewAccessToken } = useMutation<AxiosResponse<{ accessToken: string }>, AxiosError<GraphQLErrorResponse>>({
    async mutationFn() {
      return (await axios.post(
        baseURL,
        {
          query: GET_NEW_ACCESS_TOKEN_QUERY,
          variables: {
            refreshToken,
          },
        },
        { headers: { operation: "Login" } },
      )).data;
    },
    onSuccess({ data }) {
      setAccessToken(data.accessToken)
    },
    onError(e) {
      customSwalError(e.response!.data.errors[0].message, "Mensaje de sesión");
      logout();
    }
  })

  return {
    isAuth,
    logout,
    accessToken,
    refreshToken,
    setAccessToken,
    setRefreshToken,
    expirationAccessToken,
    expirationRefreshToken,
    user,
    getNewAccessToken
  };
};

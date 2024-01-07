import { gql, useMutation } from "@apollo/client";
import { useAuth } from "../../../hooks";
import { customSwalError } from "../../../utilities/alerts";
import type { FormLoginValues, LoginResponse } from "../models/types";

const LOGIN_MUTATION = gql`
  mutation Login($username: String, $password: String) {
    auth: login(username: $username, password: $password) {
      accessToken
      refreshToken
    }
  }
`;

export const useFetchLogin = () => {
  const { setRefreshToken, setAccessToken } = useAuth();
  const [login, { loading }] = useMutation<LoginResponse, FormLoginValues>(
    LOGIN_MUTATION,
    {
      onCompleted({ auth: { accessToken, refreshToken } }) {
        setRefreshToken(refreshToken);
        setAccessToken(accessToken);
      },
      onError(error) {
        customSwalError(error.message, "Intento de inicio de sesión fallido");
      },
      context: {
        headers: {
          operation: "Login",
        },
      },
    },
  );

  return {
    isLoading: loading,
    login,
  };
};

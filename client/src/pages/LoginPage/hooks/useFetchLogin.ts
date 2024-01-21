import { gql, useMutation } from "@apollo/client";
import { useAuthStore } from "../../../state/useAuthStore";
import { customSwalError } from "../../../utilities/alerts";
import type { FormLoginValues, LoginResponse } from "../models/types";

const LOGIN_MUTATION = gql`
  mutation Login($username: String, $password: String) {
    auth: login(username: $username, password: $password) {
      accessToken
      refreshToken
      user {
        username
        role {
          name
          permissions {
            permission {
              level
              resource
            }
          }
        }
      }
    }
  }
`;

export const useFetchLogin = () => {
  const { setRefreshToken, setAccessToken, setUser, logout } = useAuthStore();
  return useMutation<LoginResponse, FormLoginValues>(LOGIN_MUTATION, {
    onCompleted({ auth: { accessToken, refreshToken, user } }) {
      setRefreshToken(refreshToken);
      setAccessToken(accessToken);
      setUser(user);
    },
    onError(error) {
      customSwalError(error.message, "Intento de inicio de sesión fallido");
      logout();
    },
    context: {
      headers: {
        operation: "Login",
      },
    },
  });
};

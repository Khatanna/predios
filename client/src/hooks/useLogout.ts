import { gql, useMutation } from "@apollo/client";
import { useAuthStore } from "../state/useAuthStore";
import { toast } from "sonner";
import { logoutAdapter } from "../components/adapters/logout.adapter";

type LogoutMutationResponse = {
  logout: boolean;
};
type LogoutMutationVariables = { username: string; token: string };

const LOGOUT = gql`
  mutation Logout($username: String, $token: String) {
    logout(username: $username, token: $token)
  }
`;

export const useLogout = () => {
  const { logout, user, refreshToken } = useAuthStore();
  const [logoutMutation, mutation] = useMutation<
    LogoutMutationResponse,
    LogoutMutationVariables
  >(LOGOUT, {
    onCompleted(data) {
      const { isLogout } = logoutAdapter(data);

      if (isLogout) {
        logout();
      }
    },
  });
  const closeSession = () => {
    if (!user || !refreshToken) return;

    toast.promise(
      logoutMutation({
        variables: { username: user.username, token: refreshToken },
      }),
      {
        loading: "Cerrando sesión",
      },
    );
  };

  return {
    closeSession,
    ...mutation,
  };
};

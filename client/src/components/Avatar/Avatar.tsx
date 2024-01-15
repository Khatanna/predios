import { gql, useMutation } from "@apollo/client";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Dropdown } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import { toast } from "sonner";
import { Tooltip } from "../Tooltip";
import { useAuthStore } from "../../state/useAuthStore";

const LOGOUT = gql`
  mutation Logout($username: String, $token: String) {
    logout(username: $username, token: $token)
  }
`;

const Avatar: React.FC = () => {
  const queryClient = useQueryClient();
  const { logout: logoutLocal, user, refreshToken } = useAuthStore();

  const [logout] = useMutation<
    { logout: boolean },
    { username: string; token: string }
  >(LOGOUT, {
    onCompleted({ logout }) {
      if (logout) {
        logoutLocal();
      }
    },
  });

  const handleLogout = () => {
    if (user && refreshToken) {
      const promise = logout({
        variables: { username: user.username, token: refreshToken },
      });
      toast.promise(promise, {
        loading: "Cerrando sesión",
      });

      queryClient.clear();
    }
  };

  return (
    <>
      <div className="mx-4 align-items-center d-flex flex-column">
        <div className="text-success fw-bold">{user?.username}</div>
        <div className="text-warning fw-medium">
          <small>{user?.role.name ?? "usuario sin rol"}</small>
        </div>
      </div>
      <div className="d-flex justify-content-center flex-column align-items-center">
        <Tooltip label="Mi Perfil" placement="bottom-end">
          <Dropdown align={"end"} role="button">
            <Dropdown.Toggle as={PersonCircle} fontSize={32} />
            <Dropdown.Menu>
              {/* <Dropdown.Item>👁‍🗨 Mi cuenta</Dropdown.Item>
              <Dropdown.Item>⚙ Configuraciones</Dropdown.Item> */}
              <Dropdown.Item onClick={handleLogout}>
                🔐 Cerrar sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Tooltip>
      </div>
    </>
  );
};

export default Avatar;

import React from "react";
import { Dropdown, Spinner } from "react-bootstrap";
import { ThreeDotsVertical } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { User } from "../../models/types";
import { useCustomMutation } from "../../../../hooks";
import { customSwalError, customSwalSuccess } from "../../../../utilities/alerts";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";

export type DropdownMenuProps = {
  user: Omit<User, 'createdAt'>;
};

const DELETE_USER_BY_USERNAME_MUTATION = `
  mutation DeleteUserByUsername ($username: String){
    result: deleteUserByUsername(username: $username) {
      deleted
    }
  }
`;

const DISABLE_USER_MUTATION = `
  mutation UpdateStateUserByUsername ($input: UpdateUserByUsernameInput) {
    result: updateStateUserByUsername(input: $input) {
      updated
    }
  }
`

const DropdownMenu: React.FC<DropdownMenuProps> = ({ user }) => {
  const queryClient = useQueryClient();
  const [disableUser, { isLoading }] = useCustomMutation<{ result: { updated: boolean } }, { input: { username: string, data: Pick<User, 'status'> } }>(DISABLE_USER_MUTATION, {
    onSuccess({ result }) {
      if (result.updated) {
        queryClient.invalidateQueries(['getAllUsers'])
      }
    },
    onError(error, { input: { username } }) {
      customSwalError(error, `Error al deshabilitar al usuario (${username})`);
    },
  })
  const [deleteUserByUsername] = useCustomMutation<{ result: { deleted: boolean; user: User } }, { username: string }>(DELETE_USER_BY_USERNAME_MUTATION,
    {
      onSuccess({ result }, { username }) {
        if (result.deleted) {
          customSwalSuccess("Usuario eliminado", `El usuario: (${username}) ha sido eliminado.`);
          queryClient.invalidateQueries(['getAllUsers'])
        } else {
          console.log("Error no manejado")
        }
      },
      onError(error, { username }) {
        customSwalError(error, `Error al eliminar al usuario (${username})`);
      },
    })

  const handleDelete = () => {
    Swal.fire({
      icon: 'question',
      title: '¿Esta seguro de eliminar a este usuario?',
      text: 'Una vez eliminado al usuario no se podra recuperar 😉',
      footer: `Usuario: ${user.username}`,
      showDenyButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor: 'green',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      // posiblemente confirmar con la contraseña de administrador
      if (result.isConfirmed) {
        deleteUserByUsername({ username: user.username })
      }
    })
  }

  const handleStatusOfUser = () => {
    disableUser({
      input: {
        username: user.username,
        data: {
          status: user.status === "ENABLE" ? "DISABLE" : "ENABLE"
        }
      }
    })
  }

  if (isLoading) {
    return <Spinner size="sm" variant="warning" />
  }

  return (
    <Dropdown align={"end"}>
      <Dropdown.Toggle as={ThreeDotsVertical} variant="link" role="button" />

      <Dropdown.Menu>
        <Dropdown.Item to={`../edit`} state={user} as={Link}>
          ✏ Editar
        </Dropdown.Item>
        <Dropdown.Item to={`../permissions`} state={user} as={Link}>
          📑 Permisos
        </Dropdown.Item>
        <Dropdown.Item onClick={handleDelete}>
          🗑 Eliminar
        </Dropdown.Item>
        <Dropdown.Item onClick={handleStatusOfUser}>
          {user.status === "ENABLE" ? "⛔ Deshabilitar" : "✔ Habilitar"}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownMenu;

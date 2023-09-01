import React from "react";
import { Dropdown } from "react-bootstrap";
import { ThreeDotsVertical } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { User } from "../../models/types";
import { useUsersStore } from "../../state/useUsersStore";
import { useCustomMutation } from "../../../../hooks";
import { customSwalError, customSwalSuccess } from "../../../../utilities/alerts";
import Swal from "sweetalert2";

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

const DropdownMenu: React.FC<DropdownMenuProps> = ({ user }) => {
  const { deleteUser } = useUsersStore();
  const [deleteUserByUsername] = useCustomMutation<{ result: { deleted: boolean; user: User } }, { username: string }>(DELETE_USER_BY_USERNAME_MUTATION,
    {
      onSuccess({ result }, { username }) {
        if (result.deleted) {
          customSwalSuccess("Usuario eliminado", `El usuario: (${username}) ha sido eliminado.`);
          deleteUser(username);
        } else {
          console.log("Error no manejado")
        }
      },
      onError(error, { username }) {
        customSwalError(error, `Error al eliminar  al usuario (${username})`);
      },
    })

  const handleDelete = () => {
    Swal.fire({
      icon: 'question',
      title: '¿Esta seguro de eliminar a este usuario?',
      text: 'Una vez eliminado al usuario no se podra recuperar',
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
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownMenu;

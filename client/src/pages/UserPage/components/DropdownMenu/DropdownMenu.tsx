import { useMutation } from "@apollo/client";
import React from "react";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from 'sonner';
import Swal from "sweetalert2";
import { useCustomMutation } from "../../../../hooks";
import { customSwalError, customSwalSuccess } from "../../../../utilities/alerts";
import { StateOfStatus } from "../../../../utilities/constants";
import { DropdownMenu as Menu } from '../../../HomePage/HomePage';
import { DISABLE_USER_MUTATION, GET_ALL_USERS_QUERY } from "../../GraphQL/types";
import { User } from "../../models/types";
import { useUsersStore } from "../../state/useUsersStore";
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



type Status = keyof typeof StateOfStatus;

const negateStatus = (status: Status): Status => {
  if (status === 'ENABLE') {
    return 'DISABLE'
  }

  return 'ENABLE'
}

const useUserServices = (user: User) => {
  const { filterText } = useUsersStore();
  const [handleStateOfUser, { loading }] = useMutation<{ user: User }, { username: string, input: User }>(DISABLE_USER_MUTATION, {
    refetchQueries: [{ query: GET_ALL_USERS_QUERY }],
    optimisticResponse: ({ input }) => ({
      __typename: 'Mutation',
      user: {
        __typename: 'User',
        ...input
      }
    }),
    update: (cache, { data }) => {
      if (!data || !data.user) return;

      const query = cache.readQuery<{ users: User[] }, { filterText: string }>({
        query: GET_ALL_USERS_QUERY,
        variables: {
          filterText
        }
      })

      if (!query) return

      const updatedUsers = query.users.map(user => {
        if (user.username === data?.user.username) {
          return data.user
        }

        return user;
      })

      cache.writeQuery<{ users: User[] }>({
        query: GET_ALL_USERS_QUERY,
        data: {
          users: updatedUsers!,
        },
        variables: {
          filterText
        }
      })
    }
  })

  const handleState = () => {
    toast.promise(handleStateOfUser({
      variables: {
        username: user.username,
        input: {
          ...user,
          status: negateStatus(user.status as Status)
        }
      }
    }), {
      loading: 'Actualizando usuario',
      success: ({ data }) => {
        return `Se actualizo el usuario: ${data?.user.username}`
      },
      error(error) {
        return `Error ${error}`
      }
    })
  }

  return { handleState, loading };
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ user }) => {
  const { deleteUser, rollbackDeleteUser } = useUsersStore();
  const { handleState, loading } = useUserServices(user);

  const [deleteUserByUsername] = useCustomMutation<{ result: { deleted: boolean; user: User } }, { username: string }>(DELETE_USER_BY_USERNAME_MUTATION,
    {
      onSuccess({ result }, { username }) {
        if (result.deleted) {
          customSwalSuccess("Usuario eliminado", `El usuario: (${username}) ha sido eliminado.`);
        } else {
          console.log("Error no manejado")
        }
      },
      onError(error, { username }) {
        rollbackDeleteUser(username);
        customSwalError(error, `Error al eliminar al usuario (${username})`);
      },
      onMutate({ username }) {
        deleteUser(username)
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

  if (loading) {
    return <Spinner size="sm" variant="warning" />
  }

  return (
    <Menu
      options={[
        {
          item: ['✏ Editar', {
            as: Link,
            to: 'edit',
            state: user
          }],
        },
        {
          item: ['📑 Permisos', {
            as: Link,
            to: 'permissions',
            state: user
          }]
        },
        {
          item: [user.status === "ENABLE" ? "⛔ Deshabilitar" : "✔ Habilitar", {
            onClick: handleState
          }]
        },
        {
          item: ['🗑 Eliminar', { onClick: handleDelete }]
        }
      ]}
    />
  );
};

export default DropdownMenu;


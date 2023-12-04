import { useMutation } from "@apollo/client";
import {
  DELETE_USER_BY_USERNAME_MUTATION,
  GET_ALL_USERS_QUERY,
} from "../GraphQL/types";
import { User } from "../models/types";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { useUsersStore } from "../state/useUsersStore";

type MutationReponse = {
  user: User;
};

type MutationVariables = Pick<User, "username">;

export const useUserDelete = (user: User) => {
  const { filterText } = useUsersStore();
  const mutation = useMutation<MutationReponse, MutationVariables>(
    DELETE_USER_BY_USERNAME_MUTATION,
    {
      optimisticResponse: () => ({
        __typename: "Mutation",
        user: {
          __typename: "User",
          ...user,
        },
      }),
      update: (cache, { data }) => {
        if (!data || !data.user) return;

        const query = cache.readQuery<
          { users: User[] },
          { filterText: string }
        >({
          query: GET_ALL_USERS_QUERY,
          variables: {
            filterText,
          },
        });

        if (!query) return;

        const updatedUsers = query.users.filter(
          ({ username }) => username !== user.username,
        );

        cache.writeQuery<{ users: User[] }>({
          query: GET_ALL_USERS_QUERY,
          data: {
            users: updatedUsers!,
          },
          variables: {
            filterText,
          },
        });
      },
    },
  );

  const handleDelete = () => {
    Swal.fire({
      icon: "question",
      title: "¿Esta seguro de eliminar a este usuario?",
      text: "Una vez eliminado al usuario no se podra recuperar 😉",
      footer: `Usuario: ${user.username}`,
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: "green",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        const promise = mutation[0]({ variables: { username: user.username } });
        toast.promise(promise, {
          loading: `Eliminando usuario: ${user.username}`,
          success() {
            return `Se ha eliminado al usuario: ${user.username}`;
          },
          error: () => {
            return `Ocurrio un error al intentar eliminar a: ${user.username}`;
          },
        });
      }
    });
  };

  return { handleDelete, mutation };
};

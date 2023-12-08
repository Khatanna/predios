import { useMutation } from "@apollo/client";
import { Status, User } from "../models/types";
import { useUsersStore } from "../state/useUsersStore";
import { DISABLE_USER_MUTATION, GET_ALL_USERS_QUERY } from "../graphQL/types";
import { toast } from "sonner";
import { negateStatus } from "../utils/negateStatus";

export const useUserUpdateState = (user: User) => {
  const { filterText } = useUsersStore();
  const [handleStateOfUser, { loading }] = useMutation<
    { user: User },
    { username: string; input: User }
  >(DISABLE_USER_MUTATION, {
    refetchQueries: [{ query: GET_ALL_USERS_QUERY }],
    optimisticResponse: ({ input }) => ({
      __typename: "Mutation",
      user: {
        __typename: "User",
        ...input,
      },
    }),
    update: (cache, { data }) => {
      if (!data || !data.user) return;

      const query = cache.readQuery<{ users: User[] }, { filterText: string }>({
        query: GET_ALL_USERS_QUERY,
        variables: {
          filterText,
        },
      });

      if (!query) return;

      const updatedUsers = query.users.map((user) => {
        if (user.username === data?.user.username) {
          return data.user;
        }

        return user;
      });

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
  });

  const handleState = () => {
    toast.promise(
      handleStateOfUser({
        variables: {
          username: user.username,
          input: {
            ...user,
            status: negateStatus(user.status as Status),
          },
        },
      }),
      {
        loading: "Actualizando usuario",
        success: ({ data }) => {
          return `Se actualizo el usuario: ${data?.user.username}`;
        },
        error(error) {
          return `Error ${error}`;
        },
      },
    );
  };

  return { handleState, loading };
};

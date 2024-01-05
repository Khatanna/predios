import { ApolloClient, useSubscription } from "@apollo/client";
import {
  GET_ALL_USERS_QUERY,
  ON_CONNECTED_USER_SUBCRIPTION,
} from "../graphQL/types";
import { useUsersStore } from "../state/useUsersStore";
import { User } from "../models/types";

export const useConnectionSubscription = (client: ApolloClient<unknown>) => {
  const { filterText } = useUsersStore();
  return useSubscription<{
    userConnected: { username: string; connection: string };
  }>(ON_CONNECTED_USER_SUBCRIPTION, {
    onData({ data: { data } }) {
      if (!data) return;

      const query = client.readQuery<{ users: User[] }, { filterText: string }>(
        {
          query: GET_ALL_USERS_QUERY,
          variables: {
            filterText,
          },
        },
      );

      if (!query) return;

      const updatedUsers = query.users.map((user) => {
        if (user.username === data.userConnected.username) {
          return {
            ...user,
            connection: data.userConnected.connection,
          };
        }

        return user;
      });

      client.writeQuery<{ users: User[] }>({
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
};

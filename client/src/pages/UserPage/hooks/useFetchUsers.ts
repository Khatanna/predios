import { useQuery } from "@apollo/client";
import { GET_ALL_USERS_QUERY } from "../graphQL/types";
import { userListAdapter } from "../adapters/userList.adapter";
import { User } from "../models/types";
import { useUsersStore } from "../state/useUsersStore";

type QueryResult = {
  users: User[];
};

type QueryVariables = {
  filterText: string;
};

export const useFetchUsers = () => {
  const { filterText } = useUsersStore();
  const query = useQuery<QueryResult, QueryVariables>(GET_ALL_USERS_QUERY, {
    variables: {
      filterText,
    },
  });

  return {
    ...query,
    data: userListAdapter(query.data?.users),
  };
};

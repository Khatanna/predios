import { useQuery } from "@apollo/client";
import { useState } from "react";
import { userListAdapter } from "../adapters/userList.adapter";
import { GET_ALL_USERS_QUERY } from "../graphQL/types";
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
  const [data, setData] = useState<User[]>([]);
  const query = useQuery<QueryResult, QueryVariables>(GET_ALL_USERS_QUERY, {
    variables: {
      filterText,
    },
    onCompleted(data) {
      setData(userListAdapter(data?.users));
    },
  });

  return {
    ...query,
    data,
    setData,
  };
};

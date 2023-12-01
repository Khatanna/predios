import { useCustomQuery } from "../../../hooks/useCustomQuery";
import { userListAdapter } from "../adapters/userList.adapter";
import { User } from "../models/types";
import { useUsersStore } from "../state/useUsersStore";
import { useUserContext } from "./useUserContext";
const GET_ALL_USERS_QUERY = `
  query AllUsers($filterText: String) {
    users: getAllUsers(filterText: $filterText){
      names
      username
      firstLastName
      secondLastName
      status
      connection
      createdAt
      type {
        name
      }
      role {
        name
      }
    }
  }
`;

export const useFetchUsers = () => {
  const { setUsers } = useUserContext();
  const { isLoading, error, data } = useCustomQuery<{
    users: User[];
  }>(
    GET_ALL_USERS_QUERY,
    ["getAllUsers"],
    {
      onSuccess({ users }) {
        setUsers(userListAdapter(users))
      },
    },
  );

  return {
    isLoading,
    error,
    data,
  };
};

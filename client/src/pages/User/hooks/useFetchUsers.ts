import { useEffect } from "react";
import { useCustomQuery } from "../../../hooks/useCustomQuery";
import { User } from "../models/types";
import { useUsersStore } from "../state/useUsersStore";

const GET_ALL_USERS_QUERY = `
  query AllUsers {
    allUsers {
      names
      username
			firstLastName
			secondLastName
      status
      createdAt
      typeId
      role
      type {
        name
      }
    }
  }
`;

export const useFetchUsers = () => {
  const { setUsers } = useUsersStore();
  const { data, isLoading, error } = useCustomQuery<{ allUsers: User[] }>(GET_ALL_USERS_QUERY, ['getAllUsers']);

  useEffect(() => {
    if (data) {
      setUsers(data.allUsers)
    }
  }, [data, setUsers])

  return {
    isLoading,
    error
  };
};

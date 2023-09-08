import { useCustomQuery } from "../../../hooks/useCustomQuery";
import { User } from "../models/types";

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
  const { data, isLoading, error } = useCustomQuery<{ allUsers: User[] }>(GET_ALL_USERS_QUERY, ['getAllUsers']);
  return {
    isLoading,
    error,
    data
  };
};

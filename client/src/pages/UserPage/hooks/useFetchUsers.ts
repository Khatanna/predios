import { useCustomQuery } from "../../../hooks/useCustomQuery";
import { User } from "../models/types";
import { useUsersStore } from "../state/useUsersStore";
const GET_ALL_USERS_QUERY = `
  query AllUsers($nextCursor: String, $prevCursor: String, $numberOfResults: Int, $filterText: String) {
    results: getAllUsers(nextCursor: $nextCursor, prevCursor: $prevCursor, numberOfResults: $numberOfResults, filterText: $filterText) {
      nextCursor
      prevCursor
      total
      users {
        id
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
      }
    }
  }
`;

export const useFetchUsers = () => {
  const {
    setInitialData,
    nextCursor,
    prevCursor,
    numberOfResults,
    filterText,
  } = useUsersStore();
  const { isLoading, error, data } = useCustomQuery<{
    results: {
      nextCursor: string;
      prevCursor: string;
      total: number;
      users: User[];
    };
  }>(
    GET_ALL_USERS_QUERY,
    ["getAllUsers", { numberOfResults, nextCursor, prevCursor, filterText }],
    {
      onSuccess({ results }) {
        setInitialData({ users: results.users, total: results.total });
      },
    },
  );

  return {
    isLoading,
    error,
    data,
  };
};

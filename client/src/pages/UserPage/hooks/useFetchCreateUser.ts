import { ApolloClient, gql, useMutation } from "@apollo/client";
import { useCustomMutation } from "../../../hooks";
import { customSwalError, customSwalSuccess } from "../../../utilities/alerts";
import { mutationMessages } from "../../../utilities/constants";
import { User, UserInput } from "../models/types";
import { useUsersStore } from "../state/useUsersStore";
import { GET_ALL_USERS_QUERY } from "../graphQL/types";
import { toast } from "sonner";

const CREATE_USER_MUTATION = gql` 
  mutation CreateUser($input: UserInput) {
    user: createUser(input: $input) {
      username
    } 
  }
`;

export const useFetchCreateUser = () => {
  const { filterText } = useUsersStore();
  const [createUser] = useMutation<{ user: User }, { input: UserInput }>(
    CREATE_USER_MUTATION,
    {
      onCompleted({ user: { username } }) {
        customSwalSuccess(
          mutationMessages.CREATE_USER.title,
          mutationMessages.CREATE_USER.getSuccessMessage(username),
        );
      },
      onError(error, client) {
        customSwalError(
          error.message,
          mutationMessages.CREATE_USER.getErrorMessage(client!.variables!.username),
        );
      },
      optimisticResponse: ({ input }) => (
        {
          __typename: "Mutation",
          user: {
            __typename: "User",
            id: crypto.randomUUID(),
            ...input,
          },
        }
      ),
      update(cache, { data }) {
        if (!data) return;

        const query = cache.readQuery<{ users: User[] }, { filterText: string }>(
          {
            query: GET_ALL_USERS_QUERY,
            variables: {
              filterText,
            },
          },
        );

        if (!query) return;

        const updatedUsers = [...query.users, data.user];

        cache.writeQuery<{ users: User[] }>({
          query: GET_ALL_USERS_QUERY,
          data: {
            users: updatedUsers,
          },
          variables: {
            filterText,
          },
        });
      }
    },
  );

  return {
    createUser,
  };
};

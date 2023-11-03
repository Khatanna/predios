import { useCustomMutation } from "../../../hooks";
import { customSwalError, customSwalSuccess } from "../../../utilities/alerts";
import { mutationMessages } from "../../../utilities/constants";
import { User, UserInput } from "../models/types";

const CREATE_USER_MUTATION = ` 
  mutation CreateUser($input: UserInput) {
    result: createUser(input: $input) {
      username
    } 
  }
`;

export const useFetchCreateUser = () => {
  const [createUser] = useCustomMutation<{ user: User }, { input: UserInput }>(
    CREATE_USER_MUTATION,
    {
      onSuccess({ user: { username } }) {
        customSwalSuccess(
          mutationMessages.CREATE_USER.title,
          mutationMessages.CREATE_USER.getSuccessMessage(username),
        );
      },
      onError(error, { input: { username } }) {
        customSwalError(
          error,
          mutationMessages.CREATE_USER.getErrorMessage(username),
        );
      },
    },
  );

  return {
    createUser,
  };
};

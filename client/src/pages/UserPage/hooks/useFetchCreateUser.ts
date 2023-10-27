import { useCustomMutation } from "../../../hooks";
import { customSwalError, customSwalSuccess } from "../../../utilities/alerts";
import { mutationMessages } from "../../../utilities/constants";
import { User } from "../models/types";

const CREATE_USER_MUTATION = ` 
  mutation CreateUser($input: CreateUserInput) {
    result: createUser(input: $input) {
      created
    } 
  }
`

export const useFetchCreateUser = () => {
  const [createUser] = useCustomMutation<{ user: User }, { input: Omit<User, 'id' | 'connection' | 'createdAt'> }>(CREATE_USER_MUTATION, {
    onSuccess({ user: { username } }) {
      customSwalSuccess(mutationMessages.CREATE_USER.title, mutationMessages.CREATE_USER.getSuccessMessage(username));
    },
    onError(error, { input: { username } }) {
      customSwalError(error, mutationMessages.CREATE_USER.getErrorMessage(username))
    },
  })

  return {
    createUser,
  };
};


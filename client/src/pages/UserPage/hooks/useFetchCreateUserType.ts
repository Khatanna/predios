import { useCustomMutation } from "../../../hooks";
import { customSwalError, customSwalSuccess } from "../../../utilities/alerts";
import { mutationMessages } from "../../../utilities/constants";
import { UserType } from "../models/types";

const CREATE_USER_TYPE_MUTATION = `
  mutation CreateUserType ($input: CreateTypeUserInput){
    type: createUserType(input: $input) {
      name
    }
  }
`

export const useFetchCreateUserType = () => {
  const [createUserType, { isLoading }] = useCustomMutation<{ type: UserType }, { input: Omit<UserType, 'id'> }>(CREATE_USER_TYPE_MUTATION, {
    onSuccess({ type: { name } }) {
      customSwalSuccess(mutationMessages.CREATE_USERTYPE.title, mutationMessages.CREATE_USERTYPE.getSuccessMessage(name));
    },
    onError(error, { input: { name } }) {
      customSwalError(error, mutationMessages.CREATE_USERTYPE.getErrorMessage(name));
    }
  })

  return {
    createUserType,
    isLoading
  };
};


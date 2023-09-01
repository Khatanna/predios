import { useCustomMutation } from "../../../hooks";
import { customSwalError, customSwalSuccess } from "../../../utilities/alerts";
import { UpdateUserResponse, UpdateUserVariables } from "../models/types";

const UDPATE_USER_MUTATION = `
  mutation UpdateUser($input: UpdateUserByUsernameInput) {
    result: updateUserByUsername(input: $input) {
      updated,
      user {
        username
      }
    }
  }
`;

export const useFetchUpdateUser = () => {
  const [updateUser, { isLoading }] = useCustomMutation<UpdateUserResponse, UpdateUserVariables>(UDPATE_USER_MUTATION, {
    onSuccess({ result }) {
      if (result.updated) {
        customSwalSuccess('Usuario actualizado', `El usuario ${result.user.username} ha sido actualizado`)
      } else {
        console.log("Error no manejado")
      }
    },
    onError(error) {
      customSwalError(error, "Ocurrio un error al intentar actualizar el usuario")
    },
  })

  return { updateUser, isLoading };
};


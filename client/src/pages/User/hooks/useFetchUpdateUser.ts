import { useCustomMutation } from "../../../hooks";
import { customSwalError, customSwalSuccess } from "../../../utilities/alerts";
import { UseFormSetValue } from "react-hook-form";
import { UpdateUserResponse, UpdateUserVariables, User } from "../models/types";

const UDPATE_USER_MUTATION = `
  mutation UpdateUser($input: UpdateUserByUsernameInput) {
    result: updateUserByUsername(input: $input) {
      updated,
      user {
        names
        firstLastName
        secondLastName
        username
        status
        role
        typeId
      }
    }
  }
`;

export const useFetchUpdateUser = (
  setValue: UseFormSetValue<Omit<User, "createdAt" | "type" | "permissions">>,
) => {
  const [updateUser, { isLoading }] = useCustomMutation<
    UpdateUserResponse,
    UpdateUserVariables
  >(UDPATE_USER_MUTATION, {
    onSuccess({ result }) {
      if (result.user) {
        for (const key in result.user) {
          setValue(
            key as keyof typeof result.user,
            result.user[key as keyof typeof result.user],
          );
        }
        customSwalSuccess(
          "Usuario actualizado",
          `El usuario ${result.user.username} ha sido actualizado`,
        );
      } else {
        console.log("Error no manejado");
      }
    },
    onError(error) {
      customSwalError(
        error,
        "Ocurrio un error al intentar actualizar el usuario",
      );
    },
  });

  return { updateUser, isLoading };
};

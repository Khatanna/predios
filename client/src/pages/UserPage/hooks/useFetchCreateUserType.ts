import { useCustomMutation } from "../../../hooks";
import { customSwalError, customSwalSuccess } from "../../../utilities/alerts";
import { CreateUserTypeResponse, CreateUserTypeVariables } from "../models/types";

const CREATE_USER_TYPE_MUTATION = `
  mutation CreateUserType ($input: CreateTypeUserInput){
    result: createUserType(input: $input) {
      created
    }
  }
`

export const useFetchCreateUserType = () => {
  const [createUserType, { isLoading }] = useCustomMutation<CreateUserTypeResponse, CreateUserTypeVariables>(CREATE_USER_TYPE_MUTATION, {
    onSuccess({ result }) {
      if (result.created) {
        customSwalSuccess("Nuevo tipo agregado", "Se ha agregado un nuevo tipo de usuario");
      } else {
        console.log("Error no manejado");
      }
    },
    onError(error) {
      customSwalError(error, "Ocurrio un error al intentar un nuevo tipo de usuario");
    }
  })

  return {
    createUserType,
    isLoading
  };
};


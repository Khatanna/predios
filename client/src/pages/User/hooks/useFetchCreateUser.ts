import { useCustomMutation } from "../../../hooks";
import { customSwalError, customSwalSuccess } from "../../../utilities/alerts";
import { CreateUserResponse, CreateUserVariables } from "../models/types";

const CREATE_USER_MUTATION = ` 
  mutation CreateUser($input: CreateUserInput) {
    result: createUser(input: $input) {
      created
    } 
  }
`

export const useFetchCreateUser = () => {
  const [createUser] = useCustomMutation<CreateUserResponse, CreateUserVariables>(CREATE_USER_MUTATION, {
    onSuccess({ result }) {
      if (result.created) {
        customSwalSuccess("Usuario creado", "El usuario ha sido creado correctamente");
      } else {
        console.log("Error no manejado")
      }
    },
    onError(error) {
      customSwalError(error, "Ocurrio un error al intentar crear un nuevo usuario")
    },
  })

  return {
    createUser,
  };
};


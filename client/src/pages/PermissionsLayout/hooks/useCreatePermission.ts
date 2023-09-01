import { useCustomMutation } from "../../../hooks";
import { CreatePermissionResponse, CreatePermissionVariables } from "../types";
import { customSwalError, customSwalSuccess } from "../../../utilities/alerts";

const CREATE_PERMISSION_MUTATION = `
	mutation CreatePermission ($input: CreatePermissionInput){
		data: createPermission (input: $input) {
			created
		}
	}
`

export const useCreatePermission = () => {
  const [createPermission, { isLoading, error }] = useCustomMutation<CreatePermissionResponse, CreatePermissionVariables>(
    CREATE_PERMISSION_MUTATION,
    {
      onSuccess({ data }) {
        if (data.created) {
          customSwalSuccess('Permiso creado', 'El permiso se ha creado correctamente!')
        } else {
          console.error("Error no manejado")
        }
      },
      onError(error) {
        customSwalError(error, 'Error al crear permiso');
      }
    },
  );

  return { createPermission, isLoading, error }
}
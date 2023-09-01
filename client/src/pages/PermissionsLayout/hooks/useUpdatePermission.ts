import { useCustomMutation } from "../../../hooks";
import { UpdatePermissionResponse, UpdatePermissionVariables } from "../types";
import { customSwalError, customSwalSuccess } from "../../../utilities/alerts";

const UPDATE_PERMISSION_MUTATION = `
	mutation updatePermission ($input: UpdatePermissionInput){
		data: updatePermission (input: $input) {
			updated
		}
	}
`

export const useUpdatePermission = () => {
  const [updatePermission, { isLoading, error }] = useCustomMutation<UpdatePermissionResponse, UpdatePermissionVariables>(
    UPDATE_PERMISSION_MUTATION,
    {
      onSuccess({ data }) {
        if (data.updated) {
          customSwalSuccess('Permiso actualizado', 'El permiso se ha actualizado correctamente!')
        } else {
          console.error("Error no manejado")
        }
      },
      onError(error) {
        customSwalError(error, 'Error al intentar actualizar el permiso');
      }
    },
  );

  return { updatePermission, isLoading, error }
}
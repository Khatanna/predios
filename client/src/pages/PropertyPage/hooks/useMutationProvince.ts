import { useCustomMutation } from "../../../hooks";
import { customSwalError, customSwalSuccess } from "../../../utilities/alerts";
import { Province } from "../../ProvincePage/models/types";
import { useLocationStore } from "../state/useLocationStore";

const CREATE_PROVINCE_MUTATION = `
  mutation CreateProvince ($name: String, $code: String, $cityName: String) {
    result: createProvince(name: $name, code: $code, cityName: $cityName) {
      name
    }
  }
`;

const UPDATE_PROVINCE_MUTATION = `
  mutation UpdateProvince ($currentName: String, $newName: String, $code: String) {
    result: updateProvince(currentName: $currentName, newName: $newName, code: $code) {
      name
    }
  }
`;

const DELETE_PROVINCE_MUTATION = `
  mutation DeleteProvince($name: String) {
    result: deleteProvince(name: $name){
      name
    }
  }
`

export const useMutationProvince = () => {
  const { deleteProvince, addProvince, updateProvince } = useLocationStore();
  const [createProvinceMutation] = useCustomMutation<{ result: Province }, { name: string, code: string, cityName: string }>(CREATE_PROVINCE_MUTATION, {
    onSuccess({ result: { name } }) {
      customSwalSuccess(
        "Nueva provincia agregada",
        `La provincia ${name} se ha creado correctamente`,
      );
    },
    onError(error, { name }) {
      deleteProvince({ name })
      customSwalError(
        error,
        `Ocurrio un error al intentar crear la provincia ${name}`,
      );
    },
    onMutate({ name }) {
      addProvince({ name })
    },
  })

  const [updateProvinceMutation] = useCustomMutation<
    { result: Province },
    { currentName: string; newName: string; code?: string }
  >(UPDATE_PROVINCE_MUTATION, {
    onSuccess({ result: { name } }) {
      customSwalSuccess(
        "Provincia actualizado",
        `La provincia ${name} se ha actualizado correctamente`,
      );
    },
    onError(error, { currentName, newName }) {
      updateProvince({ currentName: newName, newName: currentName });
      customSwalError(
        error,
        `Ocurrio un error al intentar actualizar la provincia ${currentName}`,
      );
    },
    onMutate({ currentName, newName }) {
      updateProvince({ currentName, newName })
    },
  });

  const [deleteProvinceMutation] = useCustomMutation<{ result: Province }, { name: string }>(DELETE_PROVINCE_MUTATION, {
    onSuccess({ result: { name } }) {
      customSwalSuccess(
        "Provincia eliminada",
        `La provincia ${name} se ha eliminado correctamente`,
      );
    },
    onError(error, { name }) {
      addProvince({ name })
      customSwalError(
        error,
        `Ocurrio un error al intentar eliminar la provincia ${name}`,
      );
    },
    onMutate({ name }) {
      deleteProvince({ name })
    },
  });

  return {
    createProvinceMutation,
    updateProvinceMutation,
    deleteProvinceMutation
  }
}
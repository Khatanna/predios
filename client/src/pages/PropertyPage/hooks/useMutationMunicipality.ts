import { useCustomMutation } from "../../../hooks";
import { customSwalError, customSwalSuccess } from "../../../utilities/alerts";
import { Municipality } from "../../MunicipalityPage/models/types";
import { useLocationStore } from "../state/useLocationStore";

const CREATE_MUNICIPALITY_MUTATION = `
  mutation CreateMunicipality($name: String, $provinceName: String) {
    result: createMunicipality(name: $name, provinceName: $provinceName) {
      name
    }
  }
`

const UPDATE_MUNICIPALITY_MUTATION = `
  mutation UpdateMunicipality($currentName: String, $newName: String) {
    result: updateMunicipality(currentName: $currentName, newName: $newName) {
      name
    }
  }
`
const DELETE_MUNICIPALITY_MUTATION = `
  mutation DeleteMunicipality($name: String) {
    result: deleteMunicipality(name: $name) {
      name
    }
  }
`

export const useMutationMunicipality = () => {
  const { addMunicipality, updateMunicipality, deleteMunicipality } = useLocationStore();
  const [createMunicipalityMutation] = useCustomMutation<{ result: Municipality }, { name: string, provinceName: string }>(CREATE_MUNICIPALITY_MUTATION, {
    onSuccess({ result: { name } }) {
      customSwalSuccess(
        "Nuevo municipio agregado",
        `El municipio ${name} se ha creado correctamente`,
      );
    },
    onError(error, { name }) {
      deleteMunicipality({ name })
      customSwalError(
        error,
        `Ocurrio un error al intentar crear el municipio ${name}`,
      );
    },
    onMutate({ name }) {
      addMunicipality({ name })
    },
  });
  const [updateMunicipalityMutation] = useCustomMutation<{ result: Municipality }, { currentName: string, newName: string }>(UPDATE_MUNICIPALITY_MUTATION, {
    onSuccess({ result: { name } }) {
      customSwalSuccess(
        "Municipio actualizado",
        `El municipio ${name} se ha actualizado correctamente`,
      );
    },
    onError(error, { currentName, newName }) {
      updateMunicipality({ currentName: newName, newName: currentName })
      customSwalError(
        error,
        `Ocurrio un error al intentar actualizar el municipio ${currentName}`,
      );
    },
    onMutate({ currentName, newName }) {
      updateMunicipality({ currentName, newName })
    },
  });
  const [deleteMunicipalityMutation] = useCustomMutation<{ result: Municipality }, { name: string }>(DELETE_MUNICIPALITY_MUTATION, {
    onSuccess({ result: { name } }) {
      customSwalSuccess(
        "Municipio eliminado",
        `El municipio ${name} se ha eliminado correctamente`,
      );
    },
    onError(error, { name }) {
      addMunicipality({ name })
      customSwalError(
        error,
        `Ocurrio un error al intentar eliminar el municipio ${name}`,
      );
    },
    onMutate({ name }) {
      deleteMunicipality({ name })
    },
  });

  return {
    createMunicipalityMutation,
    updateMunicipalityMutation,
    deleteMunicipalityMutation
  }
}
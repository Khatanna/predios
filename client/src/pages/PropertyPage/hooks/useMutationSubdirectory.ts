import { useCustomMutation } from "../../../hooks";
import { customSwalError, customSwalSuccess } from "../../../utilities/alerts";
import { SubDirectory } from "../../SubDirectoryPage/models/types";
import { useSubdirectoryStore } from "../state/useSubdirectoryStore";

const CREATE_SUBDIRECTORY_MUTATION = `
  mutation CreateSubdirectory($name: String) {
    result: createSubdirectory(name: $name) {
      name
    }
  }
`

const UPDATE_SUBDIRECTORY_MUTATION = `
  mutation UpdateSubdirectoryMutation($currentName: String, $newName: String) {
    result: updateSubdirectory(currentName: $currentName, newName: $newName) {
      name
    }
  }
`
const DELETE_SUBDIRECTORY_MUTATION = `
  mutation DeleteSubdirectoryMutation($name: String) {
    result: deleteSubdirectory(name: $name) {
      name
    }
  }
`

export const useSubdirectoryMutation = () => {
  const { addSubdirectory, updateSubdirectory, deleteSubdirectory, rollback } = useSubdirectoryStore();

  const [createSubdirectoryMutation] = useCustomMutation<{ result: SubDirectory }, { name: string }>(CREATE_SUBDIRECTORY_MUTATION, {
    onSuccess({ result: { name } }) {
      customSwalSuccess("Subcarpeta creada correctamente", `La subcarpeta ${name} ha sido creada correctamente`);
    },
    onError(error, { name }) {
      rollback()
      customSwalError(error, `Ocurrio un error al intentar crear la subcarpeta ${name}`)
    },
    onMutate({ name }) {
      addSubdirectory({ name })
    },
  });
  const [updateSubdirectoryMutation] = useCustomMutation<{ result: SubDirectory }, { currentName: string, newName: string }>(UPDATE_SUBDIRECTORY_MUTATION, {
    onSuccess({ result: { name } }) {
      customSwalSuccess("Subcarpeta actualizada correctamente", `El nombre de la subcarpeta ${name} ha sido actualizada correctamente`);
    },
    onError(error, { currentName }) {
      rollback()
      customSwalError(error, `Ocurrio un error al intentar actualizar el nombre de la subcarpeta ${currentName}`)
    },
    onMutate({ currentName, newName }) {
      updateSubdirectory({ currentName, newName })
    }
  });
  const [deleteSubdirectoryMutation] = useCustomMutation<{ result: SubDirectory }, { name: string }>(DELETE_SUBDIRECTORY_MUTATION, {
    onSuccess({ result: { name } }) {
      customSwalSuccess("Subcarpeta eliminada correctamente", `La subcarpeta con el nombre ${name} ha sido eliminada correctamente`);
    },
    onError(error, { name }) {
      rollback()
      customSwalError(error, `Ocurrio un error al intentar eliminar la subcarpeta ${name}`)
    },
    onMutate({ name }) {
      deleteSubdirectory({ name })
    },
  });

  return { createSubdirectoryMutation, updateSubdirectoryMutation, deleteSubdirectoryMutation }
}
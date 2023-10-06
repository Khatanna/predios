import { useCustomMutation } from "../../../hooks";
import { customSwalError, customSwalSuccess } from "../../../utilities/alerts";
import { City } from "../../CityPage/models/types";
import { useLocationStore } from "../state/useLocationStore";

const CREATE_CITY_MUTATION = `
	mutation CreateCity($name: String) {
		result: createCity(name: $name) {
			name
		}
	}
`;

const UPDATE_CITY_MUTATION = `
	mutation UpdateCity($name: String, $newName: String) {
		result: updateCity(name: $name, newName: $newName) {
			name
		}
	}
`;

const DELETE_CITY_MUTATION = `
  mutation DeleteCity($name: String) {
    result: deleteCity(name: $name) {
      name
    }
  }
`

export const useMutationCity = () => {
  const { addCity, deleteCity, updateCity, rollbackCities, } = useLocationStore();

  const [createCityMutation] = useCustomMutation<{ result: City }, { name: string }>(
    CREATE_CITY_MUTATION,
    {
      onSuccess({ result: { name } }) {
        customSwalSuccess(
          "Nuevo departamento agregado",
          `El departamento ${name} se ha creado correctamente`,
        );
      },
      onError(error, { name }) {
        rollbackCities()
        customSwalError(
          error,
          `Ocurrio un error al intentar crear el departamento ${name}`,
        );
      },
      onMutate({ name }) {
        addCity({
          name
        })
      },
    },
  );

  const [updateCityMutation] = useCustomMutation<
    { result: City },
    { name: string; newName: string }
  >(UPDATE_CITY_MUTATION, {
    onSuccess({ result: { name } }) {
      customSwalSuccess(
        "Departamento actualizado",
        `El departamento ${name} se ha actualizado correctamente`,
      );
    },
    onError(error, { name }) {
      rollbackCities()
      customSwalError(
        error,
        `Ocurrio un error al intentar actualizar el departamento ${name}`,
      );
    },
    onMutate({ name, newName }) {
      updateCity({ currentName: name, newName })
    },
  });

  const [deleteCityMutation] = useCustomMutation<{ result: City }, { name: string }>(DELETE_CITY_MUTATION, {
    onSuccess({ result: { name } }) {
      customSwalSuccess(
        "Departamento eliminado",
        `El departamento ${name} se ha eliminado correctamente`,
      );
    },
    onError(error, { name }) {
      rollbackCities()
      customSwalError(
        error,
        `Ocurrio un error al intentar eliminar el departamento ${name}`,
      );
    },
    onMutate({ name }) {
      deleteCity({ name })
    },
  });

  return {
    createCityMutation,
    updateCityMutation,
    deleteCityMutation
  }
}
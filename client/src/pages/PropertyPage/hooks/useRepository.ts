import { useCustomMutation } from "../../../hooks"
import { Activity } from "../../ActivityPage/models/types"
import { City } from "../../CityPage/models/types"
import { Clasification } from "../../ClasificationPage/models/types"
import { GroupedState } from "../../GroupedState/models/types"
import { Municipality } from "../../MunicipalityPage/models/types"
import { Province } from "../../ProvincePage/models/types"
import { Reference } from "../../ReferencePage/models/types"
import { ResponsibleUnit } from "../../ResponsibleUnitPage/models/types"
import { State } from "../../StatePage/models/types"
import { SubDirectory } from "../../SubDirectoryPage/models/types"
import { Type } from "../../TypePage/models/types"
import { createSelectableStore } from "../state/useSelectablesStore"

type Mutations = {
  createMutation: string,
  updateMutation: string,
  deleteMutation: string
}

const createMutations = <E extends { name: string }>({
  createMutation, updateMutation, deleteMutation }: Mutations) => {
  const useStore = createSelectableStore<Pick<E, 'name'>>();

  const useMutations = <
    R1,
    V1 extends Pick<E, 'name'> & { item: E } = Pick<E, 'name'> & { item: E },
    R2 extends R1 = R1,
    V2 extends V1 = V1,
    R3 extends R1 = R1,
    V3 extends E = E
  >() => {
    const { addItem, updateItem, deleteItem, rollback } = useStore();

    return {
      mutationCreate: useCustomMutation<R1, Omit<V1, 'item'>>(createMutation, {
        onError() {
          rollback();
        },
        onMutate(variables) {
          addItem(variables)
        },
      })[0],
      mutationUpdate: useCustomMutation<R2, V2>(updateMutation, {
        onError() {
          rollback();
        },
        onMutate({ name, item }) {
          updateItem({ name }, item);
        },
      })[0],
      mutationDelete: useCustomMutation<R3, Omit<V3, 'item'>>(deleteMutation, {
        onError() {
          rollback()
        },
        onMutate({ name }) {
          deleteItem({ name })
        }
      })[0],
    }
  }

  return { useStore, useMutations };
}

const CREATE_CITY_MUTATION = `
	mutation CreateCity($name: String) {
		city: createCity(name: $name) {
			name
		}
	}
`;

const UPDATE_CITY_MUTATION = `
	mutation UpdateCity($name: String, $item: CityInput) {
		city: updateCity(name: $name, item: $item) {
			name
		}
	}
`;

const DELETE_CITY_MUTATION = `
  mutation DeleteCity($name: String) {
    city: deleteCity(name: $name) {
      name
    }
  }
`

const CREATE_PROVINCE_MUTATION = `
  mutation CreateProvince ($input: ProvinceInput) {
    province: createProvince(input: $input) {
      name
    }
  }
`;

const UPDATE_PROVINCE_MUTATION = `
  mutation UpdateProvince ($name: String, $item: ProvinceInput) {
    province: updateProvince(name: $name, item: $item) {
      name
    }
  }
`;

const DELETE_PROVINCE_MUTATION = `
  mutation DeleteProvince($name: String) {
    province: deleteProvince(name: $name){
      name
    }
  }
`

const CREATE_MUNICIPALITY_MUTATION = `
  mutation CreateMunicipality($name: String, $provinceName: String) {
    municipality: createMunicipality(name: $name, provinceName: $provinceName) {
      name
    }
  }
`

const UPDATE_MUNICIPALITY_MUTATION = `
  mutation UpdateMunicipality($name: String, $item: MunicipalityInput) {
    municipality: updateMunicipality(name: $name, item: $item) {
      name
    }
  }
`

const DELETE_MUNICIPALITY_MUTATION = `
  mutation DeleteMunicipality($name: String) {
    municipality: deleteMunicipality(name: $name) {
      name
    }
  }
`

const CREATE_STATE_MUTATION = `
  mutation CreateState($input: StateInput) {
    state: createState(input: $input) {
      name
    }
  }
`

const UPDATE_STATE_MUTATION = `
  mutation UpdateState($name: String, $input: StateInput) {
    state: updateState(name: $name, input: $input) {
      name
    }
  }
`

const DELETE_STATE_MUTATION = `
  mutation DeleteState($name: String) {
    state: deleteState(name: $name) {
      name
    }
  }
`

const CREATE_SUBDIRECTORY_MUTATION = `
  mutation CreateSubdirectory($name: String) {
    subdirectory: createSubdirectory(name: $name) {
      name
    }
  }
`

const UPDATE_SUBDIRECTORY_MUTATION = `
  mutation UpdateSubdirectoryMutation($name: String, $item: SubdirectoryInput) {
    subdirectory: updateSubdirectory(name: $name, item: $item) {
      name
    }
  }
`

const DELETE_SUBDIRECTORY_MUTATION = `
  mutation DeleteSubdirectoryMutation($name: String) {
    subdirectory: deleteSubdirectory(name: $name) {
      name
    }
  }
`

const CREATE_RESPONSIBLE_UNIT_MUTATION = `
	mutation CreateResponsibleUnit($name: String) {
		responsibleUnit: createResponsibleUnit(name: $name) {
			name
		}
	}
`;

const UPDATE_RESPONSIBLE_UNIT_MUTATION = `
	mutation UpdateResponsibleUnit($name: String, $item: ResponsibleUnitInput) {
		responsibleUnit: updateResponsibleUnit(name: $name, item: $item) {
			name
		}
	}
`;

const DELETE_RESPONSIBLE_UNIT_MUTATION = `
  mutation DeleteResponsibleUnit($name: String) {
    responsibleUnit: deleteResponsibleUnit(name: $name) {
      name
    }
  }
`

const CREATE_TYPE_MUTATION = `
	mutation CreateType($name: String) {
		type: createType(name: $name) {
			name
		}
	}
`;

const UPDATE_TYPE_MUTATION = `
	mutation UpdateType($name: String, $item: TypeInput) {
		type: updateType(name: $name, item: $item) {
			name
		}
	}
`;

const DELETE_TYPE_MUTATION = `
  mutation DeleteType($name: String) {
    type: deleteType(name: $name) {
      name
    }
  }
`

const CREATE_ACTIVITY_MUTATION = `
	mutation CreateActivity($name: String) {
		activity: createActivity(name: $name) {
			name
		}
	}
`;

const UPDATE_ACTIVITY_MUTATION = `
	mutation UpdateActivity($name: String, $item: ActivityInput) {
		activity: updateActivity(name: $name, item: $item) {
			name
		}
	}
`;

const DELETE_ACTIVITY_MUTATION = `
  mutation DeleteActivity($name: String) {
    activity: deleteActivity(name: $name) {
      name
    }
  }
`

const CREATE_CLASIFICATION_MUTATION = `
	mutation CreateClasification($name: String) {
		clasification: createClasification(name: $name) {
			name
		}
	}
`;

const UPDATE_CLASIFICATION_MUTATION = `
	mutation UpdateClasification($name: String, $item: ClasificationInput) {
		clasification: updateClasification(name: $name, item: $item) {
			name
		}
	}
`;

const DELETE_CLASIFICATION_MUTATION = `
  mutation DeleteClasification($name: String) {
    clasification: deleteClasification(name: $name) {
      name
    }
  }
`

const CREATE_GROUPED_STATE_MUTATION = `
	mutation CreateGroupedState($name: String) {
		groupedState: createGroupedState(name: $name) {
			name
		}
	}
`;

const UPDATE_GROUPED_STATE_MUTATION = `
	mutation UpdateGroupedState($name: String, $item: GroupedStateInput) {
		groupedState: updateGroupedState(name: $name, item: $item) {
			name
		}
	}
`;

const DELETE_GROUPED_STATE_MUTATION = `
  mutation DeleteGroupedState($name: String) {
    groupedState: deleteGroupedState(name: $name) {
      name
    }
  }
`

const CREATE_REFERENCE_MUTATION = `
	mutation CreateReference($name: String) {
		reference: createReference(name: $name) {
			name
		}
	}
`;

const UPDATE_REFERENCE_MUTATION = `
	mutation UpdateReference($name: String, $item: ReferenceInput) {
		reference: updateReference(name: $name, item: $item) {
			name
		}
	}
`;

const DELETE_REFERENCE_MUTATION = `
  mutation DeleteReference($name: String) {
    reference: deleteReference(name: $name) {
      name
    }
  }
`

export const cityRepository = createMutations<City>({
  createMutation: CREATE_CITY_MUTATION,
  updateMutation: UPDATE_CITY_MUTATION,
  deleteMutation: DELETE_CITY_MUTATION
});

export const provinceRepository = createMutations<Province>({
  createMutation: CREATE_PROVINCE_MUTATION,
  updateMutation: UPDATE_PROVINCE_MUTATION,
  deleteMutation: DELETE_PROVINCE_MUTATION
})

export const municipalityRepository = createMutations<Municipality>({
  createMutation: CREATE_MUNICIPALITY_MUTATION,
  updateMutation: UPDATE_MUNICIPALITY_MUTATION,
  deleteMutation: DELETE_MUNICIPALITY_MUTATION
})

export const stateRepository = createMutations<State>({
  createMutation: CREATE_STATE_MUTATION,
  updateMutation: UPDATE_STATE_MUTATION,
  deleteMutation: DELETE_STATE_MUTATION
})

export const subdirectoryRepository = createMutations<SubDirectory>({
  createMutation: CREATE_SUBDIRECTORY_MUTATION,
  updateMutation: UPDATE_SUBDIRECTORY_MUTATION,
  deleteMutation: DELETE_SUBDIRECTORY_MUTATION
})

export const responsibleUnitRepository = createMutations<ResponsibleUnit>({
  createMutation: CREATE_RESPONSIBLE_UNIT_MUTATION,
  updateMutation: UPDATE_RESPONSIBLE_UNIT_MUTATION,
  deleteMutation: DELETE_RESPONSIBLE_UNIT_MUTATION
});

export const typeRepository = createMutations<Type>({
  createMutation: CREATE_TYPE_MUTATION,
  updateMutation: UPDATE_TYPE_MUTATION,
  deleteMutation: DELETE_TYPE_MUTATION
})

export const activityRepository = createMutations<Activity>({
  createMutation: CREATE_ACTIVITY_MUTATION,
  updateMutation: UPDATE_ACTIVITY_MUTATION,
  deleteMutation: DELETE_ACTIVITY_MUTATION
})

export const clasificationRepository = createMutations<Clasification>({
  createMutation: CREATE_CLASIFICATION_MUTATION,
  updateMutation: UPDATE_CLASIFICATION_MUTATION,
  deleteMutation: DELETE_CLASIFICATION_MUTATION
})

export const groupedStateRepository = createMutations<GroupedState>({
  createMutation: CREATE_GROUPED_STATE_MUTATION,
  updateMutation: UPDATE_GROUPED_STATE_MUTATION,
  deleteMutation: DELETE_GROUPED_STATE_MUTATION
})

export const referenceRespository = createMutations<Reference>({
  createMutation: CREATE_REFERENCE_MUTATION,
  updateMutation: UPDATE_REFERENCE_MUTATION,
  deleteMutation: DELETE_REFERENCE_MUTATION
})
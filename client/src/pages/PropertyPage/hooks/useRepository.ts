import { useCustomMutation } from "../../../hooks"
import { Activity } from "../../ActivityPage/models/types"
import { City } from "../../CityPage/models/types"
import { Clasification } from "../../ClasificationPage/models/types"
import { GroupedState } from "../../GroupedState/models/types"
import { Municipality } from "../../MunicipalityPage/models/types"
import { Province } from "../../ProvincePage/models/types"
import { Reference } from "../../ReferencePage/models/types"
import { ResponsibleUnit } from "../../ResponsibleUnitPage/models/types"
import { Stage } from "../../StagePage/models/types"
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
    V1 extends { name: string } = { name: string },
    R2 extends R1 = R1,
    V2 extends Pick<E, 'name'> & { item: E } = Pick<E, 'name'> & { item: E },
    R3 extends R1 = R1,
    V3 extends E = E
  >() => {
    const { addItem, updateItem, deleteItem, rollback } = useStore();

    return {
      mutationCreate: useCustomMutation<R1, { input: V1 }>(createMutation, {
        onError() {
          rollback();
        },
        onMutate({ input }) {
          addItem(input)
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
	mutation CreateCity($input: CityInput) {
		city: createCity(input: $input) {
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
  mutation CreateMunicipality($input: MunicipalityInput) {
    municipality: createMunicipality(input: $input) {
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
  mutation UpdateState($name: String, $item: StateInput) {
    state: updateState(name: $name, item: $item) {
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

const CREATE_FOLDERLOCATION_MUTATION = `
  mutation CreateFolderLocation($input: FolderLocationInput) {
    folderLocation: createFolderLocation(input: $input) {
      name
    }
  }
`

const UPDATE_FOLDERLOCATION_MUTATION = `
  mutation UpdateFolderLocationMutation($name: String, $item: FolderLocationInput) {
    folderLocation: updateFolderLocation(name: $name, item: $item) {
      name
    }
  }
`

const DELETE_FOLDERLOCATION_MUTATION = `
  mutation DeleteFolderLocationMutation($name: String) {
    folderLocation: deleteFolderLocation(name: $name) {
      name
    }
  }
`

const CREATE_UNIT_MUTATION = `
	mutation CreateUnit($input: UnitInput) {
		unit: createUnit(input: $input) {
			name
		}
	}
`;

const UPDATE_UNIT_MUTATION = `
	mutation UpdateUnit($name: String, $item: UnitInput) {
		unit: updateUnit(name: $name, item: $item) {
			name
		}
	}
`;

const DELETE_UNIT_MUTATION = `
  mutation DeleteUnit($name: String) {
    unit: deleteUnit(name: $name) {
      name
    }
  }
`

const CREATE_TYPE_MUTATION = `
	mutation CreateType($input: TypeInput) {
		type: createType(input: $input) {
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
	mutation CreateActivity($input: ActivityInput) {
		activity: createActivity(input: $input) {
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
	mutation CreateClasification($input: ClasificationInput) {
		clasification: createClasification(input: $input) {
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
	mutation CreateGroupedState($input: GroupedStateInput) {
		groupedState: createGroupedState(input: $input) {
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
	mutation CreateReference($input: ReferenceInput) {
		reference: createReference(input: $input) {
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

const CREATE_STAGE_MUTATION = `
	mutation CreateStage($input: StageInput) {
		stage: createStage(input: $input) {
			name
		}
	}
`;

const UPDATE_STAGE_MUTATION = `
	mutation UpdateStage($name: String, $item: StageInput) {
		stage: updateStage(name: $name, item: $item) {
			name
		}
	}
`;

const DELETE_STAGE_MUTATION = `
  mutation DeleteStage($name: String) {
    stage: deleteStage(name: $name) {
      name
    }
  }
`

export const { useStore: useCityStore, useMutations: useCityMutations } = createMutations<City>({
  createMutation: CREATE_CITY_MUTATION,
  updateMutation: UPDATE_CITY_MUTATION,
  deleteMutation: DELETE_CITY_MUTATION
});

export const { useStore: useProvinceStore, useMutations: useProvinceMutations } = createMutations<Province>({
  createMutation: CREATE_PROVINCE_MUTATION,
  updateMutation: UPDATE_PROVINCE_MUTATION,
  deleteMutation: DELETE_PROVINCE_MUTATION
})

export const { useStore: useMunicipalityStore, useMutations: useMunicipalityMutations } = createMutations<Municipality>({
  createMutation: CREATE_MUNICIPALITY_MUTATION,
  updateMutation: UPDATE_MUNICIPALITY_MUTATION,
  deleteMutation: DELETE_MUNICIPALITY_MUTATION
})

export const { useStore: useStateStore, useMutations: useStateMutations } = createMutations<State>({
  createMutation: CREATE_STATE_MUTATION,
  updateMutation: UPDATE_STATE_MUTATION,
  deleteMutation: DELETE_STATE_MUTATION
})

export const { useStore: useSubdirectoryStore, useMutations: useSubdirectoryMutations } = createMutations<SubDirectory>({
  createMutation: CREATE_FOLDERLOCATION_MUTATION,
  updateMutation: UPDATE_FOLDERLOCATION_MUTATION,
  deleteMutation: DELETE_FOLDERLOCATION_MUTATION
})

export const { useStore: useResponsibleUnitStore, useMutations: useResponsibleUnitMutations } = createMutations<ResponsibleUnit>({
  createMutation: CREATE_UNIT_MUTATION,
  updateMutation: UPDATE_UNIT_MUTATION,
  deleteMutation: DELETE_UNIT_MUTATION
});

export const { useStore: useTypeStore, useMutations: useTypeMutations } = createMutations<Type>({
  createMutation: CREATE_TYPE_MUTATION,
  updateMutation: UPDATE_TYPE_MUTATION,
  deleteMutation: DELETE_TYPE_MUTATION
})

export const { useStore: useActivityStore, useMutations: useActivityMutations } = createMutations<Activity>({
  createMutation: CREATE_ACTIVITY_MUTATION,
  updateMutation: UPDATE_ACTIVITY_MUTATION,
  deleteMutation: DELETE_ACTIVITY_MUTATION
})

export const { useStore: useClasificationStore, useMutations: useClasificationMutations } = createMutations<Clasification>({
  createMutation: CREATE_CLASIFICATION_MUTATION,
  updateMutation: UPDATE_CLASIFICATION_MUTATION,
  deleteMutation: DELETE_CLASIFICATION_MUTATION
})

export const { useStore: useGroupedStateStore, useMutations: useGroupedStateMutations } = createMutations<GroupedState>({
  createMutation: CREATE_GROUPED_STATE_MUTATION,
  updateMutation: UPDATE_GROUPED_STATE_MUTATION,
  deleteMutation: DELETE_GROUPED_STATE_MUTATION
})

export const { useStore: useReferenceStore, useMutations: useReferenceMutations } = createMutations<Reference>({
  createMutation: CREATE_REFERENCE_MUTATION,
  updateMutation: UPDATE_REFERENCE_MUTATION,
  deleteMutation: DELETE_REFERENCE_MUTATION
})

export const { useStore: useStageStore, useMutations: useStageMutations } = createMutations<Stage>({
  createMutation: CREATE_STAGE_MUTATION,
  updateMutation: UPDATE_STAGE_MUTATION,
  deleteMutation: DELETE_STAGE_MUTATION
})
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

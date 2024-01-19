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
`;

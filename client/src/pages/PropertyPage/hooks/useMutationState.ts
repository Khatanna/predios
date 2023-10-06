import { useCustomMutation } from "../../../hooks";
import { State } from "../../StatePage/models/types";
import { useStateStore } from "../state/useStateStore"

const CREATE_STATE_MUTATION = `
  mutation CreateState($input: StateInput) {
    result: createState(input: $input) {
      name
    }
  }
`

const UPDATE_STATE_MUTATION = `
  mutation UpdateState($name: String, $input: StateInput) {
    result: updateState(name: $name, input: $input) {
      name
    }
  }
`

export const useMutationState = () => {
  const { addState, deleteState, updateState } = useStateStore();

  const [createStateMutation] = useCustomMutation<{ result: State }, { input: Pick<State, 'name'> }>(CREATE_STATE_MUTATION, {
    onSuccess({ result: { name } }) {
    },
    onError(error, { input: { name } }) {
      deleteState({ name })
    },
    onMutate({ input: { name } }) {
      addState({ name })
    },
  })

  const [updateStateMutation] = useCustomMutation<{ result: State }, { name: string, input: Pick<State, 'name'> }>(UPDATE_STATE_MUTATION, {
    onSuccess(data, variables) {

    },
    onError(error, { name, input }) {
      updateState({ currentName: input.name, newName: name })
    },
    onMutate({ name, input }) {
      updateState({ currentName: name, newName: input.name })
    },
  })

  const [deleteStateMutation] = useCustomMutation<{ result: State }, { name: string }>(UPDATE_STATE_MUTATION, {
    onSuccess(data, variables) {

    },
    onError(error, { name }) {
      addState({ name })
    },
    onMutate({ name }) {
      deleteState({ name })
    },
  })

  return { createStateMutation, updateStateMutation, deleteStateMutation }
}
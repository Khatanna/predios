import { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Property } from '../../models/types';
import { DynamicSelect } from '../DynamicSelect';
import { useStateStore } from '../../state/useStateStore';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import { State } from '../../../StatePage/models/types';
import { useMutationState } from '../../hooks/useMutationState';
import { customSwalError } from '../../../../utilities/alerts';

const GET_ALL_STATES_QUERY = `
	query GetAllStates {
		states: getAllStates {
			name
		}
	}
`

const StateSelect: React.FC<Pick<UseFormReturn<Property>, 'control'>> = ({ control }) => {
	const { setStates, states, setState } = useStateStore();

	useCustomQuery<{ states: Pick<State, 'name'>[] }>(GET_ALL_STATES_QUERY, ['getAllStates'], {
		onSuccess({ states }) {
			setStates(states)
		},
	})
	const { createStateMutation, deleteStateMutation, updateStateMutation } = useMutationState()
	const options = useMemo(() => states.map(state => ({ label: state.name, value: state.name })), [states])

	return <DynamicSelect
		name="state.name"
		title="Ingrese en nombre del estado"
		placeholder="Estado"
		control={control}
		options={options}
		onConfirm={({ currentValue, newValue }) => {
			updateStateMutation({ name: currentValue, input: { name: newValue } })
		}}
		onSelect={({ value }) => {
			const state = states.find(state => state.name === value);

			if (state) {
				setState(state)
			} {
				customSwalError("Este estado no existe", "Error de lectura")
			}
		}}
		onAction={({ value }) => {
			// createStateMutation({ input: { name: value } })
		}}
		onDelete={({ value }) => {
			deleteStateMutation({ name: value })
		}}
		onClick={() => {

		}}
	/>
};

export default StateSelect;

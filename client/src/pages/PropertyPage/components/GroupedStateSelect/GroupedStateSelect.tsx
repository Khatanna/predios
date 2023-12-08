import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Property } from '../../models/types';
import { SelectNameable } from '../../../HomePage/HomePage';
import { useGroupedStateStore } from '../../state/useSelectablesStore';
import { useModalStore } from '../../state/useModalStore';
import { GroupedState } from '../../../GroupedState/models/types';
import { useGroupedStateMutations } from '../../hooks/useRepository';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';
import { Form } from 'react-bootstrap';
import { CustomLabel } from '../CustomLabel';
import { Box2 } from 'react-bootstrap-icons';

export type GroupedStateSelectProps = {
	readOnly: boolean
}

const GET_ALL_GROUPED_STATES_QUERY = `
	query GetAllGroupedStates {
		groupedStates: getAllGroupedStates {
			name
		}
	}
`;

const GroupedStateSelect: React.FC<GroupedStateSelectProps> = ({ readOnly }) => {
	const { control, resetField, getValues, watch } = useFormContext<Property>();
	const { setModal } = useModalStore();
	const groupedState = watch('groupedState.name')
	const { items: groupedStates, setItems: setGroupedStates } = useGroupedStateStore();
	const { mutationDelete: mutationGroupedStateDelete } =
		useGroupedStateMutations<{ groupedState: GroupedState }>();
	const { error } = useCustomQuery<{ groupedStates: GroupedState[] }>(GET_ALL_GROUPED_STATES_QUERY, ['getAllGroupedStates'], {
		onSuccess({ groupedStates }) {
			setGroupedStates(groupedStates)
		}
	})

	return <Form.Group>
		<CustomLabel
			label="Estado agrupado"
			icon={<Box2 color="#864e16" />}
		/>
		<Controller
			name="groupedState.name"
			control={control}
			defaultValue="undefined"
			render={({ field }) => (
				<SelectNameable
					{...field}
					readOnly={readOnly}
					size="sm"
					highlight
					placeholder={"Estado agrupado"}
					options={groupedStates.map(({ name }) => ({
						label: name,
						value: name,
					}))}
					onCreate={() => {
						setModal({
							form: "createGroupedState",
							title: "Crear estado agrupado",
							show: true,
						});
					}}
					onEdit={() => {
						setModal({
							form: "updateGroupedState",
							title: "Actualizar estado agrupado",
							show: true,
							params: { name: groupedState },
						});
					}}
					onDelete={() => {
						const groupedState =
							getValues("groupedState");

						if (groupedState) {
							mutationGroupedStateDelete(groupedState, {
								onSuccess({
									data: {
										groupedState: { name },
									},
								}) {
									customSwalSuccess(
										"Estado agrupado eliminado",
										`El estado agrupado ${name} se ha eliminado correctamente`,
									);
								},
								onError(error, { name }) {
									customSwalError(
										error.response!.data.errors[0].message,
										`Ocurrio un error al intentar eliminar el estado agrupado ${name}`,
									);
								},
								onSettled() {
									resetField("groupedState.name", {
										defaultValue: "undefined",
									});
								},
							});
						}
					}}
				/>
			)}
		/>
	</Form.Group>
};

export default GroupedStateSelect;

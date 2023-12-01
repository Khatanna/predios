import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { CheckSquare, DashSquare, PencilSquare, PlusSquare, XSquare } from 'react-bootstrap-icons';
import { Controller, UseFieldArrayReturn, useFormContext } from 'react-hook-form';
import { Tooltip } from '../../../../components/Tooltip';
import { useAuth, useCustomMutation } from '../../../../hooks';
import { Tracking } from '../../../TrackingPage/models/types';
import { Property } from '../../models/types';
import { usePaginationStore } from '../../state/usePaginationStore';
import { SelectUser } from '../SelectUser';
import { StateSelect } from '../StateSelect';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';
import { useQueryClient } from '@tanstack/react-query';

const CREATE_TRACKING_MUTATION = `
	mutation CreateTraking($propertyId: String, $input: TrackingInput) {
		tracking: createTracking(propertyId: $propertyId, input: $input) {
			observation
		}
	}
`;

const DELETE_TRACKING_MUTATION = `
	mutation DeleteTraking($propertyId: String, $id: String) {
		tracking: deleteTracking(propertyId: $propertyId, id: $id) {
			observation
		}
	}
`;

const UPDATE_TRACKING_MUTATION = `
	mutation UpdateTraking($trackingId: String, $input: TrackingInput) {
		tracking: updateTracking(trackingId: $trackingId, input: $input) {
			observation
		}
	}
`;

export type TrackingListProps = Pick<Property, 'trackings'> & Pick<UseFieldArrayReturn<Property, 'trackings'>, 'remove' | 'update'>
type TrackingInput = Pick<Tracking, 'state' | 'dateOfInit' | 'numberOfNote' | 'observation' | 'responsible' | 'id'>
const TrackingItem: React.FC<{ tracking: TrackingInput, index: number } & Pick<UseFieldArrayReturn<Property, 'trackings'>, 'remove' | 'update'>> = ({ tracking, index, remove, update }) => {
	const { role } = useAuth();
	const queryClient = useQueryClient();
	const { register, getValues, control, formState: { defaultValues } } = useFormContext<Property>();
	const isNew = index >= (defaultValues?.trackings?.length ?? 0);
	const [edit, setEdit] = useState(false);
	const [create] = useCustomMutation<Tracking, { propertyId: string, input: TrackingInput }>(CREATE_TRACKING_MUTATION, {
		onSuccess(data, { input }) {
			update(index, input);
			queryClient.invalidateQueries({ queryKey: ["getPropertyById"] })
			customSwalSuccess("Seguimiento creado", "Se ha creado un nuevo seguimiento para este predio")
		},
		onError(error) {
			remove(index)
			customSwalError(error, "Ocurrio un error al intentar crear el seguimientos")
		},
	});
	const [deleteT] = useCustomMutation<Tracking, { propertyId: string, id: string }>(DELETE_TRACKING_MUTATION, {
		onSuccess() {
			customSwalSuccess("Seguimiento eliminado", "Se ha eliminado un nuevo seguimiento para este predio")
			queryClient.invalidateQueries({ queryKey: ["getPropertyById"] })
			remove(index);
		},
		onError(error) {
			customSwalError(error, "Ocurrio un error al intentar eliminar el seguimiento")
		},
	});

	const [updateT] = useCustomMutation<Tracking, { trackingId: string, input: TrackingInput }>(UPDATE_TRACKING_MUTATION, {
		onSuccess(_data, { input }) {
			customSwalSuccess("Seguimiento actualizdado", "Se ha actualizdado el seguimiento de este predio")
			queryClient.invalidateQueries({ queryKey: ["getPropertyById"] })
			update(index, input);
		},
		onError(error, { input }) {
			update(index, input)
			customSwalError(error, "Ocurrio un error al intentar actualizar el seguimiento")
		},
	});

	const createTracking = () => {
		create({
			propertyId: getValues('id'),
			input: getValues(`trackings.${index}`)
		})
	}
	const deleteTracking = () => {
		deleteT({
			propertyId: getValues('id'),
			id: getValues(`trackings.${index}`).id,
		})
	}

	return <Row
		className="border border-1 border-dark-subtle d-flex py-2 rounded-1 position-relative mb-2"
	>
		<Col>
			<Form.Group>
				<Form.Label className="fw-bold">
					Seguimiento estado:
				</Form.Label>
				<StateSelect
					readOnly={!isNew}
					name={`trackings.${index}.state.name`}
				/>
			</Form.Group>
		</Col>
		<Col xs={2}>
			<Form.Group>
				<Form.Label className="fw-bold">
					Fecha de inicio:
				</Form.Label>
				<Form.Control
					type="date"
					{...register(
						`trackings.${index}.dateOfInit`,
					)}
					size="sm"
					disabled={!edit && !isNew}
					placeholder="Fecha de inicio"
				/>
			</Form.Group>
		</Col>
		<Col>
			<Form.Group>
				<Form.Label className="fw-bold">
					Responsable:
				</Form.Label>
				<Controller
					name={`trackings.${index}.responsible`}
					control={control}
					render={({ field }) => (
						<SelectUser
							{...field}
							isDisabled={!edit && !isNew}
							placeholder="Responsable"
						/>
					)}
				/>
			</Form.Group>
		</Col>
		<Col xs={2}>
			<Form.Group>
				<Form.Label className="fw-bold">
					# Nota:
				</Form.Label>

				<Form.Control
					{...register(
						`trackings.${index}.numberOfNote`,
					)}
					disabled={!edit && !isNew}
					size="sm"
					placeholder="# Nota"

				/>
			</Form.Group>
		</Col>
		<Col xs={2}>
			<Form.Group>
				<Form.Label className="fw-bold">
					Observación:
				</Form.Label>
				<Form.Control
					{...register(
						`trackings.${index}.observation`,
					)}
					disabled={!edit && !isNew}
					size="sm"
					placeholder="Observación"
				/>
			</Form.Group>
		</Col>
		{(role === "Administrador") && <div
			className={
				"position-absolute top-0 left-0 mt-1 d-flex gap-1 justify-content-end"
			}
		>
			{isNew ?
				<>
					{Boolean(getValues('id')) && <Tooltip label="Crear seguimiento">
						<PlusSquare
							color="green"
							className="float-end"
							role="button"
							fontSize={16}
							onClick={() => createTracking()}
						/>
					</Tooltip>}
					<Tooltip label="Quitar seguimiento">
						<DashSquare
							color="orange"
							className="float-end"
							role="button"
							fontSize={16}
							onClick={() => remove(index)}
						/>
					</Tooltip>
				</>
				: <>
					{!edit && getValues('id') ?
						<>
							<Tooltip label='Editar seguimiento'>
								<PencilSquare
									color="blue"
									className="float-end"
									role="button"
									fontSize={16}
									onClick={() => setEdit(true)}
								/>
							</Tooltip>
							<Tooltip label='Borrar seguimiento'>
								<XSquare
									color="red"
									className="float-end"
									role="button"
									fontSize={16}
									onClick={() => deleteTracking()}
								/>
							</Tooltip>
						</>
						: <>
							<Tooltip label='Cancelar'>
								<XSquare
									color="brown"
									className="float-end"
									role="button"
									fontSize={16}
									onClick={() => {
										setEdit(false)
									}}
								/>
							</Tooltip>
							<Tooltip label='Actualizar seguimiento'>
								<CheckSquare
									color="green"
									className="float-end"
									role="button"
									fontSize={16}
									onClick={() => {
										updateT({
											trackingId: getValues(`trackings.${index}.id`),
											input: { ...getValues(`trackings.${index}`) }
										})
										setEdit(false)
									}}
								/>
							</Tooltip>
						</>
					}
				</>
			}
		</div>}
	</Row>
}

const TrackingList: React.FC<TrackingListProps> = ({ trackings, ...props }) => {
	return trackings.map((tracking, index) => (
		<TrackingItem tracking={tracking} index={index} {...props} key={crypto.randomUUID()} />
	))
};

export default TrackingList;

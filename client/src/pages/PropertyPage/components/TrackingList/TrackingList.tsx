import React, { useState } from 'react';
import { Property } from '../../models/types';
import { UseFieldArrayReturn } from 'react-hook-form'
import { Col, Form, Row } from 'react-bootstrap';
import { StateSelect } from '../StateSelect';
import { Tooltip } from '../../../../components/Tooltip';
import { CheckCircle, CheckSquare, CircleHalf, DashCircle, DashSquare, InfoCircle, Pencil, PencilSquare, PlusCircle, PlusSquare, XCircle, XSquare } from 'react-bootstrap-icons';
import { useFormContext, Controller } from 'react-hook-form';
import { useAuth } from '../../../../hooks';
import { SelectUser } from '../SelectUser';
import { Tracking } from '../../../TrackingPage/models/types';
import { EditableInput } from '../EditableInput';
import { usePaginationStore } from '../../state/usePaginationStore';

export type TrackingListProps = Pick<Property, 'trackings'> & Pick<UseFieldArrayReturn<Property, 'trackings'>, 'remove' | 'update'>

const TrackingItem: React.FC<{ tracking: Pick<Tracking, 'state' | 'dateOfInit' | 'numberOfNote' | 'observation' | 'responsible'>, index: number } & Pick<UseFieldArrayReturn<Property, 'trackings'>, 'remove' | 'update'>> = ({ tracking, index, remove, update }) => {
	const { role } = useAuth();
	const { property } = usePaginationStore();
	const { register, getValues, control } = useFormContext<Property>();
	const isNew = Boolean(getValues('id')) && index + 1 > property!.trackings!.length;
	const [edit, setEdit] = useState(false);
	const createTracking = () => { }
	const deleteTracking = () => { }
	return <Row
		className="border border-1 border-dark-subtle d-flex py-2 rounded-1 position-relative mb-2"
	>
		<Col>
			<Form.Group>
				<Form.Label className="fw-bold">
					Seguimiento estado:
				</Form.Label>

				<StateSelect
					readOnly={!edit && !isNew}
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

				{/* <Form.Control
					value={tracking.responsible?.names.concat(' ', tracking.responsible.firstLastName, ' ', tracking.responsible.secondLastName)}
					disabled size="sm" hidden /> */}
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
					<Tooltip label="Crear seguimiento">
						<PlusSquare
							color="green"
							className="float-end"
							role="button"
							fontSize={16}
							onClick={() => deleteTracking()}
						/>
					</Tooltip>
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
					{!edit ?
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
									onClick={() => createTracking()}
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

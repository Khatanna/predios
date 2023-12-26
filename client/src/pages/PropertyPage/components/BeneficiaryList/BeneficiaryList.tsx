import { useState } from 'react';
import { Badge, Form, InputGroup, ListGroup } from 'react-bootstrap';
import { Tooltip } from '../../../../components/Tooltip';
import { useAuth, useCustomMutation } from '../../../../hooks';
import { Check, Pencil, ThreeDotsVertical, Trash, X } from 'react-bootstrap-icons';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';
import { useFormContext, UseFieldArrayReturn } from 'react-hook-form'
import { Property } from '../../models/types';
import { Beneficiary } from '../../../BeneficiaryPage/models/types';
import { DropdownMenu } from '../../../HomePage/HomePage';

export type BeneficiaryListProps = {
	beneficiaries: Pick<Beneficiary, 'name'>[]
	maxHeight: number
} & Pick<UseFieldArrayReturn<Property, 'beneficiaries'>, 'remove' | 'update'>

type BeneficiaryItemProps = {
	beneficiary: Pick<Beneficiary, 'name'>;
	index: number
} & Pick<UseFieldArrayReturn<Property, 'beneficiaries'>, 'remove' | 'update'>

const CREATE_BENEFICIARY_MUTATION = `
	mutation CreateBeneficiary($propertyId: String, $input: BeneficiaryInput) {
		beneficiary: createBeneficiary(propertyId: $propertyId, input: $input) {
			name
		}
	}
`

const DELETE_BENEFICIARY_MUTATION = `
	mutation UpdateBeneficiary($input: BeneficiaryInput) {
		beneficiary: deleteBeneficiary(input: $input) {
			name
		}
	}
`

const UPDATE_BENEFICIARY_MUTATION = `
	mutation UpdateBeneficiary($name: String, $input: BeneficiaryInput) {
		beneficiary: updateBeneficiary(name: $name, input: $input) {
			name
		}
	}
`

const BeneficiaryItem: React.FC<BeneficiaryItemProps> = ({ beneficiary, index, remove, update, }) => {
	const { role } = useAuth();
	const oldName = beneficiary.name;
	const [edit, setEdit] = useState(false);
	const { register, getValues } = useFormContext<Property>();
	const [createBeneficiary] = useCustomMutation<{ beneficiary: Beneficiary }, { propertyId: string, input: Pick<Beneficiary, 'name'>, index: number }>(
		CREATE_BENEFICIARY_MUTATION,
		{
			onSuccess(_data, { index, input: { name } }) {
				customSwalSuccess("Beneficiario agregado correctamente", "Se ha creado un beneficiario para este predio");
				update(index, { name });
			},
			onError(error) {
				remove(index);
				customSwalError(error, "Ocurrio un error al intentar crear el beneficiario")
			},
		}
	)
	const [deleteBeneficiary] = useCustomMutation<{ beneficiary: Beneficiary }, { input: Pick<Beneficiary, 'name'>, index: number }>(
		DELETE_BENEFICIARY_MUTATION,
		{
			onSuccess({ beneficiary: { name } }) {
				customSwalSuccess("Beneficiario eliminado correctamente", `Se ha eliminado al beneficiario: (${name}) de este predio`);
				remove(index);
			},
			onError(error) {
				customSwalError(error, "Ocurrio un error al intentar eliminar el beneficiario")
				// append
			},
		}
	)
	const [updateBeneficiary] = useCustomMutation<{ beneficiary: Beneficiary }, { name: string, input: Pick<Beneficiary, 'name'>, index: number }>(
		UPDATE_BENEFICIARY_MUTATION,
		{
			onSuccess({ beneficiary: { name } }) {
				customSwalSuccess("Beneficiario actualizado correctamente", `Se ha actualizado al beneficiario: (${name}) de este predio`);
				update(index, { name });
			},
			onError(error) {
				customSwalError(error, "Ocurrio un error al intentar actualizar el beneficiario")
			},
		}
	)
	if (!edit && beneficiary.name.length > 0) {
		return <ListGroup.Item className="d-flex justify-content-between align-items-center">
			<div className="ms-1 me-auto">
				{beneficiary.name}
			</div>
			{role === 'administrador' && <div className="d-flex gap-1">
				<Tooltip label="Editar beneficiario">
					<Badge bg="info" role="button" onClick={() => setEdit(true)}>
						<Pencil />
					</Badge>
				</Tooltip>
				<Tooltip label="Quitar beneficiario">
					<Badge bg="danger" role="button" onClick={() => {
						if (getValues('id')) {
							deleteBeneficiary({
								index,
								input: getValues(`beneficiaries.${index}`)
							})
						} else {
							remove(index);
						}
					}} >
						<Trash />
					</Badge>
				</Tooltip>
			</div>}
		</ListGroup.Item>
	}

	return <InputGroup>
		<Form.Control {...register(`beneficiaries.${index}.name`)} onKeyDown={(e) => {
			const name = getValues(`beneficiaries.${index}.name`);

			if (e.key === "Enter") {
				if (name.length > 0) {
					if (getValues('id')) {
						if (edit) {
							updateBeneficiary({
								index,
								input: { name },
								name: oldName
							})
						} else {
							createBeneficiary({
								propertyId: getValues('id'),
								input: { name },
								index
							})
						}
					} else {
						update(index, {
							name: getValues(`beneficiaries.${index}.name`)
						})
					}
				} else {
					customSwalError("El beneficiario debe tener al menos 1 nombre", "Beneficiario sin nombre")
				}
			}
		}} autoComplete="off" autoFocus />
		<InputGroup.Text>
			<DropdownMenu options={[
				{
					item: ['Cancelar', {
						onClick: () => {
							if (edit) {
								setEdit(false);
							} else {
								remove(index)
							}
						}
					}],
					icon: [X, {
						fontSize: 24,
						color: 'red'
					}]
				},
				{
					item: ['Confirmar', {
						onClick: () => {
							const name = getValues(`beneficiaries.${index}.name`);

							if (name.length > 0) {
								if (edit) {
									updateBeneficiary({
										index,
										input: { name },
										name: oldName
									})
								} else if (getValues('id')) {
									createBeneficiary({
										propertyId: getValues('id'),
										input: { name },
										index
									})
								} else {
									update(index, {
										name: getValues(`beneficiaries.${index}.name`)
									})
								}
							} else {
								customSwalError("El beneficiario debe tener al menos 1 nombre", "Beneficiario sin nombre")
							}
						}
					}],
					icon: [Check, {
						fontSize: 24,
						color: 'green'
					}]
				}
			]} toggleProps={{
				as: ThreeDotsVertical,
				role: "button",
			}} />
		</InputGroup.Text>
	</InputGroup>
}

const BeneficiaryList: React.FC<BeneficiaryListProps> = ({ maxHeight, beneficiaries, ...props }) => {
	return <ListGroup
		as={"ol"}
		numbered
		style={{
			maxHeight:
				maxHeight - 35,
		}}
		className={`${beneficiaries.length <= 2 ? 'overflow-y-visible ' : 'overflow-y-scroll'}  pe-1`}
	>
		{beneficiaries.map((beneficiary, index) => (
			<BeneficiaryItem
				key={crypto.randomUUID()}
				beneficiary={beneficiary}
				index={index}
				{...props}
			/>
		))}
	</ListGroup>
};

export default BeneficiaryList;

import { useForm, useFormContext } from 'react-hook-form';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { FormUpdateProps, Property } from '../../models/types';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import { ResponsibleUnit } from '../../../ResponsibleUnitPage/models/types';
import { responsibleUnitRepository } from '../../hooks/useRepository';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';

const GET_RESPONSIBLE_UNIT_BY_NAME = `
  query GetResponsibleUnitByName($name: String) {
    responsibleUnit: getResponsibleUnit(name: $name) {
      name
    }
  }
`
const { useMutations } = responsibleUnitRepository;
const ResponsibleUnitFormUpdate: React.FC<FormUpdateProps> = ({ onHide, params }) => {
	const { data } = useCustomQuery<{ responsibleUnit: ResponsibleUnit }>(GET_RESPONSIBLE_UNIT_BY_NAME, ['getResponsibleUnitByName', { name: params?.name }])
	const { resetField } = useFormContext<Property>();
	const { register, handleSubmit } = useForm<ResponsibleUnit>({
		values: data?.responsibleUnit
	});
	const { mutationUpdate } = useMutations<{ responsibleUnit: ResponsibleUnit }>();
	return <Form onSubmit={handleSubmit(data => {
		if (params) {
			mutationUpdate({
				name: params.name,
				item: data
			}, {
				onSuccess({ data: { responsibleUnit: { name } } }) {
					customSwalSuccess(
						"Unidad responsable actualizada",
						`La unidad responsable ${name} se ha actualizado correctamente`,
					);
				},
				onError(error, { name }) {
					customSwalError(
						error.response!.data.errors[0].message,
						`Ocurrio un error al intentar actualizar la unidad responsable ${name}`,
					);
				},
				onSettled() {
					resetField('responsibleUnit.name', { defaultValue: 'undefined' })
					onHide()
				}
			});
		}
	})} >
		<Row>
			<Col>
				<Form.Label>Unidad responsable</Form.Label>
				<Form.Control {...register('name')} placeholder='Unidad responsable'></Form.Control>
			</Col>
		</Row>
		<Row className='mt-3'>
			<Col className='d-flex justify-content-end gap-2'>
				<Button variant='danger' onClick={onHide}>
					Cancelar
				</Button>
				<Button type='submit' variant='success' className='text-white'>
					Actualizar unidad responsable
				</Button>
			</Col>
		</Row>
	</Form>
}

export default ResponsibleUnitFormUpdate;

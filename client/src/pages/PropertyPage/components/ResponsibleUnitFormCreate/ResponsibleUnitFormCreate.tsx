import { useForm } from 'react-hook-form';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { FormCreateProps } from '../../models/types';
import { ResponsibleUnit } from '../../../ResponsibleUnitPage/models/types';
import { useResponsibleUnitMutations } from '../../hooks/useRepository';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';

const ResponsibleUnitFormCreate: React.FC<FormCreateProps> = ({ onHide }) => {
	const { register, handleSubmit } = useForm<ResponsibleUnit>();
	const { mutationCreate } = useResponsibleUnitMutations<{ responsibleUnit: ResponsibleUnit }>();
	return <Form onSubmit={handleSubmit(data => {
		mutationCreate({ input: data }, {
			onSuccess({ data: { responsibleUnit: { name } } }) {
				customSwalSuccess(
					"Nueva unidad responsable agregada",
					`La unidad responsable ${name} se ha creado correctamente`,
				);
			},
			onError(error, { input: { name } }) {
				customSwalError(
					error.response!.data.errors[0].message,
					`Ocurrio un error al intentar crear la unidad responsable ${name}`,
				);
			},
			onSettled() {
				onHide()
			},
		});
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
					Crear unidad responsable
				</Button>
			</Col>
		</Row>
	</Form>
}

export default ResponsibleUnitFormCreate;

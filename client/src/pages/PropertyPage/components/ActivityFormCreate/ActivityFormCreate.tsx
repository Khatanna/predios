import { Row, Col, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FormCreateProps } from '../../models/types';
import { Activity } from '../../../ActivityPage/models/types';
import { useActivityMutations } from '../../hooks/useRepository';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';

const ActivityFormCreate: React.FC<FormCreateProps> = ({ onHide }) => {
	const { register, handleSubmit } = useForm<Activity>();
	const { mutationCreate } = useActivityMutations<{ activity: Activity }>();
	return <Form onSubmit={handleSubmit(data => {
		mutationCreate({ input: data }, {
			onSuccess({ data: { activity: { name } } }) {
				customSwalSuccess(
					"Nueva actividad agregada",
					`La actividad ${name} se ha creado correctamente`,
				);
			},
			onError(error, { input: { name } }) {
				customSwalError(
					error.response!.data.errors[0].message,
					`Ocurrio un error al intentar crear la actividad ${name}`,
				);
			},
			onSettled() {
				onHide()
			}
		});
	})} >
		<Row>
			<Col>
				<Form.Label>Actividad</Form.Label>
				<Form.Control {...register('name')} placeholder='Actividad'></Form.Control>
			</Col>
		</Row>
		<Row className='mt-3'>
			<Col className='d-flex justify-content-end gap-2'>
				<Button variant='danger' onClick={onHide}>
					Cancelar
				</Button>
				<Button type='submit' variant='success' className='text-white'>
					Crear actividad
				</Button>
			</Col>
		</Row>
	</Form>
}

export default ActivityFormCreate;

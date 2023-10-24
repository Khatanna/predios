import { Row, Col, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FormCreateProps } from '../../models/types';
import { clasificationRepository } from '../../hooks/useRepository';
import { Clasification } from '../../../ClasificationPage/models/types';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';

const { useMutations } = clasificationRepository
const ClasificationFormCreate: React.FC<FormCreateProps> = ({ onHide }) => {
	const { register, handleSubmit } = useForm<Clasification>();
	const { mutationCreate } = useMutations<{ clasification: Clasification }>();
	return <Form onSubmit={handleSubmit(data => {
		mutationCreate(data, {
			onSuccess({ data: { clasification: { name } } }) {
				customSwalSuccess("Clasificación creada", `La clasificacion ${name} ha sido creada correctamente`)
			},
			onError(error, { name }) {
				customSwalError(error.response!.data.errors[0].message, `Ocurrio un error al intentar crear la clasificación ${name}`)
			},
			onSettled() {
				onHide()
			},
		});
	})} >
		<Row>
			<Col>
				<Form.Label>Clasificación</Form.Label>
				<Form.Control {...register('name')} placeholder='Clasificación' />
			</Col>
		</Row>
		<Row className='mt-3'>
			<Col className='d-flex justify-content-end gap-2'>
				<Button variant='danger' onClick={onHide}>
					Cancelar
				</Button>
				<Button type='submit' variant='success' className='text-white'>
					Crear clasificación
				</Button>
			</Col>
		</Row>
	</Form>
}
export default ClasificationFormCreate;

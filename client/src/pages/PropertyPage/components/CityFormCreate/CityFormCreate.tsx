import { Row, Col, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useCityMutations } from '../../hooks/useRepository';
import { City } from '../../../CityPage/models/types';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';
import { FormCreateProps } from '../../models/types';

const CityFormCreate: React.FC<FormCreateProps> = ({ onHide }) => {
	const { register, handleSubmit } = useForm<City>();
	const { mutationCreate } = useCityMutations<{ city: City }>();

	return <Form onSubmit={handleSubmit(data => {
		mutationCreate({ input: data }, {
			onSuccess({ data: { city: { name } } }) {
				customSwalSuccess(
					"Nuevo departamento agregado",
					`El departamento ${name} se ha creado correctamente`,
				);
			},
			onError(error, { input: { name } }) {
				customSwalError(
					error.response!.data.errors[0].message,
					`Ocurrio un error al intentar crear el departamento ${name}`,
				);
			},
			onSettled() {
				onHide()
			}
		})
	})} >
		<Row>
			<Col>
				<Form.Label>Departamento</Form.Label>
				<Form.Control {...register('name')} placeholder='Departamento'></Form.Control>
			</Col>
		</Row>
		<Row className='mt-3'>
			<Col className='d-flex justify-content-end gap-2'>
				<Button variant='danger' onClick={onHide}>
					Cancelar
				</Button>
				<Button type='submit' variant='success' className='text-white'>
					Crear departamento
				</Button>
			</Col>
		</Row>
	</Form>
}

export default CityFormCreate;

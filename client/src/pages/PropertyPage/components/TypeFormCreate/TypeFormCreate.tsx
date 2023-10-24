import { Row, Col, Form, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form';
import { typeRepository } from '../../hooks/useRepository';
import { Type } from '../../../TypePage/models/types';
import { FormCreateProps } from '../../models/types';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';


const { useMutations } = typeRepository
const TypeFormCreate: React.FC<FormCreateProps> = ({ onHide }) => {
	const { register, handleSubmit } = useForm<Type>();
	const { mutationCreate } = useMutations<{ type: Type }>();
	return <Form onSubmit={handleSubmit(data => {
		mutationCreate(data, {
			onSuccess({ data: { type: { name } } }) {
				customSwalSuccess(
					"Tipo de predio creado",
					`El tipo de predio ${name} se ha creado correctamente`,
				);
			},
			onError(error, { name }) {
				customSwalError(
					error.response!.data.errors[0].message,
					`Ocurrio un error al intentar crear el tipo de predio ${name}`,
				)
			},
			onSettled() {
				onHide()
			},
		});
	})} >
		<Row>
			<Col>
				<Form.Label>Tipo de predio</Form.Label>
				<Form.Control {...register('name')} placeholder='Tipo de predio' />
			</Col>
		</Row>
		<Row className='mt-3'>
			<Col className='d-flex justify-content-end gap-2'>
				<Button variant='danger' onClick={onHide}>
					Cancelar
				</Button>
				<Button type='submit' variant='success' className='text-white'>
					Crear tipo de predio
				</Button>
			</Col>
		</Row>
	</Form>
}
export default TypeFormCreate;

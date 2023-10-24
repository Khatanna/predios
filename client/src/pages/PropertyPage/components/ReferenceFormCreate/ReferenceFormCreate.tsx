import { Row, Col, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';
import { FormCreateProps } from '../../models/types';
import { Reference } from '../../../ReferencePage/models/types';
import { referenceRespository } from '../../hooks/useRepository';

const { useMutations } = referenceRespository;
const ReferenceFormCreate: React.FC<FormCreateProps> = ({ onHide }) => {
	const { register, handleSubmit } = useForm<Reference>()
	const { mutationCreate } = useMutations<{ reference: Reference }>();
	return <Form onSubmit={handleSubmit(data => {
		mutationCreate(data, {
			onSuccess({ data: { reference: { name } } }) {
				console.log({ name })
				customSwalSuccess(
					"Nueva referencia agregada",
					`La referencia ${name} se ha creado correctamente`,
				);
			},
			onError(error, { name }) {
				customSwalError(
					error.response!.data.errors[0].message,
					`Ocurrio un error al intentar crear la referencia ${name}`,
				);
			},
			onSettled() {
				onHide()
			}
		})
	})} >
		<Row>
			<Col>
				<Form.Label>Referencia</Form.Label>
				<Form.Control {...register('name')} placeholder='Referencia'></Form.Control>
			</Col>
		</Row>
		<Row className='mt-3'>
			<Col className='d-flex justify-content-end gap-2'>
				<Button variant='danger' onClick={onHide}>
					Cancelar
				</Button>
				<Button type='submit' variant='success' className='text-white'>
					Crear referencia
				</Button>
			</Col>
		</Row>
	</Form>
};

export default ReferenceFormCreate;

import { Row, Col, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FormUpdateProps } from '../../models/types';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import { Clasification } from '../../../ClasificationPage/models/types';
import { clasificationRepository } from '../../hooks/useRepository';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';

const GET_CLASIFICATION_BY_NAME_QUERY = `
	query GetClasificationByName($name: String) {
		clasification: getClasification(name: $name) {
			name
		}
	}
`

const { useMutations } = clasificationRepository;
const ClasificationFormUpdate: React.FC<FormUpdateProps> = ({ onHide, params }) => {
	const { data } = useCustomQuery<{ clasification: Clasification }>(GET_CLASIFICATION_BY_NAME_QUERY, ['getClasificationByName', { name: params?.name }])
	const { register, handleSubmit } = useForm<Clasification>({
		values: data?.clasification
	})
	const { mutationUpdate } = useMutations<{ clasification: Clasification }>();

	return <Form onSubmit={handleSubmit(data => {
		if (params) {
			mutationUpdate({
				name: params.name,
				item: data
			}, {
				onSuccess({ data: { clasification: { name } } }) {
					customSwalSuccess("Clasificación actualizar", `La clasificacion ${name} ha sido actualizada correctamente`)
				},
				onError(error, { name }) {
					customSwalError(error.response!.data.errors[0].message, `Ocurrio un error al intentar actualizar la clasificación ${name}`)
				},
				onSettled() {
					onHide()
				},
			});
		}
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
					Actualizar clasificación
				</Button>
			</Col>
		</Row>
	</Form>
};

export default ClasificationFormUpdate;

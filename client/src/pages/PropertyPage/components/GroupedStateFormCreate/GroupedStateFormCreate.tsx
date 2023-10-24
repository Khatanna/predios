import { Button, Col, Form, Row } from 'react-bootstrap';
import { FormCreateProps } from '../../models/types';
import { useForm } from 'react-hook-form';
import { GroupedState } from '../../../GroupedState/models/types';
import { groupedStateRepository } from '../../hooks/useRepository';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';

const { useMutations } = groupedStateRepository

const GroupedStateFormCreate: React.FC<FormCreateProps> = ({ onHide }) => {
	const { register, handleSubmit } = useForm<GroupedState>();
	const { mutationCreate } = useMutations<{ groupedState: GroupedState }>();
	return <Form onSubmit={handleSubmit(data => {
		mutationCreate(data, {
			onSuccess({ data: { groupedState: { name } } }) {
				customSwalSuccess(
					"Estado agrupado creado",
					`El estado agrupado ${name} se ha creado correctamente`,
				);
			},
			onError(error, { name }) {
				customSwalError(
					error.response!.data.errors[0].message,
					`Ocurrio un error al intentar crear el estado agrupado ${name}`,
				);
			},
			onSettled() {
				onHide()
			}
		})
	})}>
		<Row>
			<Col>
				<Form.Label>Estado agrupado</Form.Label>
				<Form.Control {...register('name')} placeholder='Estado agrupado'></Form.Control>
			</Col>
		</Row>
		<Row className='mt-3'>
			<Col className='d-flex justify-content-end gap-2'>
				<Button variant='danger' onClick={onHide}>
					Cancelar
				</Button>
				<Button type='submit' variant='success' className='text-white'>
					Crear estado agrupado
				</Button>
			</Col>
		</Row>
	</Form>
};

export default GroupedStateFormCreate;

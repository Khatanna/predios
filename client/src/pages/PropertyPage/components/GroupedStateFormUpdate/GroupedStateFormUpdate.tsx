import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FormUpdateProps } from '../../models/types';
import { GroupedState } from '../../../GroupedState/models/types';
import { useGroupedStateMutations } from '../../hooks/useRepository';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';

const GET_GROUPED_STATE_BY_NAME_QUERY = `
	query GetGroupedStateByName($name: String) {
		groupedState: getGroupedState(name: $name) {
			name
		}
	}
`

const GroupedStateFormUpdate: React.FC<FormUpdateProps> = ({ onHide, params }) => {
	const { data } = useCustomQuery<{ groupedState: GroupedState }>(GET_GROUPED_STATE_BY_NAME_QUERY, ['getGroupedStateByName', { name: params?.name }])
	const { register, handleSubmit } = useForm<GroupedState>({
		values: data?.groupedState
	});
	const { mutationUpdate } = useGroupedStateMutations<{ groupedState: GroupedState }>();
	return <Form onSubmit={handleSubmit(data => {
		if (params) {
			mutationUpdate({ name: params.name, item: data }, {
				onSuccess({ data: { groupedState: { name } } }) {
					customSwalSuccess(
						"Estado agrupado actualizado",
						`El estado agrupado ${name} se ha actualizado correctamente`,
					);
				},
				onError(error, { name }) {
					customSwalError(
						error.response!.data.errors[0].message,
						`Ocurrio un error al intentar actualizar el estado agrupado ${name}`,
					);
				},
				onSettled() {
					onHide()
				}
			})
		}
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
					Actualizar estado agrupado
				</Button>
			</Col>
		</Row>
	</Form>
};
export default GroupedStateFormUpdate;

import { Row, Col, Form, Button } from 'react-bootstrap';
import { useForm, useFormContext } from 'react-hook-form';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import { Activity } from '../../../ActivityPage/models/types';
import { Property } from '../../models/types';
import { activityRepository } from '../../hooks/useRepository';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';

const GET_ACTIVITY_BY_NAME_QUERY = `
  query GetActivityByName($name: String) {
    activity: getActivity(name: $name) {
      name
    }
  }
`

const { useMutations } = activityRepository;
const ActivityFormUpdate: React.FC<{ onHide: () => void, params?: Record<string, string> }> = ({ onHide, params }) => {
	const { data, isLoading } = useCustomQuery<{ activity: Activity }>(GET_ACTIVITY_BY_NAME_QUERY, ['getActivityByName', { name: params?.name }]);
	const { register, handleSubmit } = useForm<Activity>({ values: data?.activity });
	const { resetField } = useFormContext<Property>();
	const { mutationUpdate } = useMutations<{ activity: Activity }>();

	if (isLoading) {
		return <div>Cargando...</div>
	}
	return <Form onSubmit={handleSubmit(data => {
		if (params) {
			mutationUpdate({ name: params.name, item: data }, {
				onSuccess({ data: { activity: { name } } }) {
					customSwalSuccess(
						"Actividad actualizada",
						`La actividad ${name} se ha actualizado correctamente`,
					);
				},
				onError(error, { name }) {
					customSwalError(
						error.response!.data.errors[0].message,
						`Ocurrio un error al intentar actualizar la actividad ${name}`,
					);
				},
				onSettled() {
					resetField('activity.name', { defaultValue: 'undefined' })
					onHide()
				}
			})
		}
	})}>
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
					Actualizar actividad
				</Button>
			</Col>
		</Row>
	</Form>
}


export default ActivityFormUpdate;

import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';
import { Stage } from '../../../StagePage/models/types';
import { useStageMutations } from '../../hooks/useRepository';
import { FormUpdateProps } from '../../models/types';
import { useModalStore } from '../../state/useModalStore';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';

const GET_STAGE_BY_NAME_QUERY = `
	query GetStageByName($name: String) {
		stage: getStage(name: $name) {
			name
		}
	}
`

const StageFormUpdate: React.FC<FormUpdateProps> = ({ onHide, params }) => {
	const { data } = useCustomQuery<{ stage: Stage }>(GET_STAGE_BY_NAME_QUERY, ['getStageByName', { name: params?.name }])
	const { register, handleSubmit } = useForm<Stage>({
		values: data?.stage
	});
	const { mutationUpdate } = useStageMutations<{ stage: Stage }>();
	const setModal = useModalStore(s => s.setModal)

	return <Form onSubmit={handleSubmit((data) => {
		if (params) {
			mutationUpdate({ name: params.name, item: data }, {
				onSuccess({ data: { stage: { name } } }) {
					customSwalSuccess(
						"Etapa actualizada",
						`La etapa ${name} se ha actualizado correctamente`,
					);
				},
				onError(error, { name }) {
					customSwalError(
						error.response!.data.errors[0].message,
						`Ocurrio un error al intentar actualizo la etapa ${name}`,
					);
				},
				onSettled() {
					onHide()
					setModal({ form: 'createState', show: true, title: 'Crear estado' });
				},
			})
		}
	})} >
		<Row>
			<Col className='d-flex gap-3 flex-column'>
				<Row>
					<Col>
						<Form.Label>Nombre</Form.Label>
						<Form.Control {...register('name')} placeholder='Nombre'></Form.Control>
					</Col>
				</Row>
				<Row className='mt-3'>
					<Col className='d-flex justify-content-end gap-2'>
						<Button variant='danger' onClick={() => {
							onHide()
							setModal({ form: 'createState', show: true, title: 'Crear estado' });
						}}>
							Cancelar
						</Button>
						<Button type='submit' variant='success' className='text-white'>
							Actualizar etapa
						</Button>
					</Col>
				</Row>
			</Col>
		</Row>
	</Form>
};

export default StageFormUpdate;

import { Row, Col, Form, Button } from 'react-bootstrap';
import { FormUpdateProps } from '../../models/types';
import { useForm, Controller } from 'react-hook-form'
import { State } from '../../../StatePage/models/types';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import { EnhancedSelect } from '../EnhancedSelect';
import { Stage } from '../../../StagePage/models/types';
import { stateRepository } from '../../hooks/useRepository';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';


const GET_STATE_BY_NAME = `
  query GetStateByName($name: String) {
    state: getState(name: $name) {
      name
      order
      stage {
        name
      }
    }
  }
`

const GET_ALL_STAGES_QUERY = `
	query GetAllStages {
		stages: getAllStages {
			name
		}
	}
`

type InputState = {
	input: Pick<State, 'name' | 'order'> & { stageName: string }
}


const { useMutations } = stateRepository;
const StateFormUpdate: React.FC<FormUpdateProps> = ({ onHide, params }) => {
	const { data: state } = useCustomQuery<{ state: State }>(GET_STATE_BY_NAME, ['getStateByName', { name: params?.name }])

	const { data } = useCustomQuery<{ stages: Stage[] }>(GET_ALL_STAGES_QUERY, ['getAllStages']);
	const { register, handleSubmit, control } = useForm<State>({
		values: state?.state
	});
	const { mutationUpdate } = useMutations<{ state: State }, { name: string } & InputState>();
	return <Form onSubmit={handleSubmit(data => {
		if (params) {
			mutationUpdate({
				name: params.name, item: data, input: {
					name: data.name,
					order: data.order,
					stageName: data.stage.name
				}
			}, {
				onSuccess({ data: { state: { name } } }) {
					customSwalSuccess(
						"Estado actualizado",
						`El estado ${name} se ha actualizado correctamente`,
					);
				},
				onError(error, { name }) {
					customSwalError(
						error.response!.data.errors[0].message,
						`Ocurrio un error al intentar actualizar el estado ${name}`,
					);
				},
				onSettled() {
					onHide()
				},
			})
		}
	})} >
		<Row>
			<Col className='d-flex gap-3 flex-column'>
				<Row>
					<Col>
						<Form.Label>Estado</Form.Label>
						<Form.Control {...register('name')} placeholder='Nombre'></Form.Control>
					</Col>
					<Col>
						<Form.Label>Orden</Form.Label>
						<Form.Control {...register('order')} placeholder='Orden'></Form.Control>
					</Col>
				</Row>
				<Row>
					<Col>
						<Controller
							name="stage.name"
							control={control}
							render={({ field }) => (
								<EnhancedSelect
									{...field}
									placeholder='Etapa'
									options={data?.stages.map(({ name }) => ({ label: name, value: name }))}
								/>
							)}
						/>
					</Col>
				</Row>
				<Row className='mt-3'>
					<Col className='d-flex justify-content-end gap-2'>
						<Button variant='danger' onClick={onHide}>
							Cancelar
						</Button>
						<Button type='submit' variant='success' className='text-white'>
							Actualizar Estado
						</Button>
					</Col>
				</Row>
			</Col>
		</Row>
	</Form>
}

export default StateFormUpdate;

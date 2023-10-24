import { Row, Col, Form, Button } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form';
import { FormCreateProps } from '../../models/types';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import { Stage } from '../../../StagePage/models/types';
import { stateRepository } from '../../hooks/useRepository';
import { State } from '../../../StatePage/models/types';
import { EnhancedSelect } from '../EnhancedSelect';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';

type InputState = {
	input: Pick<State, 'name' | 'order'> & { stageName: string }
}

const GET_ALL_STAGES_QUERY = `
  query getAllStages {
    stages: getAllStages {
      name
    }
  }
`
const { useMutations } = stateRepository;
const StateFormCreate: React.FC<FormCreateProps> = ({ onHide }) => {
	const { data } = useCustomQuery<{ stages: Stage[] }>(GET_ALL_STAGES_QUERY, ['getAllStages']);
	const { register, handleSubmit, control } = useForm<State>();
	const { mutationCreate } = useMutations<{ state: State }, InputState>();

	return <Form onSubmit={handleSubmit(({ name, order, stage }) => {
		mutationCreate({ input: { name, order, stageName: stage.name }, name }, {
			onSuccess({ data: { state: { name } } }) {
				customSwalSuccess(
					"Nuevo Estado agregado",
					`El estado ${name} se ha creado correctamente`,
				);
			},
			onError(error, { name }) {
				customSwalError(
					error.response!.data.errors[0].message,
					`Ocurrio un error al intentar crear el estado ${name}`,
				);
			},
			onSettled() {
				onHide()
			},
		})
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
							defaultValue='undefined'
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
							Crear Estado
						</Button>
					</Col>
				</Row>
			</Col>
		</Row>
	</Form>
}

export default StateFormCreate;

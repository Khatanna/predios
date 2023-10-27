import { Row, Col, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';
import { FormUpdateProps } from '../../models/types';
import { Reference } from '../../../ReferencePage/models/types';
import { useReferenceMutations } from '../../hooks/useRepository';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';

const GET_REFERENCE_BY_NAME_QUERY = `
	query GetReferenceByName($name: String) {
		reference: getReference(name: $name) {
			name
		}
	}
`
const ReferenceFormUpdate: React.FC<FormUpdateProps> = ({ onHide, params }) => {
	const { data } = useCustomQuery<{ reference: Reference }>(GET_REFERENCE_BY_NAME_QUERY, ['getReferenceByName', { name: params?.name }])
	const { register, handleSubmit } = useForm<Reference>({
		values: data?.reference
	})
	const { mutationUpdate } = useReferenceMutations<{ reference: Reference }>();
	return <Form onSubmit={handleSubmit(data => {
		if (params) {
			mutationUpdate({ name: params.name, item: data }, {
				onSuccess({ data: { reference: { name } } }) {
					console.log({ name })
					customSwalSuccess(
						"Nueva referencia agregado",
						`La referencia ${name} se ha actualizado correctamente`,
					);
				},
				onError(error, { name }) {
					customSwalError(
						error.response!.data.errors[0].message,
						`Ocurrio un error al intentar actualizar la referencia ${name}`,
					);
				},
				onSettled() {
					onHide()
				}
			})
		}
	})}
	>
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
					Actualizar referencia
				</Button>
			</Col>
		</Row>
	</Form>
};

export default ReferenceFormUpdate;

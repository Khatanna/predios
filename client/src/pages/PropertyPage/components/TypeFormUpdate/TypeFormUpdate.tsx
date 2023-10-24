import { useForm, useFormContext } from 'react-hook-form';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { FormUpdateProps, Property } from '../../models/types';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import { Type } from '../../../TypePage/models/types';
import { typeRepository } from '../../hooks/useRepository';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';

const GET_TYPE_BY_NAME_QUERY = `
  query GetTypeByName($name: String) {
    type: getType(name: $name) {
      name
    }
  }
`
const { useMutations } = typeRepository

const TypeFormUpdate: React.FC<FormUpdateProps> = ({ onHide, params }) => {
	const { data } = useCustomQuery<{ type: Type }>(GET_TYPE_BY_NAME_QUERY, ['getTypeByName', { name: params?.name }])
	const { resetField } = useFormContext<Property>();
	const { register, handleSubmit } = useForm<Type>({
		values: data?.type
	});
	const { mutationUpdate } = useMutations<{ type: Type }>();
	return <Form onSubmit={handleSubmit(data => {
		if (params) {
			mutationUpdate({
				name: params.name,
				item: data
			}, {
				onSuccess({ data: { type: { name } } }) {
					customSwalSuccess(
						"Tipo de predio actualizado",
						`El tipo de predio ${name} se ha actualizado correctamente`,
					);
				},
				onError(error, { name }) {
					customSwalError(
						error.response!.data.errors[0].message,
						`Ocurrio un error al intentar actualizar el tipo de predio ${name}`,
					)
				},
				onSettled() {
					resetField('type.name', { defaultValue: 'undefined' })
					onHide()
				}
			});
		}
	})} >
		<Row>
			<Col>
				<Form.Label>Tipo de predio</Form.Label>
				<Form.Control {...register('name')} placeholder='Tipo de predio'></Form.Control>
			</Col>
		</Row>
		<Row className='mt-3'>
			<Col className='d-flex justify-content-end gap-2'>
				<Button variant='danger' onClick={onHide}>
					Cancelar
				</Button>
				<Button type='submit' variant='success' className='text-white'>
					Actualizar tipo de predio
				</Button>
			</Col>
		</Row>
	</Form>
}

export default TypeFormUpdate;

import { Row, Col, Form, Button } from 'react-bootstrap'
import { useForm, useFormContext } from 'react-hook-form';
import { FormUpdateProps, Property } from '../../models/types';
import { City } from '../../../CityPage/models/types';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import { useCityMutations } from '../../hooks/useRepository';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';
import { mutationMessages } from '../../../../utilities/constants';
import { GET_CITY_BY_NAME_QUERY } from '../../../../utilities/queries';

const CityFormUpdate: React.FC<FormUpdateProps> = ({ onHide, params }) => {
	const { data, isLoading } = useCustomQuery<{ city: City }>(GET_CITY_BY_NAME_QUERY.query, [GET_CITY_BY_NAME_QUERY.key, { name: params?.name }]);
	const { register, handleSubmit } = useForm<City>({ values: data?.city });
	const { resetField } = useFormContext<Property>();
	const { mutationUpdate } = useCityMutations<{ city: City }, { name: string, item: City }>();

	if (isLoading) {
		return <div>Cargando...</div>
	}

	return <Form onSubmit={handleSubmit(data => {
		if (params) {
			mutationUpdate({ name: params.name, item: data }, {
				onSuccess({ data: { city: { name } } }) {
					customSwalSuccess(
						mutationMessages.CREATE_CITY.title,
						mutationMessages.CREATE_CITY.getSuccessMessage(name),
					);
				},
				onError(error, { name }) {
					customSwalError(
						error.response!.data.errors[0].message,
						titleMessages.CREATE_CITY.getErrorMessage(name),
					);
				},
				onSettled() {
					resetField('city.name', { defaultValue: 'undefined' })
					onHide()
				}
			})
		}
	})}>
		<Row>
			<Col>
				<Form.Label>Departamento</Form.Label>
				<Form.Control {...register('name')} placeholder='Departamento'></Form.Control>
			</Col>
		</Row>
		<Row className='mt-3'>
			<Col className='d-flex justify-content-end gap-2'>
				<Button variant='danger' onClick={onHide}>
					Cancelar
				</Button>
				<Button type='submit' variant='success' className='text-white'>
					Actualizar departamento
				</Button>
			</Col>
		</Row>
	</Form>
}

export default CityFormUpdate;

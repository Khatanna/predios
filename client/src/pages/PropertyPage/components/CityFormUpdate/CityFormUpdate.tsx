import { Row, Col, Form, Button } from 'react-bootstrap'
import { useForm, useFormContext } from 'react-hook-form';
import { FormUpdateProps, Property } from '../../models/types';
import { City } from '../../../CityPage/models/types';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import { cityRepository } from '../../hooks/useRepository';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';

const GET_CITY_BY_NAME_QUERY = `
	query GetCityByName($name: String) {
		city: getCity(name: $name) {
			name
		}
	}
`

const { useMutations } = cityRepository;
const CityFormUpdate: React.FC<FormUpdateProps> = ({ onHide, params }) => {
	const { data, isLoading } = useCustomQuery<{ city: City }>(GET_CITY_BY_NAME_QUERY, ['getCityByName', { name: params?.name }]);
	const { register, handleSubmit } = useForm<City>({ values: data?.city });
	const { resetField } = useFormContext<Property>();
	const { mutationUpdate } = useMutations<{ city: City }, { name: string, item: City }>();

	if (isLoading) {
		return <div>Cargando...</div>
	}

	return <Form onSubmit={handleSubmit(data => {
		if (params) {
			mutationUpdate({ name: params.name, item: data }, {
				onSuccess({ data: { city: { name } } }) {
					customSwalSuccess(
						"Departamento actualizado",
						`El departamento ${name} se ha actualizado correctamente`,
					);
				},
				onError(error, { name }) {
					customSwalError(
						error.response!.data.errors[0].message,
						`Ocurrio un error al intentar actualizar el departamento ${name}`,
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

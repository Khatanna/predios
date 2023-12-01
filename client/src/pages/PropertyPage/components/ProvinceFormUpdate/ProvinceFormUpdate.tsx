import { useForm, useFormContext } from 'react-hook-form';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { FormUpdateProps, Property } from '../../models/types';
import { Province } from '../../../ProvincePage/models/types';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import { useProvinceMutations } from '../../hooks/useRepository';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';

const GET_PROVINCE_BY_NAME_QUERY = `
	query GetProbinceByName ($name: String ) {
		province: getProvince(name: $name) {
			name
			code
		}
	}
`

const ProvinceFormUpdate: React.FC<FormUpdateProps> = ({ onHide, params }) => {
	const { data } = useCustomQuery<{ province: Province }>(GET_PROVINCE_BY_NAME_QUERY, ['getProvinceByName', { name: params?.name }])

	const { register, handleSubmit } = useForm<Province>({
		values: data?.province
	})
	const { resetField } = useFormContext<Property>();
	const { mutationUpdate } = useProvinceMutations<{ province: Province }>();

	return <Form onSubmit={handleSubmit(data => {
		if (params) {
			mutationUpdate({ name: params.name, item: data }, {
				onSuccess({ data: { province: { name } } }) {
					resetField('province.name', { defaultValue: 'undefined' })
					customSwalSuccess(
						"Provincia actualizado",
						`La provincia ${name} se ha actualizado correctamente`,
					);
				},
				onError(error, { name }) {
					customSwalError(
						error.response!.data.errors[0].message,
						`Ocurrio un error al intentar actualizar la provincia ${name}`,
					);
				},
				onSettled() {
					onHide()
				},
			})
		}
	})}>
		<Row>
			<Col>
				<Form.Label>Provincia</Form.Label>
				<Form.Control {...register('name')} placeholder="Provincia" />
			</Col>
			<Col>
				<Form.Label>Codigo</Form.Label>
				<Form.Control {...register('code')} placeholder="Codigo" />
			</Col>
		</Row>
		<div className='mt-3 d-flex gap-2 justify-content-end'>
			<Button variant='danger' onClick={onHide}>Cancelar</Button>
			<Button type='submit' variant='success' className='text-white'>Actualizar provincia</Button>
		</div>
	</Form>
};

export default ProvinceFormUpdate;

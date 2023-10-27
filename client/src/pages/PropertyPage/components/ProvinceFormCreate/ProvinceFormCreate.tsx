import { useForm } from 'react-hook-form';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { FormUpdateProps } from '../../models/types';
import { Province } from '../../../ProvincePage/models/types';
import { useProvinceMutations } from '../../hooks/useRepository';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';

type ProvinceInput = Pick<Province, 'name' | 'code'> & { cityName: string }

const ProvinceFormCreate: React.FC<FormUpdateProps> = ({ onHide, params }) => {
	const { register, handleSubmit } = useForm<Province>();
	const { mutationCreate } = useProvinceMutations<{ province: Province }, ProvinceInput>();

	return <Form onSubmit={handleSubmit(({ name, code }) => {
		if (params) {
			mutationCreate({
				input: {
					name,
					code,
					cityName: params.cityName
				}
			}, {
				onSuccess({ data: { province: { name } } }) {
					customSwalSuccess(
						"Nueva provincia agregada",
						`La provincia ${name} se ha creado correctamente`,
					);
				},
				onError(error, { input: { name } }) {
					customSwalError(
						error.response!.data.errors[0].message,
						`Ocurrio un error al intentar crear la provincia ${name}`,
					);
				},
				onSettled() {
					onHide();
				},
			})
		}
	})} >
		<Row>
			<Col>
				<Form.Label>Crear provincia</Form.Label>
				<Form.Control {...register('name')} placeholder="Provincia" />
			</Col>
			<Col>
				<Form.Label>Codigo</Form.Label>
				<Form.Control {...register('code')} placeholder={'Codigo'} />
			</Col>
		</Row>
		<div className='mt-3 d-flex gap-2 justify-content-end'>
			<Button variant='danger' onClick={onHide}>Cancelar</Button>
			<Button type='submit' variant='success' className='text-white'>Crear provincia</Button>
		</div>
	</Form>
};

export default ProvinceFormCreate;

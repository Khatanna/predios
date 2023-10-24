import { Row, Col, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { FormUpdateProps } from '../../models/types';
import { municipalityRepository } from '../../hooks/useRepository';
import { Municipality } from '../../../MunicipalityPage/models/types';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';

const { useMutations } = municipalityRepository

const GET_MUNICIPALITY_BY_NAME_QUERY = `
	query GetMunicipalityByName($name: String){ 
		municipality: getMunicipality(name: $name) {
			name 
		}
	}
`

const MunicipalityFormUpdate: React.FC<FormUpdateProps> = ({
	onHide, params
}) => {
	const { data } = useCustomQuery<{ municipality: Municipality }>(GET_MUNICIPALITY_BY_NAME_QUERY, ['getMunicipalityByName', { name: params?.name }])
	const { register, handleSubmit } = useForm<Municipality>({
		values: data?.municipality
	});
	const { mutationUpdate } = useMutations<{ municipality: Municipality }>();

	return <Form onSubmit={handleSubmit((data) => {
		if (params) {
			mutationUpdate({
				name: params.name,
				item: data
			}, {
				onSuccess({ data: { municipality: { name } } }) {
					customSwalSuccess(
						"Municipio actualizado",
						`La municipio ${name} se ha actualizado correctamente`,
					);
				},
				onError(error, { name }) {
					customSwalError(
						error.response!.data.errors[0].message,
						`Ocurrio un error al intentar actualizar el municipio ${name}`,
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
				<Form.Label>Municipio</Form.Label>
				<Form.Control {...register('name')} placeholder="Municipio" />
			</Col>
		</Row>
		<div className='mt-3 d-flex gap-2 justify-content-end'>
			<Button variant='danger' onClick={onHide}>Cancelar</Button>
			<Button type='submit' variant='success' className='text-white'>Crear municipio</Button>
		</div>
	</Form>
};

export default MunicipalityFormUpdate;

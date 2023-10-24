import { Row, Col, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FormUpdateProps } from '../../models/types';
import { Municipality } from '../../../MunicipalityPage/models/types';
import { municipalityRepository } from '../../hooks/useRepository';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';

type MunicipalityInput = {
	name: string
	provinceName: string
}

const { useMutations } = municipalityRepository

const MunicipalityFormCreate: React.FC<FormUpdateProps> = ({ onHide, params }) => {
	const { register, handleSubmit } = useForm<Municipality>();
	const { mutationCreate } = useMutations<{ municipality: Municipality }, MunicipalityInput>();

	return <Form onSubmit={handleSubmit(({ name }) => {
		if (params) {
			mutationCreate({
				name,
				provinceName: params.provinceName
			}, {
				onSuccess({ data: { municipality: { name } } }) {
					customSwalSuccess(
						"Nuevo municipio agregado",
						`La municipio ${name} se ha creado correctamente`,
					);
				},
				onError(error, { name }) {
					customSwalError(
						error.response!.data.errors[0].message,
						`Ocurrio un error al intentar crear el municipio ${name}`,
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

export default MunicipalityFormCreate;

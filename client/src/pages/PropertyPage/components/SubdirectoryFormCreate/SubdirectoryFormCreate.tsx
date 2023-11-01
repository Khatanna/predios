import { Row, Col, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FormCreateProps } from '../../models/types';
import { SubDirectory } from '../../../SubDirectoryPage/models/types';
import { useSubdirectoryMutations } from '../../hooks/useRepository';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';

const SubdirectoryFormCreate: React.FC<FormCreateProps> = ({ onHide }) => {
	const { register, handleSubmit } = useForm<SubDirectory>();
	const { mutationCreate } = useSubdirectoryMutations<{ folderLocation: SubDirectory }, Pick<SubDirectory, 'name'>>();
	return <Form onSubmit={handleSubmit(data => {
		mutationCreate({ input: data }, {
			onSuccess({ data: { folderLocation: { name } } }) {
				customSwalSuccess("Ubicación de carpeta creada correctamente", `La subcarpeta ${name} ha sido creada correctamente`);
			},
			onError(error, { input: { name } }) {
				customSwalError(
					error.response!.data.errors[0].message,
					`Ocurrio un error al intentar crear la ubicación de carpeta ${name}`)
			},
			onSettled() {
				onHide()
			},
		});
	})} >
		<Row>
			<Col>
				<Form.Label>Ubicación de carpeta</Form.Label>
				<Form.Control {...register('name')} placeholder='Ubicación de carpeta'></Form.Control>
			</Col>
		</Row>
		<Row className='mt-3'>
			<Col className='d-flex justify-content-end gap-2'>
				<Button variant='danger' onClick={onHide}>
					Cancelar
				</Button>
				<Button type='submit' variant='success' className='text-white'>
					Crear ubicación de carpeta
				</Button>
			</Col>
		</Row>
	</Form >
}
export default SubdirectoryFormCreate;

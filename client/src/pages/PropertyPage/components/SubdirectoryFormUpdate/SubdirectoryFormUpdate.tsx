import { useForm, useFormContext } from 'react-hook-form';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { FormUpdateProps, Property } from '../../models/types';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import { SubDirectory } from '../../../SubDirectoryPage/models/types';
import { useSubdirectoryMutations } from '../../hooks/useRepository';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';

const GET_SUBDIRECTORY_BY_NAME_QUERY = `
  query GetFolderLocationByName($name: String) {
    folderLocation: getFolderLocation(name: $name) {
      name
    }
  }
`

const SubdirectoryFormUpdate: React.FC<FormUpdateProps> = ({ onHide, params }) => {
	const { data, isLoading } = useCustomQuery<{ folderLocation: SubDirectory }>(GET_SUBDIRECTORY_BY_NAME_QUERY, ['getSubdirectoryByName', { name: params?.name }]);
	const { register, handleSubmit } = useForm<SubDirectory>({ values: data?.folderLocation });
	const { resetField } = useFormContext<Property>();
	const { mutationUpdate } = useSubdirectoryMutations<{ folderLocation: SubDirectory }>();

	if (isLoading) {
		return <div>Cargando...</div>
	}

	return <Form onSubmit={handleSubmit(data => {
		if (params) {
			mutationUpdate({ name: params.name, item: data }, {
				onSuccess({ data: { folderLocation: { name } } }) {
					customSwalSuccess("Ubicación de carpeta actualizada correctamente", `El nombre de la subcarpeta ${name} ha sido actualizada correctamente`);
				},
				onError(error, { name }) {
					customSwalError(error.response!.data.errors[0].message, `Ocurrio un error al intentar actualizar el nombre de la ubicación de carpeta ${name}`)
				},
				onSettled() {
					resetField('folderLocation.name', { defaultValue: 'undefined' })
					onHide()
				}
			})
		}
	})}>
		<Row>
			<Col>
				<Form.Label>Ubicación de carpeta</Form.Label>
				<Form.Control {...register('name')} placeholder='Ubicación de carpeta' />
			</Col>
		</Row>
		<Row className='mt-3'>
			<Col className='d-flex justify-content-end gap-2'>
				<Button variant='danger' onClick={onHide}>
					Cancelar
				</Button>
				<Button type='submit' variant='success' className='text-white'>
					Actualizar ubicación de carpeta
				</Button>
			</Col>
		</Row>
	</Form>
}
export default SubdirectoryFormUpdate;

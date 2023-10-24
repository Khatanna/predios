import { useForm, useFormContext } from 'react-hook-form';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { FormUpdateProps, Property } from '../../models/types';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import { SubDirectory } from '../../../SubDirectoryPage/models/types';
import { subdirectoryRepository } from '../../hooks/useRepository';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';

const GET_SUBDIRECTORY_BY_NAME_QUERY = `
  query GetSubdirectoryByName($name: String) {
    subdirectory: getSubdirectory(name: $name) {
      name
    }
  }
`

const { useMutations } = subdirectoryRepository;
const SubdirectoryFormUpdate: React.FC<FormUpdateProps> = ({ onHide, params }) => {
	const { data, isLoading } = useCustomQuery<{ subdirectory: SubDirectory }>(GET_SUBDIRECTORY_BY_NAME_QUERY, ['getSubdirectoryByName', { name: params?.name }]);
	const { register, handleSubmit } = useForm<SubDirectory>({ values: data?.subdirectory });
	const { resetField } = useFormContext<Property>();
	const { mutationUpdate } = useMutations<{ subdirectory: SubDirectory }>();

	if (isLoading) {
		return <div>Cargando...</div>
	}

	return <Form onSubmit={handleSubmit(data => {
		if (params) {
			mutationUpdate({ name: params.name, item: data }, {
				onSuccess({ data: { subdirectory: { name } } }) {
					customSwalSuccess("Subcarpeta actualizada correctamente", `El nombre de la subcarpeta ${name} ha sido actualizada correctamente`);
				},
				onError(error, { name }) {
					customSwalError(error.response!.data.errors[0].message, `Ocurrio un error al intentar actualizar el nombre de la subcarpeta ${name}`)
				},
				onSettled() {
					resetField('subDirectory.name', { defaultValue: 'undefined' })
					onHide()
				}
			})
		}
	})}>
		<Row>
			<Col>
				<Form.Label>Subcarpeta</Form.Label>
				<Form.Control {...register('name')} placeholder='Subcarpeta'></Form.Control>
			</Col>
		</Row>
		<Row className='mt-3'>
			<Col className='d-flex justify-content-end gap-2'>
				<Button variant='danger' onClick={onHide}>
					Cancelar
				</Button>
				<Button type='submit' variant='success' className='text-white'>
					Actualizar subcarpeta
				</Button>
			</Col>
		</Row>
	</Form>
}
export default SubdirectoryFormUpdate;

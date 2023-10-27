import { Controller, useFormContext } from 'react-hook-form';
import { Property } from '../../models/types';
import { useModalStore } from '../../state/useModalStore';
import { useSubdirectoryMutations, useSubdirectoryStore } from '../../hooks/useRepository';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';
import { EnhancedSelect } from '../EnhancedSelect';
import { SubDirectory } from '../../../SubDirectoryPage/models/types';

const GET_ALL_SUBDIRECTORIES_QUERY = `
	query GetAllSubdirectories {
		subdirectories: getAllSubDirectories {
			name
		}
	} 
`


const SubdirectorySelect: React.FC = () => {
	const { control, getValues, watch, resetField } = useFormContext<Property>();
	const setModal = useModalStore(s => s.setModal);
	const { setItems: setSubdirectories, items: subdirectories } =
		useSubdirectoryStore();
	const { mutationDelete: mutationSubdirectoryDelete } = useSubdirectoryMutations<{ subdirectory: SubDirectory }>();

	const subdirectory = watch('subDirectory.name')
	const { error } = useCustomQuery<{ subdirectories: SubDirectory[] }>(
		GET_ALL_SUBDIRECTORIES_QUERY,
		["getAllSubDirectories"],
		{
			onSuccess({
				subdirectories
			}) {
				setSubdirectories(subdirectories)
			},
		},
	);

	return <Controller
		name="subDirectory.name"
		control={control}
		defaultValue="undefined"
		render={(({ field }) => (
			<EnhancedSelect
				{...field}
				size="sm"
				placeholder={"Subcarpeta"}
				options={subdirectories.map(({ name }) => ({ label: name, value: name }))}
				onCreate={() => {
					setModal({ form: 'createSubdirectory', title: 'Crear Subcarpeta', show: true })
				}}
				onEdit={() => {
					setModal({ form: 'updateSubdirectory', title: 'Actualizar Subcarpeta', show: true, params: { name: subdirectory } })
				}}
				onDelete={() => {
					const subdirectory = getValues('subDirectory');
					if (subdirectory) {
						mutationSubdirectoryDelete(subdirectory, {
							onSuccess({ data: { subdirectory: { name } } }) {
								customSwalSuccess("Subcarpeta eliminada correctamente", `La subcarpeta con el nombre ${name} ha sido eliminada correctamente`);
							},
							onError(error, { name }) {
								customSwalError(error.response!.data.errors[0].message, `Ocurrio un error al intentar eliminar la subcarpeta ${name}`)
							},
							onSettled() {
								resetField('subDirectory.name', { defaultValue: 'undefined' })
							}
						});
					}
				}}
			/>
		))}
	/>;
};

export default SubdirectorySelect;

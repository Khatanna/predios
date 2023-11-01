import { Controller, useFormContext } from 'react-hook-form';
import { Property } from '../../models/types';
import { useModalStore } from '../../state/useModalStore';
import { useSubdirectoryMutations, useSubdirectoryStore } from '../../hooks/useRepository';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';
import { EnhancedSelect } from '../EnhancedSelect';
import { SubDirectory } from '../../../SubDirectoryPage/models/types';
import { SelectNameable } from '../../../HomePage/HomePage';

const GET_ALL_SUBDIRECTORIES_QUERY = `
	query GetAllSubdirectories {
		subdirectories: getAllFolderLocations {
			name
		}
	} 
`

const SubdirectorySelect: React.FC = () => {
	const { control, getValues, watch, resetField } = useFormContext<Property>();
	const setModal = useModalStore(s => s.setModal);
	const { setItems: setSubdirectories, items: subdirectories } =
		useSubdirectoryStore();
	const { mutationDelete: mutationSubdirectoryDelete } = useSubdirectoryMutations<{ folderLocation: SubDirectory }>();

	const subdirectory = watch('folderLocation.name')
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
		name="folderLocation.name"
		control={control}
		defaultValue="undefined"
		render={(({ field }) => (
			<SelectNameable
				{...field}
				size="sm"
				placeholder={"Ubicación de carpeta"}
				options={subdirectories.map(({ name }) => ({ label: name, value: name }))}
				onCreate={() => {
					setModal({ form: 'createSubdirectory', title: 'Crear ubicación de carpeta', show: true })
				}}
				onEdit={() => {
					setModal({ form: 'updateSubdirectory', title: 'Actualizar ubicación de carpeta', show: true, params: { name: subdirectory } })
				}}
				onDelete={() => {
					const subdirectory = getValues('folderLocation');
					if (subdirectory) {
						mutationSubdirectoryDelete(subdirectory, {
							onSuccess({ data: { folderLocation: { name } } }) {
								customSwalSuccess("Ubicación de carpeta eliminada correctamente", `La ubicación de carpeta con el nombre ${name} ha sido eliminada correctamente`);
							},
							onError(error, { name }) {
								customSwalError(error.response!.data.errors[0].message, `Ocurrio un error al intentar eliminar la ubicación de carpeta ${name}`)
							},
							onSettled() {
								resetField('folderLocation.name', { defaultValue: 'undefined' })
							}
						});
					}
				}}
			/>
		))}
	/>;
};

export default SubdirectorySelect;

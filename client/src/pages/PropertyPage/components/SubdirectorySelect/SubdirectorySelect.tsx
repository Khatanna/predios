import React, { useMemo } from 'react';
import { DynamicSelect } from '../DynamicSelect';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import { SubDirectory } from '../../../SubDirectoryPage/models/types';
import { useSubdirectoryStore } from '../../state/useSubdirectoryStore';
import { UseFormReturn } from 'react-hook-form';
import { Property } from '../../models/types';
import { useSubdirectoryMutation } from '../../hooks/useMutationSubdirectory';
const GET_ALL_SUBDIRECTORIES_QUERY = `
	query GetAllSubDirectories {
		subdirectories: getAllSubDirectories {
			name
		}
	}	
`

const SubdirectorySelect: React.FC<Pick<UseFormReturn<Property>, 'control'>> = ({ control }) => {
	const { setSubdirectories, subdirectories } = useSubdirectoryStore()
	useCustomQuery<{ subdirectories: Pick<SubDirectory, 'name'>[] }>(GET_ALL_SUBDIRECTORIES_QUERY, ['getAllSubdirectories'], {
		onSuccess({ subdirectories }) {
			setSubdirectories(subdirectories)
		},
	})
	const { createSubdirectoryMutation, deleteSubdirectoryMutation, updateSubdirectoryMutation } = useSubdirectoryMutation();

	const options = useMemo(() => subdirectories.map(subdirectory => ({ label: subdirectory.name, value: subdirectory.name })), [subdirectories])

	return <DynamicSelect
		name='subDirectory.name'
		placeholder='Subcarpeta'
		title='Ingrese el nombre la subcarpeta'
		control={control}
		options={options}
		onSelect={() => {
		}}
		onAction={({ value }) => {
			createSubdirectoryMutation({ name: value })
		}}
		onConfirm={({ currentValue, newValue }) => {
			updateSubdirectoryMutation({ currentName: currentValue, newName: newValue })
		}}
		onDelete={({ value }) => {
			deleteSubdirectoryMutation({ name: value })
		}}
	/>
};

export default SubdirectorySelect;

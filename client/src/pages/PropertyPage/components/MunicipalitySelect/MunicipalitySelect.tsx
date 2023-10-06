import React, { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import { customSwalError } from '../../../../utilities/alerts';
import { Municipality } from '../../../MunicipalityPage/models/types';
import { useMutationMunicipality } from '../../hooks/useMutationMunicipality';
import { Property } from '../../models/types';
import { useLocationStore } from '../../state/useLocationStore';
import { DynamicSelect } from '../DynamicSelect';

const GET_MUNICIPALITIES_BY_PROVINCE_NAME = `
	query GetMunicipalitiesByProvinceName($province: String) {
		municipalities: getMunicipalities(province: $province) {
			name
		}
	}
`

const MunicipalitySelect: React.FC<Pick<UseFormReturn<Property>, 'control' | 'resetField'>> = ({ control }) => {
	const { province, setMunicipalities, municipalities, setMunicipality } = useLocationStore();

	useCustomQuery<{ municipalities: Pick<Municipality, 'name'>[] }>(GET_MUNICIPALITIES_BY_PROVINCE_NAME, ['getMunicipalitiesByProvinceName', { province: province?.name }], {
		onSuccess({ municipalities }) {
			setMunicipalities(municipalities);
		},
	});
	const { createMunicipalityMutation, deleteMunicipalityMutation, updateMunicipalityMutation } = useMutationMunicipality();

	const options = useMemo(() => municipalities.map(municipality => ({ label: municipality.name, value: municipality.name })), [municipalities])

	return <DynamicSelect
		name="municipality.name"
		title="Ingrese el nombre del municipio"
		placeholder="Municipio"
		control={control}
		disabled={!province}
		options={options}
		onSelect={({ value }) => {
			const municipality = municipalities.find(municipality => municipality.name === value);

			if (municipality) {
				setMunicipality(municipality)
			} else {
				customSwalError("Este municipio no existe", "Error de lectura")
			}
		}}
		onConfirm={({ currentValue, newValue }) => {
			updateMunicipalityMutation({ currentName: currentValue, newName: newValue })
		}}
		onAction={({ value }) => {
			if (province) {
				createMunicipalityMutation({ name: value, provinceName: province.name })
			}
		}}
		onDelete={({ value }) => {
			deleteMunicipalityMutation({ name: value })
		}}
	/>
};

export default MunicipalitySelect;

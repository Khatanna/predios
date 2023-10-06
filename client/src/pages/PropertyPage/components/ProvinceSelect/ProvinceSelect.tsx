import React, { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import { customSwalError } from '../../../../utilities/alerts';
import { Province } from '../../../ProvincePage/models/types';
import { useMutationProvince } from '../../hooks/useMutationProvince';
import { Property } from '../../models/types';
import { useLocationStore } from '../../state/useLocationStore';
import { DynamicSelect } from '../DynamicSelect';

const GET_ALL_PROVINCES_BY_CITY_NAME = `
  query GetProvincesByCityName ($city: String) {
    provinces: getProvinces(city: $city) {
      name
    }
  }
`

const ProvinceSelect: React.FC<Pick<UseFormReturn<Property>, 'control' | 'resetField'>> = ({ control, resetField }) => {
	const { city, provinces, setProvince, setProvinces } = useLocationStore();
	const { createProvinceMutation, deleteProvinceMutation, updateProvinceMutation } = useMutationProvince();
	useCustomQuery<{ provinces: Province[] }>(GET_ALL_PROVINCES_BY_CITY_NAME, ['getAllProvincesByCityName', { city: city?.name }], {
		onSuccess({ provinces }) {
			setProvinces(provinces);
		},
	})

	const options = useMemo(() => provinces.map(province => ({ label: province.name, value: province.name })), [provinces]);

	return <DynamicSelect
		name="province.name"
		title="Ingrese el nombre de provincia"
		placeholder="Provincia"
		control={control}
		options={options}
		disabled={!city}
		onConfirm={({ currentValue, newValue }) => {
			updateProvinceMutation({
				currentName: currentValue,
				newName: newValue,
			});
		}}
		onSelect={({ value }) => {
			const province = provinces.find(
				(province) => province.name === value,
			);

			if (province) {
				setProvince(province);
				resetField('municipality.name')
			} else {
				customSwalError("Esta provincia no existe en el sistema", "Error en la lista de provincias");
			}
		}}
		onAction={({ value }) => {
			if (city) {
				createProvinceMutation({ name: value, code: '8001', cityName: city.name }, {
					onError() {
						resetField('province.name')
					},
				})
			}
		}}
		onDelete={({ value }) => {
			deleteProvinceMutation({ name: value })
		}}
	/>
};

export default ProvinceSelect;

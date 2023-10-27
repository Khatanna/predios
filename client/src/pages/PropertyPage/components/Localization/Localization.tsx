import { Col, Form } from 'react-bootstrap';
import { useFormContext, Controller } from 'react-hook-form'
import { useCityMutations, useMunicipalityMutations, useProvinceMutations, useMunicipalityStore, useCityStore, useProvinceStore } from '../../hooks/useRepository';
import { Property } from '../../models/types';
import { City } from '../../../CityPage/models/types';
import { Province } from '../../../ProvincePage/models/types';
import { Municipality } from '../../../MunicipalityPage/models/types';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import { CustomLabel } from '../CustomLabel';
import { EnhancedSelect } from '../EnhancedSelect';
import { GeoAlt, GlobeAmericas, Map } from 'react-bootstrap-icons';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';
import { useModalStore } from '../../state/useModalStore';

const GET_ALL_CITIES_QUERY = `
	query GetAllCities {
		cities: getAllCities {
      name
    }
	}
`

const GET_ALL_PROVINCES_BY_CITY_NAME = `
  query GetProvincesByCityName ($city: String) {
    provinces: getProvinces(city: $city) {
      name
    }
  }
`;

const GET_MUNICIPALITIES_BY_PROVINCE_NAME = `
	query GetMunicipalitiesByProvinceName($province: String) {
		municipalities: getMunicipalities(province: $province) {
			name
		}
	}
`;

const Localization: React.FC = () => {
	const { control, resetField, getValues, watch } = useFormContext<Property>();
	const { mutationDelete: mutationCityDelete } = useCityMutations<{ city: City }>();
	const { mutationDelete: mutationProvinceDelete } = useProvinceMutations<{ province: Province }>();
	const { mutationDelete: mutationMunicipalityDelete } = useMunicipalityMutations<{ municipality: Municipality }>();
	const { setItems: setCities, items: cities } = useCityStore();
	const { setItems: setProvinces, items: provinces } = useProvinceStore();
	const { setItems: setMunicipalities, items: municipalities } = useMunicipalityStore();
	const [city, province, municipality] = watch(['city.name', 'province.name', 'municipality.name'])

	useCustomQuery<{ cities: Pick<City, "name">[] }>(
		GET_ALL_CITIES_QUERY,
		["getAllCities"],
		{
			onSuccess({ cities }) {
				setCities(cities);
			},
		},
	);
	useCustomQuery<{ provinces: Pick<Province, "name">[] }>(
		GET_ALL_PROVINCES_BY_CITY_NAME,
		["getAllProvincesByCityName", { city }],
		{
			onSuccess({ provinces }) {
				console.log(provinces)
				setProvinces(provinces);
			},
			enabled: !!city && city !== 'undefined'
		}
	);

	useCustomQuery<{ municipalities: Pick<Municipality, "name">[] }>(
		GET_MUNICIPALITIES_BY_PROVINCE_NAME,
		["getMunicipalitiesByProvinceName", { province }],
		{
			onSuccess({ municipalities }) {
				setMunicipalities(municipalities);
			},
			enabled: !!province && province !== 'undefined'
		},
	);
	const { setModal } = useModalStore();

	return <>
		<Col>
			<Form.Group>
				<CustomLabel
					label="Departamento"
					icon={<GlobeAmericas color="orange" />}
				/>
				<Controller
					name="city.name"
					control={control}
					defaultValue="undefined"
					render={(({ field }) => (
						<EnhancedSelect
							{...field}
							onChange={(e) => {
								field.onChange(e);
								resetField('province.name', { defaultValue: 'undefined' });
								resetField('municipality.name', { defaultValue: 'undefined' });
							}}
							disabled={cities.length === 0}
							size="sm"
							placeholder={"Departamento"}
							options={cities.map(({ name }) => ({ label: name, value: name }))}
							onCreate={() => {
								setModal({ form: 'createCity', title: 'Crear departamento', show: true })
							}}
							onEdit={() => {
								setModal({ form: 'updateCity', title: 'Actualizar departamento', show: true, params: { name: city } })
							}}
							onDelete={() => {
								const city = getValues("city");
								if (city) {
									mutationCityDelete(city, {
										onSuccess({ data: { city: { name } } }) {
											customSwalSuccess(
												"Departamento eliminado",
												`El departamento ${name} se ha eliminado correctamente`,
											);
										},
										onError(error, { name }) {
											customSwalError(
												error.response!.data.errors[0].message,
												`Ocurrio un error al intentar eliminar el departamento ${name}`,
											);
										},
										onSettled() {
											resetField('city.name', { defaultValue: 'undefined' })
										}
									});
								}
							}}
						/>
					))}
				/>
			</Form.Group>
		</Col>
		<Col>
			<Form.Group>
				<CustomLabel
					label="Provincia"
					icon={<Map color="blue" />}
				/>
				<Controller
					name="province.name"
					control={control}
					defaultValue="undefined"
					render={(({ field }) => (
						<EnhancedSelect
							{...field}
							onChange={(e) => {
								field.onChange(e);
								resetField('municipality.name', { defaultValue: 'undefined' });
							}}
							disabled={city === "undefined"}
							size="sm"
							placeholder={"Provincia"}
							options={provinces.map(({ name }) => ({ label: name, value: name }))}
							onCreate={() => {
								setModal({ form: 'createProvince', title: 'Crear provincia', show: true, params: { cityName: city } })
							}}
							onEdit={() => {
								setModal({ form: 'updateProvince', title: 'Actualizar provincia', show: true, params: { name: province } })
							}}
							onDelete={() => {
								const province = getValues("province");
								if (province) {
									mutationProvinceDelete(province, {
										onSuccess({ data: { province: { name } } }) {
											customSwalSuccess(
												"Provincia eliminada",
												`La provincia ${name} se ha eliminado correctamente`,
											);
										},
										onError(error, { name }) {
											customSwalError(
												error.response!.data.errors[0].message,
												`Ocurrio un error al intentar eliminar la provincia ${name}`,
											);
										},
										onSettled() {
											resetField('province.name', { defaultValue: 'undefined' })
										}
									});
								}
							}}
						/>
					))}
				/>
			</Form.Group>
		</Col>
		<Col>
			<Form.Group>
				<CustomLabel
					label="Municipio"
					icon={<GeoAlt color="purple" />}
				/>
				<Controller
					name="municipality.name"
					control={control}
					defaultValue="undefined"
					render={(({ field }) => (
						<EnhancedSelect
							{...field}
							disabled={province === "undefined"}
							size="sm"
							placeholder="Municipio"
							options={municipalities.map(({ name }) => ({ label: name, value: name }))}
							onCreate={() => {
								setModal({ form: 'createMunicipality', show: true, title: 'Crear municipio', params: { provinceName: province } })
							}}
							onEdit={() => {
								setModal({ form: 'updateMunicipality', show: true, title: 'Actualizar municipio', params: { name: municipality } })
							}}
							onDelete={() => {
								const municipality = getValues("municipality");
								if (municipality) {
									mutationMunicipalityDelete(municipality, {
										onSuccess({ data: { municipality: { name } } }) {
											customSwalSuccess(
												"Municipío eliminado",
												`El municipio ${name} se ha eliminado correctamente`,
											);
										},
										onError(error, { name }) {
											customSwalError(
												error.response!.data.errors[0].message,
												`Ocurrio un error al intentar eliminar el municipio ${name}`,
											);
										},
										onSettled() {
											resetField('municipality.name', { defaultValue: 'undefined' })
										}
									});
								}
							}}
						/>
					))}
				/>
			</Form.Group>
		</Col>
	</>
};

export default Localization;

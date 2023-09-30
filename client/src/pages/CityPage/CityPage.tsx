import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { City } from './models/types';
import { Table } from '../../components/Table';
import { useCustomQuery } from '../../hooks/useCustomQuery';
import { Province } from '../ProvincePage/models/types';
import { Col, Row } from 'react-bootstrap';
import { Municipality } from '../MunicipalityPage/models/types';

export type CityPageProps = {
}

const columns: TableColumn<City>[] = [
	{
		name: 'Nro',
		selector: (_row, index) => (index || 0) + 1,
		width: '80px'
	},
	{
		name: 'Departamento',
		selector: (row) => row.name
	}
]

const columnsProvince: TableColumn<Province>[] = [
	{
		name: 'Nro',
		selector: (_row, index) => (index || 0) + 1,
		width: '80px'
	},
	{
		name: 'Provincia',
		selector: (row) => row.name
	},
	{
		name: 'Codigo',
		selector: (row) => row.code
	}
]
const columnsMunicipality: TableColumn<Municipality>[] = [
	{
		name: 'Nro',
		selector: (_row, index) => (index || 0) + 1,
		width: '80px'
	},
	{
		name: 'Municipio',
		selector: (row) => row.name
	}
]

const GET_ALL_CITIES_QUERY = `
	query GetAllLocations {
		cities: getAllCities {
			name
		}
		provinces: getAllProvinces {
			name
			code
		}
		municipalities: getAllMunicipalities {
			name
		}
	}
`

const CityPage: React.FC<CityPageProps> = ({ }) => {
	const { data, isLoading, error } = useCustomQuery<{ cities: City[], provinces: Province[], municipalities: Municipality[] }>(GET_ALL_CITIES_QUERY, ['getAllCitiesQuery'])

	if (error) {
		return <>{error}</>
	}

	return <Row >
		<Col>
			<Table name='departamentos' columns={columns} data={data?.cities ?? []} />
		</Col>
		<Col>
			<Table name='provincias' columns={columnsProvince} data={data?.provinces ?? []} />
		</Col>
		<Col>
			<Table name='municipios' columns={columnsMunicipality} data={data?.municipalities ?? []} />
		</Col>
	</Row>
};

export default CityPage;

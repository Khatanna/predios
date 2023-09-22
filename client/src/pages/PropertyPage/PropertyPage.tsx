import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { Property } from './models/types';
import { Table } from '../../components/Table';
import { useCustomQuery } from '../../hooks/useCustomQuery';

export type PropertyPageProps = {
}

const columns: TableColumn<Property>[] = [
	{
		name: 'Nro',
		selector: (_row, index) => (index || 0) + 1,
		width: '80px'
	},
	{
		name: 'Nombre del predio',
		selector: (row) => row.name,
	},
	{
		name: 'Codigo',
		selector: (row) => row.code ?? 'Sin codigo'
	},
	{
		name: 'Codigo de busqueda',
		selector: (row) => row.codeOfSearch ?? 'Sin codigo de busqueda',
	},
	{
		name: 'Departamento',
		selector: (row) => row.city?.name ?? 'Sin definir'
	},
	{
		name: 'Provincia',
		selector: (row) => row.province?.name ?? 'Sin definir'
	},
	{
		name: 'Municipio',
		selector: (row) => row.municipality?.name ?? 'Sin definir'
	},
]

const GET_ALL_PROPERTIES_QUERY = `
	query {
		properties: getAllProperties {
			name
			code
			codeOfSearch
			city {
				name
			}
			province {
				name
			}
			municipality {
				name
			}
		}
	}
`

const PropertyPage: React.FC<PropertyPageProps> = ({ }) => {
	const { data, isLoading, error } = useCustomQuery<{ properties: Property[] }>(GET_ALL_PROPERTIES_QUERY, ['getAllProperties'])

	if (error) {
		return <div>{error}</div>
	}

	return <Table
		name='predios'
		columns={columns}
		data={data?.properties ?? []}
		progressPending={isLoading}
		dense
	/>;
};

export default PropertyPage;

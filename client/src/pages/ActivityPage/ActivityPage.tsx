import React from 'react';
import { useCustomQuery } from '../../hooks/useCustomQuery';
import { Activity } from './models/types';
import { Table } from '../../components/Table';
import { TableColumn } from 'react-data-table-component';

export type ActivityPageProps = {
}

const GET_ALL_ACTIVITIES_QUERY = `
	query GetAllActivities { 
		activities: getAllActivities {
			id
			name
			createdAt
		}
	}
`

const columns: TableColumn<Activity>[] = [
	{
		name: 'Nro',
		selector: (_row, index) => (index || 0) + 1,
		sortFunction: (a, b) => +a.createdAt - +b.createdAt
	},
	{
		name: 'Nombre',
		selector: (row) => row.name
	},
	{
		name: 'Fecha de creación',
		selector: (row) => new Date(+row.createdAt).toLocaleString()
	}
]

const ActivityPage: React.FC<ActivityPageProps> = ({ }) => {
	const { data, isLoading, error } = useCustomQuery<{ activities: Activity[] }>(GET_ALL_ACTIVITIES_QUERY, ['getAllActivities'])

	if (error) {
		return <div>{error}</div>
	}

	return <Table
		name='actividades'
		columns={columns}
		progressPending={isLoading}
		data={data?.activities ?? []}
	/>;
};

export default ActivityPage;

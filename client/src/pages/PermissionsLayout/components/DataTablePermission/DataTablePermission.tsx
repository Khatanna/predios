import React from 'react';
import { Alert } from 'react-bootstrap';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import type { Permission } from '../../types';
import { DropdownMenu } from './DropdownMenu';
import { useNavigate } from 'react-router';
import { levels, resources } from '../../../../utilities/constants';

const columns: TableColumn<Permission>[] = [
	{
		name: "Nro",
		selector: (_row, index) => (index || 0) + 1,
		width: "100px",
		sortable: true,
		sortFunction: (a, b) => Number(a.createdAt) - Number(b.createdAt),
	},
	{
		name: 'Nombre',
		selector: (row) => row.name,
	},
	{
		name: 'Descripción',
		selector: (row) => row.description,
		wrap: true,
	},
	{
		name: 'Recurso',
		selector: (row) => resources[row.resource],
	},
	{
		name: 'Nivel de acceso',
		selector: (row) => levels[row.level],
	},
	{
		cell: (row) => <DropdownMenu permission={row} />,
		button: true,
	},
];


const DataTablePermission: React.FC<{ permissions: Permission[] }> = ({ permissions }) => {
	const navigate = useNavigate();


	return <DataTable columns={columns} data={permissions} responsive striped className='overflow-visible' pointerOnHover onRowDoubleClicked={(row) => navigate('../edit', { state: row })} noDataComponent="No existen registros" />;
};

export default DataTablePermission;

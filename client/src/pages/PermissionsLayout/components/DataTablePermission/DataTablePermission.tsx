import React from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useNavigate } from 'react-router';
import { levels, resources } from '../../../../utilities/constants';
import { Permission } from '../../types.d';
import { DropdownMenu } from '../DropdownMenu';
import { User } from '../../../User/models/types';
import { DropdownMenuOfPermission } from '../../../User/components/DropdownMenuOfPermission';
import { StateCell } from '../../../../components/StateCell';
import { Chip } from '../../../../components/Chip';

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
		wrap: true,
		sortable: true,
		reorder: true
	},
	{
		name: 'Descripción',
		selector: (row) => row.description,
		wrap: true,
		sortable: true,
		reorder: true,
		grow: 2
	},
	{
		name: 'Recurso',
		cell: (row) => <Chip text={resources[row.resource]} background={row.resource} />,
		sortable: true,
		reorder: true,
		sortFunction: (a, b) => a.resource.localeCompare(b.resource),
	},
	{
		name: 'Nivel de acceso',
		cell: (row) => <Chip text={levels[row.level]} background={row.level} outline={true} />,
		sortable: true,
		reorder: true,
		sortFunction: (a, b) => a.level.localeCompare(b.level)
	},
	{
		name: 'Estado',
		cell: ({ status }) => <StateCell status={status} />,
		sortable: true,
		reorder: true
	},
	{
		id: 'dropdown',
		cell: (row) => <DropdownMenu permission={row} />,
		button: true,
	},
];

const DataTablePermission: React.FC<{ permissions: Permission[], user?: User }> = ({ permissions, user }) => {
	const navigate = useNavigate();

	return <DataTable
		columns={user ? columns.map(c => {
			if (c.id === 'dropdown') {
				c.cell = () => {
					return <DropdownMenuOfPermission />
				}
			}
			return c;
		}) : columns}
		data={permissions}
		responsive
		striped
		highlightOnHover
		pagination
		className='overflow-visible'
		pointerOnHover={Boolean(!user)}
		onRowDoubleClicked={user ? () => { } : (row) => navigate('/admin/permissions/edit', { state: row })}
		noDataComponent="No existen permisos"
		title={user ? `Permisos del usuario: ${user.names.concat(" ", user.firstLastName, " ", user.secondLastName)}` : 'Lista de permisos'}
	/>;
};

export default DataTablePermission;

import React from 'react';
import { DataTablePermission } from './components/DataTablePermission';
import { Alert } from 'react-bootstrap';
import { Permission } from './types';
import { useCustomQuery } from '../../hooks/useCustomQuery';
import { useAuthStore } from '../../state/useAuthStore';
import { DropdownMenu } from './components/DropdownMenu';
import { StateCell } from '../../components/StateCell';
import { Chip } from '../../components/Chip';
import { TableColumn } from 'react-data-table-component';
import { levels, resources } from '../../utilities/constants';
import { Table } from '../../components/Table';
import { useNavigate } from 'react-router';

const columns: TableColumn<Permission>[] = [
	{
		name: "Nro",
		selector: (_row, index) => (index || 0) + 1,

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
		cell: (row) => <Chip text={resources[row.resource as keyof typeof resources]} background={row.resource} />,
		sortable: true,
		reorder: true,
		sortFunction: (a, b) => a.resource.localeCompare(b.resource),
	},
	{
		name: 'Nivel de acceso',
		cell: (row) => <Chip text={levels[row.level as keyof typeof levels]} background={row.level} outline={true} />,
		sortable: true,
		reorder: true,
		sortFunction: (a, b) => a.level.localeCompare(b.level)
	},
	{
		name: 'Estado',
		cell: ({ status }) => <StateCell status={status} />,
		sortable: true,
		reorder: true,
		sortFunction: (a, b) => a.status.localeCompare(b.status)
	},
	{

		cell: (row) => <DropdownMenu permission={row} />,
		button: true,
	},
];

const GET_ALL_PERMISSIONS_QUERY = `{
	permissions: getAllPermissions {
		name
		description
		resource
		level
		status
		createdAt
	}
}`

const PermissionsLayout: React.FC = () => {
	const navigate = useNavigate();
	const { data, error, isLoading } = useCustomQuery<{ permissions: Permission[] }>(GET_ALL_PERMISSIONS_QUERY, ['getAllPermissions'])

	if (error) {
		return <div className="my-2">
			<Alert variant="danger">
				{error}
			</Alert>
		</div>
	}

	return <Table
		name='permisos'
		columns={columns}
		data={data?.permissions ?? []}
		onRowDoubleClicked={(row) => navigate('/admin/permissions/edit', { state: row })}
		progressPending={isLoading}
	/>
};

export default PermissionsLayout;

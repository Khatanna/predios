import React from 'react';
import { DataTablePermission } from './components/DataTablePermission';
import { Alert } from 'react-bootstrap';
import { Permission } from './types';
import { useCustomQuery } from '../../hooks/useCustomQuery';
import { useAuthStore } from '../../state/useAuthStore';

const GET_ALL_PERMISSIONS_QUERY = `{
	permissions: getAllPermissions {
		name
		description
		resource
		level
		status
	}
}`

const PermissionsLayout: React.FC = () => {
	const { data, error } = useCustomQuery<{ permissions: Permission[] }>(GET_ALL_PERMISSIONS_QUERY, ['getAllPermissions'])
	const { user } = useAuthStore();

	if (!user?.permissions['PERMISSION@READ']) {
		return <div className="my-2">
			<Alert variant="danger">
				<Alert.Heading>No tiene los permisos suficientes</Alert.Heading>
				No tiene permisos para ver la lista de permisos
			</Alert>
		</div>
	}

	if (error) {
		return <div className="my-2">
			<Alert variant="danger">
				{error}
			</Alert>
		</div>
	}
	return <DataTablePermission permissions={data?.permissions ?? []} />;
};

export default PermissionsLayout;

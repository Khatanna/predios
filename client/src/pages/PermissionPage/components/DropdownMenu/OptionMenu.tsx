import React from 'react';
import { Permission } from '../../models/types';
import { useCustomMutation } from '../../../../hooks';
import { useQueryClient } from '@tanstack/react-query';
import { DropdownMenu } from '../../../../components/DropdownMenu';
import { Link } from 'react-router-dom';
import { Dropdown, Spinner } from 'react-bootstrap';
export type OptionMenuProps = {
	permission: Permission
}

const DISABLE_PERMISSION_MUTATION = `
	mutation DisablePermissionForAllUsers ($input: UpdateStatePermissionInput) {
		result: updateStatePermission(input: $input) {
			updated
		}
	}
`
const OptionMenu: React.FC<OptionMenuProps> = ({ permission }) => {
	const queryClient = useQueryClient();
	const [handleStatusOfPermission, { isLoading }] = useCustomMutation<{ result: { updated: boolean } }, { input: { resource: string, level: string, status: string } }>(DISABLE_PERMISSION_MUTATION, {
		onSuccess({ result }) {
			if (result.updated) {
				queryClient.invalidateQueries(['getAllPermissions'])
			}
		}
	})

	const handleStatus = () => {
		handleStatusOfPermission({
			input: {
				resource: permission.resource,
				level: permission.level,
				status: permission.status === "ENABLE" ? "DISABLE" : "ENABLE"
			}
		})
	}

	if (isLoading) {
		return <Spinner size="sm" variant="warning" />
	}

	return <DropdownMenu align={'end'} >
		<Dropdown.Item as={Link} to={`/admin/permissions/edit`} state={permission}>
			✏ Editar
		</Dropdown.Item>
		<Dropdown.Item>
			🗑 Eliminar
		</Dropdown.Item>
		<Dropdown.Item onClick={handleStatus}>
			{permission.status === "ENABLE" ? "⛔ Deshabilitar" : "✔ Habilitar"}
		</Dropdown.Item>
	</DropdownMenu>
};

export default OptionMenu;

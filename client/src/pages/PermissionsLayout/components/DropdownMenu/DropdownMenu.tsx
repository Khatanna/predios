import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { Permission } from '../../types';
import { useCustomMutation } from '../../../../hooks';
import { useQueryClient } from '@tanstack/react-query';

export type DropdownMenuProps = {
	permission: Permission
}

const DISABLE_PERMISSION_MUTATION = `
	mutation DisablePermissionForAllUsers ($input: UpdateStatePermissionInput) {
		result: updateStatePermission(input: $input) {
			updated
		}
	}
`
const DropdownMenu: React.FC<DropdownMenuProps> = ({ permission }) => {
	const queryClient = useQueryClient();
	const [disablePermission] = useCustomMutation<{ result: { updated: boolean } }, { input: { resource: string, level: string, status: string } }>(DISABLE_PERMISSION_MUTATION, {
		onSuccess({ result }) {
			if (result.updated) {
				queryClient.invalidateQueries(['getAllPermissions'])
			}
		}
	})
	const handleStatus = () => {
		disablePermission({
			input: {
				resource: permission.resource,
				level: permission.level,
				status: permission.status === "ENABLE" ? "DISABLE" : "ENABLE"
			}
		})
	}

	return <Dropdown align={"end"}>
		<Dropdown.Toggle as={ThreeDotsVertical} variant="link" role="button" />

		<Dropdown.Menu>
			<Dropdown.Item to={`/admin/permissions/edit`} state={permission} as={Link}>
				✏ Editar
			</Dropdown.Item>
			<Dropdown.Item >
				🗑 Eliminar
			</Dropdown.Item>
			<Dropdown.Item onClick={handleStatus}>
				{permission.status === "ENABLE" ? "⛔ Deshabilitar" : "✔ Habilitar"}
			</Dropdown.Item>
		</Dropdown.Menu>
	</Dropdown>
};

export default DropdownMenu;

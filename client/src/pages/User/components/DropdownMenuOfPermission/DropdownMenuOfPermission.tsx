import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';

export type DropdownMenuOfPermissionProps = {
}

const DropdownMenuOfPermission: React.FC<DropdownMenuOfPermissionProps> = ({ }) => {
	return <Dropdown align={"end"}>
		<Dropdown.Toggle as={ThreeDotsVertical} variant="link" role="button" />

		<Dropdown.Menu>
			<Dropdown.Item>
				⛔ Deshabilitar permiso
			</Dropdown.Item>
			<Dropdown.Item>
				🗑 Eliminar permiso
			</Dropdown.Item>
		</Dropdown.Menu>
	</Dropdown>
};

export default DropdownMenuOfPermission;

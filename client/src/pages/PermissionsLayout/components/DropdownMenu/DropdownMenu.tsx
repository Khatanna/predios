import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { Permission } from '../../types';

export type DropdownMenuProps = {
	permission: Permission
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ permission }) => {
	return <Dropdown align={"end"}>
		<Dropdown.Toggle as={ThreeDotsVertical} variant="link" role="button" />

		<Dropdown.Menu>
			<Dropdown.Item to={`/admin/permissions/edit`} state={permission} as={Link}>
				✏ Editar
			</Dropdown.Item>
			<Dropdown.Item >
				🗑 Eliminar
			</Dropdown.Item>
		</Dropdown.Menu>
	</Dropdown>
};

export default DropdownMenu;

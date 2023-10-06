import React from 'react';
import { Dropdown, DropdownProps } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import { Icon } from '../Icon';

const DropdownMenu: React.FC<DropdownProps> = ({ children, ...props }) => {
	return <Dropdown {...props}>
		<Icon label='Menú de opciones'>
			<Dropdown.Toggle as={ThreeDotsVertical} variant="link" role="button" color='#186a3a' />
		</Icon>
		<Dropdown.Menu>
			{children}
		</Dropdown.Menu>
	</Dropdown>;
};

export default DropdownMenu;

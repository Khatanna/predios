import React from 'react';
import { Dropdown, DropdownProps } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';

const DropdownMenu: React.FC<DropdownProps> = ({ children, ...props }) => {
	return <Dropdown {...props}>
		<Dropdown.Toggle as={ThreeDotsVertical} variant="link" role="button" />
		<Dropdown.Menu>
			{children}
		</Dropdown.Menu>
	</Dropdown>;
};

export default DropdownMenu;

import React from 'react';
import { DropdownButton } from 'react-bootstrap';

export type DropDownFormProps = {
	children: React.ReactNode
}

const DropDownForm: React.FC<DropDownFormProps> = ({ children }) => {
	return <DropdownButton variant='outline-secondary' title="default title">
		{children}
	</DropdownButton>;
};

export default DropDownForm;

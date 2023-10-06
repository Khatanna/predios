import React from 'react';
import { Form } from 'react-bootstrap';

export type CustomLabelProps = {
	label: string
	icon: React.ReactNode
}

const CustomLabel: React.FC<CustomLabelProps> = ({ label, icon }) => {
	return <Form.Label>
		<div className="d-flex gap-2 align-items-center ">
			{icon}
			<div>
				{label}
			</div>
		</div>
	</Form.Label>;
};

export default CustomLabel;

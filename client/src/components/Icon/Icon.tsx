import React from 'react';
import { OverlayTrigger, OverlayTriggerProps, Tooltip } from 'react-bootstrap';

export type IconProps = {
	label: string
} & Pick<OverlayTriggerProps, 'placement' | 'children'>

const Icon: React.FC<IconProps> = ({ placement, label, children }) => {
	return <OverlayTrigger key={crypto.randomUUID()} placement={placement} overlay={
		<Tooltip id={crypto.randomUUID()}>
			{label}
		</Tooltip>
	}>
		{children}
	</OverlayTrigger>;
};

export default Icon;

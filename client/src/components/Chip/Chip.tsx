import React from 'react';

export type ChipProps = {
	background: string
	text: string,
	outline?: boolean
}

const Chip: React.FC<ChipProps> = ({ background, text, outline = false }) => {
	return <div className={`shadow-lg px-3 py-1 chip-${outline ? 'outline-' : ''}${background} rounded-pill text-${outline ? 'black' : 'white'}`}>{text}</div>
};

export default Chip;

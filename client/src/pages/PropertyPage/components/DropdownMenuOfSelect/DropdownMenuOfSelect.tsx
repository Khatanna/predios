import React from 'react';
import { DropdownMenu } from '../../../../components/DropdownMenu';
import { Dropdown, DropdownButton } from 'react-bootstrap';

type TextOptions = {
	createText: string;
	editText: string;
	deleteText: string;
}

export type Options = {
	showCreate: boolean;
	showEdit: boolean;
	showDelete: boolean
}

export type DropdownMenuOfSelectProps = {
	textOptions?: Partial<TextOptions>
	disableOptions?: Partial<Options>,
	onCreate?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	onEdit?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	onDelete?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const DropdownMenuOfSelect: React.FC<DropdownMenuOfSelectProps> = ({ onCreate, onEdit, onDelete, disableOptions, textOptions }) => {
	const { showCreate, showEdit, showDelete } = { showCreate: !!onCreate, showEdit: !!onEdit, showDelete: !!onDelete, ...disableOptions };
	const { createText, editText, deleteText } = { createText: "➕ Crear", editText: "✏ Editar", deleteText: "🗑 Eliminar", ...textOptions }

	return <DropdownMenu as={DropdownButton}>
		{onCreate && showCreate && <Dropdown.Item onClick={onCreate}>
			{createText}
		</Dropdown.Item>}
		{onEdit && showEdit && <Dropdown.Item onClick={onEdit}>
			{editText}
		</Dropdown.Item>}
		{onDelete && showDelete && <Dropdown.Item onClick={onDelete}>
			{deleteText}
		</Dropdown.Item>}
	</DropdownMenu>
}

export default DropdownMenuOfSelect;

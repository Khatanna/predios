import React, { useState } from 'react';
import { Tooltip } from '../../../../components/Tooltip';
import { Button, InputGroup, useAccordionButton } from 'react-bootstrap';
import { Check, ThreeDotsVertical, X } from 'react-bootstrap-icons';
import { useAuth } from '../../../../hooks';
import { customSwalError } from '../../../../utilities/alerts';
import { useFormStore } from '../../state/useFormStore';
import { usePaginationStore } from '../../state/usePaginationStore';
import { DropdownMenu } from '../../../HomePage/HomePage';
import { useFormContext } from 'react-hook-form';
import { Property } from '../../models/types';

export type EditableInputProps = {
	isEdit?: boolean,
	size?: 'sm' | 'lg'
	render: (props: { edit: boolean }) => React.ReactElement
}
const toggleProps = {
	as: ThreeDotsVertical,
	role: "button",
	fontSize: 16
};
const EditableInput: React.FC<EditableInputProps> = ({ isEdit = false, size, render }) => {
	const [edit, setEdit] = useState(isEdit);
	const { getValues } = useFormContext<Property>();
	const { role } = useAuth();
	// const changeEdit = role === "Administrador" ? (value: boolean) => setEdit(value) : () => {
	// 	customSwalError("Usted no tiene los permisos suficientes para poder editar los campos de este predio", "No tiene permiso para usar esta acción")
	// };

	if (!edit && role === "Administrador") {
		return <Tooltip label='Haz doble click para editar este campo'
		>
			<InputGroup size={size} onDoubleClick={(e) => {
				e.preventDefault()
				setEdit(true)
			}}>
				{render({ edit })}
			</InputGroup>
		</Tooltip>
	}

	return <InputGroup size={size}>
		{render({ edit })}
		{(getValues('id') && edit) && <InputGroup.Text>
			<DropdownMenu
				options={[
					{
						item: ['Confimar', { onClick: () => setEdit(false) }],
						icon: [Check, { color: 'green', fontSize: 18 }]
					},
					{
						item: ['Cancelar', { onClick: () => setEdit(false) }],
						icon: [X, { color: 'red', fontSize: 18 }]
					}
				]}
				toggleProps={toggleProps}
			/>
		</InputGroup.Text>
		}
	</InputGroup>;
};

export default EditableInput;

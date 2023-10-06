import { useState } from 'react';
import { Property } from '../../models/types';
import { UseControllerProps, UseFormReturn, useController } from 'react-hook-form';
import { Dropdown, InputGroup, Form, DropdownButton } from 'react-bootstrap';
import { DropdownMenu } from '../../../../components/DropdownMenu';
import Swal from 'sweetalert2';
import { DynamicInput } from '../DynamicInput';

export type DynamicSelectProps = {
	title: string;
	options: { label: string; value: string }[];
	placeholder: string;
	className?: string;
	disabled?: boolean;
	onUpdate: <T>({
		currentValue,
		newValue,
	}: {
		currentValue: T;
		newValue: T;
	}) => void;
	onCreate: <T>(data: { value: T }) => void;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	onDelete: <T>(data: { value: T }) => void;
	onClick?: () => void
} & Pick<UseControllerProps<Property>, 'name'> & Pick<UseFormReturn<Property>, 'control'>

const DynamicSelect: React.FC<DynamicSelectProps> = ({
	disabled = false,
	name,
	title,
	control,
	options,
	placeholder,
	className,
	onChange,
	onCreate,
	onUpdate,
	onDelete,
	onClick
}) => {

	const { field } = useController({
		name,
		control,
	});
	const [showEdit, setShowEdit] = useState(false);

	const close = () => {
		setShowEdit(false)
	}

	if (showEdit) {
		return <DynamicInput
			defaultValue={field.value as string}
			onConfirm={({ currentValue, newValue }) => {
				// onCreate({ currentValue, newValue });
				field.onChange(newValue)
				close()
			}}
			close={close}
		/>
	}

	const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		onChange(e)
		field.onChange(e)
	}

	return (
		<InputGroup>
			<Form.Select
				{...field}
				size="sm"
				className={className}
				disabled={disabled}
				onDoubleClick={() => setShowEdit(!!field.value)}
				onChange={handleOnChange}
			>
				<option disabled selected={options.length === 0 || !field.value}>
					{placeholder}
				</option>
				{options.map(({ label, value }) => (
					<option value={value} key={crypto.randomUUID()}>
						{label}
					</option>
				))}
			</Form.Select>
			{!disabled && (
				<InputGroup.Text>
					<DropdownMenu as={DropdownButton}>
						<Dropdown.Item
							onClick={() => {
								if (onClick) {
									onClick()
								} else {
									Swal.fire({
										title,
										input: "text",
										inputAttributes: {
											autocapitalize: "off",
											autcomplete: "off",
										},
										showCancelButton: true,
										confirmButtonText: "Crear",
										confirmButtonColor: "green",
										cancelButtonText: "Cancelar",
										cancelButtonColor: "red",
										preConfirm: (value) => {
											onCreate({ value: value.trim() });
										},
									});
								}

							}}
						>
							➕ Crear
						</Dropdown.Item>
						{(!!field.value && options.length > 0) && (
							<>
								<Dropdown.Item onClick={() => setShowEdit(!!field.value)}>
									✏ Editar
								</Dropdown.Item>
								<Dropdown.Item onClick={() => {
									onDelete({ value: field.value as string })
									field.onChange(null)
								}}>
									🗑 Eliminar
								</Dropdown.Item>
							</>
						)}
					</DropdownMenu>
				</InputGroup.Text>
			)
			}
		</InputGroup >
	);
};

export default DynamicSelect;

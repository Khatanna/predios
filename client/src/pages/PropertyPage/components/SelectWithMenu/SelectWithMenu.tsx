import { FormSelectProps, InputGroup, Form, DropdownButton, Dropdown } from 'react-bootstrap';
import { useFormContext, UseControllerProps, Controller } from 'react-hook-form';
import { Property } from '../../models/types';
import { DropdownMenu } from '../../../../components/DropdownMenu';

type Option = {
	label: string
	value: string
}
interface SelectWithMenuProps extends FormSelectProps {
	options: Option[]
	placeholder: string
	fieldsForReset?: Pick<UseControllerProps<Property>, 'name'>['name'][]
	onClickCreate: () => void
	onClickEdit: () => void
	onClickDelete: () => void
}

const SelectWithMenu: React.FC<SelectWithMenuProps & Pick<UseControllerProps<Property>, 'name'>> = ({ name, placeholder, fieldsForReset, options, onClickCreate, onClickEdit, onClickDelete, ...props }) => {
	const { watch, control, resetField } = useFormContext<Property>();
	const value = watch(name);

	return <InputGroup>
		<Controller
			name={name}
			control={control}
			defaultValue={"undefined"}
			render={({ field }) => (
				<Form.Select {...field} {...props} disabled={options.length === 0} onChange={(e) => {
					field.onChange(e)
					fieldsForReset?.forEach(field => resetField(field))
				}}>
					<option value={"undefined"} disabled selected={!!field.value || options.length === 0}>{placeholder}</option>
					{options.map(({ label, value }) => (
						<option value={value}>{label}</option>
					))}
				</Form.Select>
			)}
		/>
		{!props.disabled && (
			<InputGroup.Text>
				<DropdownMenu as={DropdownButton}>
					<Dropdown.Item onClick={onClickCreate}>
						➕ Crear
					</Dropdown.Item>
					{(!!value && options.length > 0) && (
						<>
							<Dropdown.Item onClick={onClickEdit}>
								✏ Editar
							</Dropdown.Item>
							<Dropdown.Item onClick={onClickDelete}>
								🗑 Eliminar
							</Dropdown.Item>
						</>
					)}
				</DropdownMenu>
			</InputGroup.Text>
		)}
	</InputGroup>
};

export default SelectWithMenu;

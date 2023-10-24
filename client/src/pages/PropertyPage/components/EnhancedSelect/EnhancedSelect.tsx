import { Form, FormSelectProps } from 'react-bootstrap';

type Option = {
	label: string
	value: string
}

export type EnhancedSelectProps = {
	options?: Option[];
	placeholder: string
} & FormSelectProps

const EnhancedSelect: React.FC<EnhancedSelectProps> = ({ options = [], placeholder, ...props }) => {
	if (props.disabled) {
		return <Form.Control
			placeholder={placeholder || props.value as string}
			value={undefined}
			disabled
			size={props.size}
		/>
	}

	return <Form.Select {...props} style={{
		color: props.value === 'undefined' ? 'gray' : 'black'
	}}>
		<option value="undefined" disabled style={{ color: 'gray' }}>{placeholder}</option>
		{options.map(({ label, value }) => (
			<option value={value} key={value}>{label}</option>
		))}
	</Form.Select>
}

export default EnhancedSelect;

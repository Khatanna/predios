import { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { Icon } from '../../../../components/Icon';
import { CheckLg, XLg } from 'react-bootstrap-icons';

export type DynamicInputProps = {
	defaultValue: string;
	onConfirm: ({
		currentValue,
		newValue,
	}: {
		currentValue: string;
		newValue: string;
	}) => void;
	handleClose: () => void;
}

const DynamicInput: React.FC<DynamicInputProps> = ({ defaultValue, onConfirm, handleClose }) => {
	const [value, setValue] = useState(defaultValue);

	return <InputGroup>
		<InputGroup.Text onClick={handleClose} role="button">
			<Icon label="Cancelar">
				<XLg color="red" />
			</Icon>
		</InputGroup.Text>

		<Form.Control
			size="sm"
			value={value}
			className="text-primary fw-bold"
			onChange={(e) => setValue(e.target.value)}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					onConfirm({ currentValue: defaultValue, newValue: value })
				}
			}}
		/>
		<InputGroup.Text
			onClick={() => {
				onConfirm({ currentValue: defaultValue, newValue: value });
			}}
			role="button"
		>
			<Icon label="Realizar cambio">
				<CheckLg color="green" />
			</Icon>
		</InputGroup.Text>
	</InputGroup>;
};

export default DynamicInput;

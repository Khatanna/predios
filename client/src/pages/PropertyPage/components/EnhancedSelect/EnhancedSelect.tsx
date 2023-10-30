import { Form, FormSelectProps, InputGroup } from "react-bootstrap";
import { DropdownMenuOfSelect } from "../DropdownMenuOfSelect";
import { Options } from "../DropdownMenuOfSelect/DropdownMenuOfSelect";

type Option = {
  label: string;
  value: string;
};

export type EnhancedSelectProps = {
  options?: Option[];
  placeholder: string;
  disableOptions?: (value: string) => Partial<Options>;
  onCreate?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
} & FormSelectProps;

const EnhancedSelect: React.FC<EnhancedSelectProps> = ({
  options = [],
  placeholder,
  disableOptions,
  onCreate,
  onEdit,
  onDelete,
  ...props
}) => {
  if (props.disabled) {
    return (
      <Form.Control
        placeholder={placeholder || (props.value as string)}
        value={undefined}
        disabled
        size={props.size}
      />
    );
  }

  return (
    <InputGroup>
      <Form.Select {...props}>
        <option value="undefined" disabled style={{ color: "gray" }}>
          {placeholder}
        </option>
        {options.map(({ label, value }) => (
          <option value={value} key={value}>
            {label}
          </option>
        ))}
      </Form.Select>
      {(onCreate || onEdit || onDelete) && (
        <InputGroup.Text>
          <DropdownMenuOfSelect
            disableOptions={
              disableOptions
                ? disableOptions(props.value as string)
                : {
                    showCreate:
                      props.value === "undefined" ||
                      props.value !== "undefined",
                    showDelete: props.value !== "undefined",
                    showEdit: props.value !== "undefined",
                  }
            }
            onCreate={onCreate}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </InputGroup.Text>
      )}
    </InputGroup>
  );
};

export default EnhancedSelect;

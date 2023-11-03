import { useMemo } from "react";
import {
  Button,
  Dropdown,
  DropdownProps,
  Form,
  FormSelectProps,
  InputGroup,
  Row,
  Stack,
  StackProps,
} from "react-bootstrap";

import { Icon, IconProps, ThreeDotsVertical } from "react-bootstrap-icons";
import { Tooltip } from "../../components/Tooltip";

type DropdownItemProps = typeof Dropdown.Item.defaultProps & { show?: boolean };
type DropdownItemComposedProps = {
  item: [string, DropdownItemProps?];
  icon?: [Icon, IconProps?];
};
type DropdownToggleProps = typeof Dropdown.Toggle.defaultProps;

const ItemWithIcon = ({
  icon,
}: Required<Pick<DropdownItemComposedProps, "icon">>) => {
  const [Icon, iconProps] = icon;

  return <Icon {...iconProps} />;
};

const DropdownItem: React.FC<DropdownItemComposedProps & StackProps> = ({
  item: [label, itemProps],
  icon,
  ...stackProps
}) => {
  return (
    <Dropdown.Item {...itemProps}>
      <Stack {...stackProps}>
        <div>{label}</div>
        {icon && <ItemWithIcon icon={icon} />}
      </Stack>
    </Dropdown.Item>
  );
};

const DropdownMenu: React.FC<
  Omit<DropdownProps, "children"> & { options: DropdownItemComposedProps[] } & {
    toggleProps?: DropdownToggleProps;
  }
> = ({ options, toggleProps, ...props }) => {
  const optionsFiltered = useMemo(() => {
    return options.filter(({ item: [, props] }) => {
      if (props && "show" in props) {
        return props.show;
      }
      return true;
    });
  }, [options]);

  return (
    <Dropdown {...props}>
      <Dropdown.Toggle as={Button} {...toggleProps} />
      <Dropdown.Menu>
        {optionsFiltered.map(({ item, icon }) => (
          <DropdownItem
            item={item}
            icon={icon}
            gap={2}
            direction={"horizontal"}
            key={crypto.randomUUID()}
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const toggleProps: DropdownToggleProps = {
  as: ThreeDotsVertical,
  role: "button",
};

export const SelectNameable: React.FC<
  FormSelectProps & {
    options: { label: string; value: string }[];
    readOnly?: boolean;
    onCreate?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    onEdit?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    onDelete?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  }
> = ({ options, placeholder, onCreate, onEdit, onDelete, ...props }) => {
  const optionsMenu: DropdownItemComposedProps[] = [
    {
      item: ["➕ Crear", { onClick: onCreate, show: Boolean(onCreate) }],
    },
    {
      item: [
        "✏ Editar",
        {
          onClick: onEdit,
          show: Boolean(onEdit) && props.value !== "undefined",
        },
      ],
    },
    {
      item: [
        "🗑 Eliminar",
        {
          onClick: onDelete,
          show: Boolean(onDelete) && props.value !== "undefined",
        },
      ],
    },
  ];

  if (props.readOnly || props.disabled) {
    return (
      <Tooltip
        label={props.readOnly ? "Campo de solo lectura" : "Campo deshabilitado"}
      >
        <Form.Control
          placeholder={placeholder || (props.value as string)}
          value={props.readOnly ? (props.value as string) : placeholder}
          size={props.size}
          readOnly={props.readOnly}
          disabled={props.disabled}
          className={`${props.disabled ? "text-body-tertiary" : ""}`}
        />
      </Tooltip>
    );
  }

  return (
    <InputGroup size={props.size}>
      <Form.Select
        {...props}
        className={`${
          props.value === "undefined" || !props.value
            ? "text-body-tertiary"
            : "text-black"
        }`}
      >
        <option value="undefined" className="text-body-tertiary" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            value={option.value}
            key={crypto.randomUUID()}
            style={{ color: "black" }}
          >
            {option.label}
          </option>
        ))}
      </Form.Select>
      {(onCreate || onEdit || onDelete) && (
        <InputGroup.Text>
          <DropdownMenu options={optionsMenu} toggleProps={toggleProps} />
        </InputGroup.Text>
      )}
    </InputGroup>
  );
};

const HomePage: React.FC = () => {
  return <Row></Row>;
};

export default HomePage;

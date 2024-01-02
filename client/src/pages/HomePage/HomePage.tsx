import { useMemo, useState } from "react";
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
import { useAuth } from "../../hooks";
import { Navigate } from "react-router";
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

const togglePropsx: DropdownToggleProps = {
  as: ThreeDotsVertical,
  role: "button",
  color: "black",
  fontSize: 16,
};

export const DropdownMenu: React.FC<
  Omit<DropdownProps, "children"> & { options: DropdownItemComposedProps[] } & {
    toggleProps?: DropdownToggleProps;
  }
> = ({ options, toggleProps = togglePropsx, ...props }) => {
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
      <Dropdown.Toggle as={Button} {...toggleProps} variant="outline-dark" />
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

export const SelectNameable: React.FC<
  FormSelectProps & {
    options: { label: string; value: string }[];
    readOnly?: boolean;
    dirty?: boolean;
    highlight?: boolean;
    onCreate?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    onEdit?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    onDelete?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  }
> = ({
  options,
  placeholder,
  onCreate,
  onEdit,
  onDelete,
  dirty,
  highlight,
  ...props
}) => {
  const [readOnly, setReadOnly] = useState(props.readOnly);
  const { role } = useAuth();
  const currentValue = useMemo(() => props.value, []);
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

  const optionsReadOnly: DropdownItemComposedProps[] = [
    {
      item: [
        "✍ Modificar",
        {
          onClick: () => {
            setReadOnly(false);
          },
        },
      ],
    },
  ];

  const optionsCancelReadOnly: DropdownItemComposedProps[] = [
    {
      item: [
        "❌ Cancelar",
        {
          onClick: () => {
            if (props.onChange && props.value !== currentValue) {
              props.onChange(currentValue);
            }
            setReadOnly(true);
          },
        },
      ],
    },
    {
      item: [
        "✔ Confirmar",
        {
          onClick: () => {
            setReadOnly(true);
          },
        },
      ],
    },
  ];

  if (readOnly || props.disabled) {
    return (
      <Tooltip
        label={readOnly ? "Campo de solo lectura" : "Campo deshabilitado"}
      >
        <InputGroup size={props.size}>
          <Form.Control
            placeholder={placeholder || (props.value as string)}
            value={
              readOnly && props.value !== "undefined"
                ? (props.value as string)
                : placeholder
            }
            size={props.size}
            readOnly={readOnly}
            disabled={props.disabled || dirty}
            className={`${
              props.disabled
                ? "text-body-tertiary"
                : (readOnly && props.value === "undefined") || highlight
                ? "text-danger fw-bold"
                : ""
            }`}
          />
          {props.readOnly && role === "administrador" && (
            <InputGroup.Text>
              <DropdownMenu
                options={optionsReadOnly}
                toggleProps={togglePropsx}
              />
            </InputGroup.Text>
          )}
        </InputGroup>
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
            : highlight
            ? "text-danger fw-bold"
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
          <DropdownMenu
            options={props.readOnly ? optionsCancelReadOnly : optionsMenu}
            toggleProps={togglePropsx}
          />
        </InputGroup.Text>
      )}
    </InputGroup>
  );
};

const HomePage: React.FC = () => {
  return <Navigate to={"/properties"} />;
};

export default HomePage;

import { Dropdown, Form, FormSelectProps, InputGroup } from "react-bootstrap";
import { FieldPath, useFormContext } from "react-hook-form";
import { Navigate } from "react-router";
import { DropdownMenu } from "../../components/DropdownMenu";
import { useAuth } from "../../hooks";
import { Property } from "../PropertyPage/models/types";
import { useCan } from "../../hooks/useCan";

export const SelectNameable: React.FC<
  FormSelectProps & {
    name: FieldPath<Property>;
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
  name,
  highlight,
  ...props
}) => {
    const { getFieldState } = useFormContext<Property>();
    const { role } = useAuth();
    const { data: can } = useCan({ can: [{ level: 'CREATE', resource: 'PROPERTY' }] })
    return (
      <InputGroup size={props.size}>
        <Form.Select
          {...props}
          isInvalid={!!getFieldState(name).error}
          className={`${props.value === "undefined" || !props.value
              ? "text-body-tertiary"
              : highlight
                ? "text-danger fw-bold"
                : "text-black"
            }`}
          style={{
            pointerEvents: can['CREATE@PROPERTY'] ? "auto" : "none",
          }}
        >
          <option value="undefined" className="text-body-tertiary" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option value={option.value} style={{ color: "black" }}>
              {option.label}
            </option>
          ))}
        </Form.Select>
        {can['CREATE@PROPERTY'] && (
          <InputGroup.Text hidden={!onCreate && !onEdit && !onDelete}>
            <DropdownMenu>
              <Dropdown.Item onClick={onCreate} hidden={!onCreate}>
                ➕ Crear
              </Dropdown.Item>
              <Dropdown.Item
                onClick={onCreate}
                hidden={!onEdit || props.value === "undefined"}
              >
                ✏ Editar
              </Dropdown.Item>
              <Dropdown.Item
                onClick={onCreate}
                hidden={!onDelete || props.value === "undefined"}
              >
                🗑 Eliminar
              </Dropdown.Item>
            </DropdownMenu>
          </InputGroup.Text>
        )}
        <Form.Control.Feedback type="invalid">
          {getFieldState(name).error?.message}
        </Form.Control.Feedback>
      </InputGroup>
    );
  };

const HomePage: React.FC = () => {
  return <Navigate to={"/properties"} />;
};

export default HomePage;

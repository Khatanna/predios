import { DocumentNode } from "graphql";
import { Resource } from "../../pages/UserPage/components/Permission/Permission";
import { Alert, Form, FormSelectProps, Spinner } from "react-bootstrap";
import { useAuthStore } from "../../state/useAuthStore";
import { useQuery } from "@apollo/client";
import { ExclamationTriangle, PersonSlash } from "react-bootstrap-icons";
import { capitalizeString } from "../../pages/UserPage/utils/capitalizeString";

export type CustomSelectProps = {
  query: DocumentNode;
  placeholder: string | React.ReactNode;
  resource: `${Resource}`;
  readOnly?: boolean;
};

const CustomSelect: React.FC<CustomSelectProps & FormSelectProps> = ({
  query,
  placeholder,
  resource,
  readOnly = false,
  ...props
}) => {
  const { can } = useAuthStore();
  const { data, error, loading } = useQuery<{
    options: Array<{ name: string }>;
  }>(query, { skip: !can(`READ@${resource}`) });

  if (!can(`READ@${resource}`)) {
    return (
      <Alert variant="warning" className="p-1 py-2 m-0">
        <small>
          <div className="d-flex align-items-center gap-2 justify-content-center">
            <PersonSlash size={18} color="red" />
            <div>
              <small>
                <div>{"No tiene permisos"}</div>
              </small>
            </div>
          </div>
        </small>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center border border-1 py-1 rounded flex-grow-1">
        <Spinner
          variant="danger"
          size={props.size === "sm" ? "sm" : undefined}
        />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="warning" className="p-1 py-2 m-0">
        <small>
          <div className="d-flex align-items-center gap-2">
            <ExclamationTriangle size={16} color="red" />
            <div>{error.message}</div>
          </div>
        </small>
      </Alert>
    );
  }

  return (
    <Form.Select
      {...props}
      className={props.value === "undefined" ? "text-body-tertiary" : ""}
      onChange={(e) => {
        if (readOnly) {
          e.preventDefault();
        } else {
          props.onChange?.(e);
        }
      }}
    >
      <option value="undefined" disabled>
        {placeholder}
      </option>
      {data?.options.map(({ name }) => (
        <option value={name} className="text-dark">
          {capitalizeString(name)}
        </option>
      ))}
    </Form.Select>
  );
};

export default CustomSelect;

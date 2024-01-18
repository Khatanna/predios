import { gql } from "@apollo/client";
import { Form } from "react-bootstrap";
import { ListColumns } from "react-bootstrap-icons";
import { Controller, useFormContext } from "react-hook-form";
import { SelectNameable } from "../../../../components/SelectNameable";
import { useSelectSubscription } from "../../hooks/useSelectSubscription";
import { Property } from "../../models/types";
import { CustomLabel } from "../CustomLabel";

const GET_ALL_TYPES_QUERY = gql`
  query GetAllTypes {
    options: getAllTypes {
      name
    }
  }
`;

const typeMutations = {
  create: gql`
	mutation CreateType($name: String) {
		type: createType(name: $name) {
			name
		}
	}
`,
  update: gql`
	mutation UpdateType($currentName: String, $name: String) {
		type: updateType(currentName: $currentName, name: $name) {
			name
		}
	}
`,
  delete: gql`
  mutation DeleteType($name: String) {
    type: deleteType(name: $name) {
      name
    }
  }
`
}

const TypeSelect: React.FC = () => {
  const {
    control,
    getValues,
    getFieldState,
  } = useFormContext<Property>();
  const { subscribe } = useSelectSubscription(getValues('id'))!;
  return (
    <Form.Group>
      <CustomLabel label="Tipo de predio" icon={<ListColumns />} />
      <Controller
        name="type.name"
        control={control}
        rules={{
          required: {
            message: 'Este campo es obligatorio',
            value: true
          }, pattern: {
            message: "Este campo es obligatorio",
            value: /^(?!undefined$).*$/gi
          }
        }}
        defaultValue="undefined"
        render={({ field }) => (
          <SelectNameable
            {...subscribe(field)}
            size="sm"
            resource={"TYPE"}
            query={GET_ALL_TYPES_QUERY}
            mutations={typeMutations}
            placeholder={"Tipo de predio"}
            isValid={getFieldState(field.name).isTouched && !getFieldState(field.name).error?.message}
            isInvalid={!!getFieldState(field.name).error?.message}
            error={<Form.Control.Feedback type="invalid">{getFieldState(field.name).error?.message}</Form.Control.Feedback>}
          />
        )}
      />
    </Form.Group>
  );
};

export default TypeSelect;

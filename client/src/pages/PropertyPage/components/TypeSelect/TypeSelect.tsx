import { gql } from "@apollo/client";
import { Form } from "react-bootstrap";
import { ListColumns } from "react-bootstrap-icons";
import { Controller, useFormContext } from "react-hook-form";
import { SelectNameable } from "../../../../components/SelectNameable";
import { roleMutations } from "../../../../graphql/mutations";
import { Property } from "../../models/types";
import { CustomLabel } from "../CustomLabel";
import { useSelectSubscription } from "../../hooks/useSelectSubscription";
import { useAuthStore } from "../../../../state/useAuthStore";

const GET_ALL_TYPES_QUERY = gql`
  query GetAllTypes {
    options: getAllTypes {
      name
    }
  }
`;

const CREATE_TYPE_MUTATION = gql`
	mutation CreateType($input: TypeInput) {
		type: createType(input: $input) {
			name
		}
	}
`;

const UPDATE_TYPE_MUTATION = gql`
	mutation UpdateType($name: String, $item: TypeInput) {
		type: updateType(name: $name, item: $item) {
			name
		}
	}
`;

const DELETE_TYPE_MUTATION = gql`
  mutation DeleteType($name: String) {
    type: deleteType(name: $name) {
      name
    }
  }
`

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
            mutations={roleMutations}
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

import { gql } from "@apollo/client";
import { Form, FormSelectProps } from "react-bootstrap";
import { DeviceSsd } from "react-bootstrap-icons";
import { Controller, useFormContext } from "react-hook-form";
import { SelectNameable } from "../../../../components/SelectNameable";
import { roleMutations } from "../../../../graphql/mutations";
import { Property } from "../../models/types";
import { CustomLabel } from "../CustomLabel";
import { useSelectSubscription } from "../../hooks/useSelectSubscription";

const GET_ALL_STATES_QUERY = gql`
	query GetAllStates {
		options: getAllStates {
			name
      # stage {
      #   name
      # }
		}
	} 
`;

const StateSelect: React.FC<{
  name: "state.name" | `trackings.${number}.state.name`;
} & { disabled?: boolean, toSubscribe?: boolean }> = ({ name, disabled = false, toSubscribe = true }) => {
  const { control, getFieldState, getValues } = useFormContext<Property>();
  const { subscribe } = useSelectSubscription(toSubscribe ? getValues('id') : undefined)
  return (
    <Form.Group>
      <CustomLabel label="Estado" icon={<DeviceSsd color="#ff5e00" />} />
      <Controller
        name={name}
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
            resource="STATE"
            size="sm"
            highlight
            placeholder={"Estado"}
            query={GET_ALL_STATES_QUERY}
            mutations={roleMutations}
            isValid={getFieldState(field.name).isTouched && !getFieldState(field.name).error?.message}
            isInvalid={!!getFieldState(field.name).error?.message}
            error={<Form.Control.Feedback type="invalid">{getFieldState(field.name).error?.message}</Form.Control.Feedback>}
            readOnly={disabled}
          />
        )}
      />
    </Form.Group>
  );
};

export default StateSelect;

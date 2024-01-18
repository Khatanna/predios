import { gql } from "@apollo/client";
import React from "react";
import { Form } from "react-bootstrap";
import { Box2 } from "react-bootstrap-icons";
import { Controller, useFormContext } from "react-hook-form";
import { SelectNameable } from "../../../../components/SelectNameable";
import { Property } from "../../models/types";
import { CustomLabel } from "../CustomLabel";
import { useSelectSubscription } from "../../hooks/useSelectSubscription";

const GET_ALL_GROUPED_STATES_QUERY = gql`
	query GetAllGroupedStates {
		options: getAllGroupedStates {
			name
		}
	}
`;

const groupedstateMutations = {
  create: gql`
	mutation CreateGroupedState($name: String) {
		result: createGroupedState(name: $name) {
			name
		}
	}
`,
  update: gql`
	mutation UpdateGroupedState($currentName: String, $name: String) {
		result: updateGroupedState(currentName: $currentName, name: $name) {
			name
		}
	}
`,
  delete: gql`
  mutation DeleteGroupedState($name: String) {
    result: deleteGroupedState(name: $name) {
      name
    }
  }
`
}

const GroupedStateSelect: React.FC = () => {
  const { control, getValues, getFieldState } = useFormContext<Property>();
  const { subscribe } = useSelectSubscription(getValues('id'))

  return (
    <Form.Group>
      <CustomLabel label="Estado agrupado" icon={<Box2 color="#864e16" />} />
      <Controller
        name="groupedState.name"
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
            resource="PROPERTY"
            query={GET_ALL_GROUPED_STATES_QUERY}
            mutations={groupedstateMutations}
            size="sm"
            highlight
            placeholder={"Estado agrupado"}
            isValid={getFieldState(field.name).isTouched && !getFieldState(field.name).error?.message}
            isInvalid={!!getFieldState(field.name).error?.message}
            error={<Form.Control.Feedback type="invalid">{getFieldState(field.name).error?.message}</Form.Control.Feedback>}
          />
        )}
      />
    </Form.Group>
  );
};

export default GroupedStateSelect;

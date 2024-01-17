import { gql } from "@apollo/client";
import React from "react";
import { Form } from "react-bootstrap";
import { Box2 } from "react-bootstrap-icons";
import { Controller, useFormContext } from "react-hook-form";
import { SelectNameable } from "../../../../components/SelectNameable";
import { roleMutations } from "../../../../graphql/mutations";
import { useInputSubscription } from "../../hooks/useInputSubscription";
import { Property } from "../../models/types";
import { CustomLabel } from "../CustomLabel";
import { useSelectSubscription } from "../../hooks/useSelectSubscription";

export type GroupedStateSelectProps = {};

const GET_ALL_GROUPED_STATES_QUERY = gql`
	query GetAllGroupedStates {
		options: getAllGroupedStates {
			name
		}
	}
`;

const GroupedStateSelect: React.FC<GroupedStateSelectProps> = ({ }) => {
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
            mutations={roleMutations}
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

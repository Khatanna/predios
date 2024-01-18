import { gql } from "@apollo/client";
import React from "react";
import { Form } from "react-bootstrap";
import { Link45deg } from "react-bootstrap-icons";
import { Controller, useFormContext } from "react-hook-form";
import { Property } from "../../models/types";
import { CustomLabel } from "../CustomLabel";
import { SelectNameable } from "../../../../components/SelectNameable";
import { useSelectSubscription } from "../../hooks/useSelectSubscription";

const GET_ALL_REFERENCES_QUERY = gql`
	query GetAllReferencesQuery {
		options: getAllReferences {
			name
		}
	}
`;

const referenceMutations = {
  create: gql`
	mutation CreateReference($name: String) {
		result: createReference(name: $name) {
			name
		}
	}
`,
  delete: gql`
  mutation DeleteReference($name: String) {
    result: deleteReference(name: $name) {
      name
    }
  }
`,
  update: gql`
	mutation UpdateReference($currentName: String, $name: String) {
		result: updateReference(currentName: $currentName, name: $name) {
			name
		}
	}
`
}

const ReferenceSelect: React.FC = () => {
  const { control, getValues, getFieldState } = useFormContext<Property>();
  const { subscribe } = useSelectSubscription(getValues('id'))
  return (
    <Form.Group>
      <CustomLabel label="Referencia" icon={<Link45deg color="#7d7907" />} />
      <Controller
        name="reference.name"
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
        defaultValue="Verificado"
        render={({ field }) => (
          <SelectNameable
            {...subscribe(field)}
            resource="REFERENCE"
            query={GET_ALL_REFERENCES_QUERY}
            mutations={referenceMutations}
            size="sm"
            placeholder={"Referencia"}
            highlight
            isValid={getFieldState(field.name).isTouched && !getFieldState(field.name).error?.message}
            isInvalid={!!getFieldState(field.name).error?.message}
            error={<Form.Control.Feedback type="invalid">{getFieldState(field.name).error?.message}</Form.Control.Feedback>}
          />
        )}
      />
    </Form.Group>
  );
};

export default ReferenceSelect;

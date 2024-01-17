import { gql } from "@apollo/client";
import { Form } from "react-bootstrap";
import { Diagram3 } from "react-bootstrap-icons";
import { Controller, useFormContext } from "react-hook-form";
import { SelectNameable } from "../../../../components/SelectNameable";
import { roleMutations } from "../../../../graphql/mutations";
import { useInputSubscription } from "../../hooks/useInputSubscription";
import { Property } from "../../models/types";
import { CustomLabel } from "../CustomLabel";
import { useSelectSubscription } from "../../hooks/useSelectSubscription";

const GET_ALL_CLASIFICATIONS_QUERY = gql`
	query GetAllClasifications {
		options: getAllClasifications {
			name
		}
	}
`;

const ClasificationSelect: React.FC = () => {
  const { control, getValues, getFieldState, formState: { errors } } = useFormContext<Property>();
  const { subscribe } = useSelectSubscription(getValues('id'));
  return (
    <Form.Group>
      <CustomLabel label="Clasificación" icon={<Diagram3 color="green" />} />
      <Controller
        name="clasification.name"
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
            resource="CLASIFICATION"
            placeholder={"Clasificación"}
            query={GET_ALL_CLASIFICATIONS_QUERY}
            mutations={roleMutations}
            size="sm"
            isValid={getFieldState(field.name).isTouched && !errors.clasification?.name?.message}
            isInvalid={!!errors.clasification?.name?.message}
            error={<Form.Control.Feedback type="invalid">{errors.clasification?.name?.message}</Form.Control.Feedback>}
          />
        )}
      />
    </Form.Group>
  );
};

export default ClasificationSelect;

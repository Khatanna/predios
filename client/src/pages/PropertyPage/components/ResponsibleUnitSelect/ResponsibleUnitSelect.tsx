import { gql } from "@apollo/client";
import { Form } from "react-bootstrap";
import { People } from "react-bootstrap-icons";
import { Controller, useFormContext } from "react-hook-form";
import { SelectNameable } from "../../../../components/SelectNameable";
import { useSelectSubscription } from "../../hooks/useSelectSubscription";
import { Property } from "../../models/types";
import { CustomLabel } from "../CustomLabel";

const GET_ALL_RESPONSIBLE_UNITS_QUERY = gql`
  query GetAllResponsibleUnits {
    options: getAllUnits {
      name
    }
  }
`;

const responsibleUnitMutations = {
  create: gql`
    mutation CreateUnit($name: String) {
      unit: createUnit(name: $name) {
        name
      }
    }
  `,
  update: gql`
    mutation UpdateUnit($currentName: String, $name: String) {
      unit: updateUnit(currentName: $currentName, name: $name) {
        name
      }
    }
  `,
  delete: gql`
    mutation DeleteUnit($name: String) {
      unit: deleteUnit(name: $name) {
        name
      }
    }
  `,
};

const ResponsibleUnitSelect: React.FC = () => {
  const { control, getValues, getFieldState } = useFormContext<Property>();
  const { subscribe } = useSelectSubscription(getValues("id"));
  return (
    <Form.Group>
      <CustomLabel
        label="Unidad responsable"
        icon={<People color="#40d781" />}
      />
      <Controller
        name="responsibleUnit.name"
        control={control}
        rules={{
          required: {
            message: "Este campo es obligatorio",
            value: true,
          },
          pattern: {
            message: "Este campo es obligatorio",
            value: /^(?!undefined$).*$/gi,
          },
        }}
        defaultValue="undefined"
        render={({ field }) => (
          <SelectNameable
            {...subscribe(field)}
            resource="UNIT"
            size="sm"
            placeholder={"Unidad responsable"}
            query={GET_ALL_RESPONSIBLE_UNITS_QUERY}
            mutations={responsibleUnitMutations}
            isValid={
              getFieldState(field.name).isTouched &&
              !getFieldState(field.name).error?.message
            }
            isInvalid={!!getFieldState(field.name).error?.message}
            error={
              <Form.Control.Feedback type="invalid">
                {getFieldState(field.name).error?.message}
              </Form.Control.Feedback>
            }
          />
        )}
      />
    </Form.Group>
  );
};

export default ResponsibleUnitSelect;

import { Controller, useFormContext } from "react-hook-form";
import { gql } from "@apollo/client";
import { Form } from "react-bootstrap";
import { Activity as ActivityIcon } from "react-bootstrap-icons";
import { SelectNameable } from "../../../../components/SelectNameable";
import { Property } from "../../models/types";
import { CustomLabel } from "../CustomLabel";
import { useSelectSubscription } from "../../hooks/useSelectSubscription";

const GET_ALL_ACTIVITIES_QUERY = gql`
  query GetAllActivities {
    options: getAllActivities {
      name
    }
  }
`;

const activityMutations = {
  create: gql`
    mutation CreateActivity($name: String) {
      activity: createActivity(name: $name) {
        name
      }
    }
  `,
  update: gql`
    mutation UpdateActivity($currentName: String, $name: String) {
      activity: updateActivity(currentName: $currentName, name: $name) {
        name
      }
    }
  `,
  delete: gql`
    mutation DeleteActivity($name: String) {
      activity: deleteActivity(name: $name) {
        name
      }
    }
  `,
};

const ActivitySelect: React.FC = () => {
  const { control, getValues, getFieldState } = useFormContext<Property>();
  const { subscribe } = useSelectSubscription(getValues("id"));
  return (
    <Form.Group>
      <CustomLabel label="Actividad" icon={<ActivityIcon color="red" />} />
      <Controller
        name="activity.name"
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
            resource="ACTIVITY"
            query={GET_ALL_ACTIVITIES_QUERY}
            mutations={activityMutations}
            size="sm"
            placeholder={"Actividad"}
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

export default ActivitySelect;

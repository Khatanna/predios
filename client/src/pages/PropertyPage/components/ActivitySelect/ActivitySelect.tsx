import { Controller, useFormContext } from "react-hook-form";
import { useCustomQuery } from "../../../../hooks/useCustomQuery";

import { Activity } from "../../../ActivityPage/models/types";
import { Activity as ActivityIcon } from "react-bootstrap-icons";
import {
  useActivityMutations,
  useActivityStore,
} from "../../hooks/useRepository";
import { Property } from "../../models/types";
import { useModalStore } from "../../state/useModalStore";
import { Form } from "react-bootstrap";
import { CustomLabel } from "../CustomLabel";
import { useInputSubscription } from "../../hooks/useInputSubscription";
import { SelectNameable } from "../../../../components/SelectNameable";
import { gql } from "@apollo/client";
import { roleMutations } from "../../../../graphql/mutations";

const GET_ALL_ACTIVITIES_QUERY = gql`
  query GetAllActivities {
    options: getAllActivities {
      name
    }
  }
`;

const ActivitySelect: React.FC = ({}) => {
  const { control } = useFormContext<Property>();

  // const { subscribe } = useInputSubscription({
  //   name: "activity.name",
  //   options: {
  //     pattern: {
  //       value: /^(?!undefined$).*$/gi,
  //       message: "Este campo es obligatorio",
  //     },
  //   },
  // });
  return (
    <Form.Group>
      <CustomLabel label="Actividad" icon={<ActivityIcon color="red" />} />
      <Controller
        name="activity.name"
        control={control}
        defaultValue="undefined"
        render={({ field }) => (
          <SelectNameable
            {...field}
            resource="ACTIVITY"
            query={GET_ALL_ACTIVITIES_QUERY}
            mutations={roleMutations}
            size="sm"
            placeholder={"Actividad"}
          />
        )}
      />
    </Form.Group>
  );
};

export default ActivitySelect;

import { Controller, useFormContext } from "react-hook-form";
import { Property } from "../../models/types";
import { gql } from "@apollo/client";
import { Form } from "react-bootstrap";
import { Folder } from "react-bootstrap-icons";
import { SelectNameable } from "../../../../components/SelectNameable";
import { CustomLabel } from "../CustomLabel";
import { useSelectSubscription } from "../../hooks/useSelectSubscription";

const GET_ALL_SUBDIRECTORIES_QUERY = gql`
  query GetAllSubdirectories {
    options: getAllFolderLocations {
      name
    }
  }
`;

const folderLocationMutations = {
  create: gql`
    mutation CreateFolderLocation($name: String) {
      folderLocation: createFolderLocation(name: $name) {
        name
      }
    }
  `,
  update: gql`
    mutation UpdateFolderLocationMutation($currentName: String, $name: String) {
      folderLocation: updateFolderLocation(
        currentName: $currentName
        name: $name
      ) {
        name
      }
    }
  `,
  delete: gql`
    mutation DeleteFolderLocationMutation($name: String) {
      folderLocation: deleteFolderLocation(name: $name) {
        name
      }
    }
  `,
};

const SubdirectorySelect: React.FC = () => {
  const { control, getValues, getFieldState } = useFormContext<Property>();

  const { subscribe } = useSelectSubscription(getValues("id"));
  return (
    <Form.Group>
      <CustomLabel
        label="Ubicación de carpeta"
        icon={<Folder color="orange" />}
      />
      <Controller
        name="folderLocation.name"
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
            resource={"FOLDERLOCATION"}
            size="sm"
            placeholder={"Ubicación de carpeta"}
            query={GET_ALL_SUBDIRECTORIES_QUERY}
            mutations={folderLocationMutations}
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

export default SubdirectorySelect;

import { useState } from "react";
import {
  Alert,
  Button,
  Dropdown,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import {
  CheckCircle,
  DashCircle,
  InfoCircle,
  PencilSquare,
  PlusCircle,
  Trash,
  XCircle,
} from "react-bootstrap-icons";
import {
  UseFieldArrayReturn,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { useCustomMutation } from "../../../../hooks";
import {
  customSwalError,
  customSwalSuccess,
} from "../../../../utilities/alerts";
import { Observation } from "../../../ObservationPage/models/types";
import { Property } from "../../models/types";
import { useAuthStore } from "../../../../state/useAuthStore";
import { DropdownMenu } from "../../../../components/DropdownMenu";
import { toast } from "sonner";
import { gql, useMutation } from "@apollo/client";
import { GET_PROPERTY_BY_ID_QUERY } from "../../graphQL/types";

const CREATE_OBSERVATION_MUTATION = gql`
  mutation CreateObservation($propertyId: String, $input: ObservationInput) {
    observation: createObservation(propertyId: $propertyId, input: $input) {
      id
      observation
    }
  }
`;
const UPDATE_OBSERVATION_MUTATION = `
	mutation UpdateObservation($observationId: String, $input: ObservationInput) {
		observation: updateObservation(observationId: $observationId, input: $input) {
			observation
		}
	}
`;
const DELETE_OBSERVATION_MUTATION = `
	mutation DeleteObservation($observationId: String) {
		observation: deleteObservation(observationId: $observationId) {
			observation
		}
	}
`;
type ObservationInput = Pick<Observation, "observation">;
const ObservationItem: React.FC<
  { observation: Pick<Observation, "observation">; index: number } & Pick<
    UseFieldArrayReturn<Property, "observations">,
    "update" | "remove"
  >
> = ({ index, remove, update }) => {
  const { register, getValues } = useFormContext<Property>();
  const [createObservation] = useMutation<
    Observation,
    { propertyId: string; input: ObservationInput }
  >(CREATE_OBSERVATION_MUTATION, {
    onCompleted({ observation, id }) {
      customSwalSuccess(
        "Observación creada",
        "Se ha creado una nueva observación para este predio",
      );
      update(index, { observation, id });
    },
    onError(error) {
      remove(index);
      customSwalError(
        error.message,
        "Ocurrio un error al intentar crear una observación para este predio",
      );
    },
    refetchQueries: [
      { query: GET_PROPERTY_BY_ID_QUERY, variables: { id: getValues("id") } },
    ],
  });
  const [updateObservation] = useCustomMutation<
    Observation,
    { observationId: string; input: ObservationInput }
  >(UPDATE_OBSERVATION_MUTATION, {
    onSuccess() {
      customSwalSuccess(
        "Observación actualizada",
        "Se actualizo la observación de este predio",
      );
    },
    onError(error) {
      customSwalError(
        error,
        "Ocurrio un error al intentar acutalizar la observación de este predio",
      );
    },
  });
  const [deleteObservation] = useCustomMutation<
    Observation,
    { observationId: string }
  >(DELETE_OBSERVATION_MUTATION, {
    onSuccess() {
      remove(index);
      customSwalSuccess(
        "Observación eliminada",
        "Se ha eliminado correctamente la observación de este predio",
      );
    },
    onError(error) {
      customSwalError(
        error,
        "Ocurrio un error al intentar eliminar la observación de este predio",
      );
    },
  });

  const isNew = getValues(`observations.${index}.observation`).length === 0;
  const [edit, setEdit] = useState(false);
  const { can } = useAuthStore();
  const someCan =
    can("CREATE@OBSERVATION") ||
    can("DELETE@OBSERVATION") ||
    can("UPDATE@OBSERVATION");
  return (
    <InputGroup className="position-relative mb-2">
      <Form.Control
        as="textarea"
        rows={2}
        {...register(`observations.${index}.observation`)}
        placeholder="Observación..."
        disabled={!isNew && !edit}
        autoComplete="off"
      />
      {someCan && (
        <InputGroup.Text>
          <DropdownMenu>
            {isNew && can("CREATE@OBSERVATION") ? (
              <>
                {getValues("id") && (
                  <Dropdown.Item
                    onClick={() => {
                      if (
                        getValues(`observations.${index}.observation`)
                          .length === 0
                      ) {
                        toast.warning("La observación no debe estar vacia");
                      } else {
                        createObservation({
                          variables: {
                            propertyId: getValues("id"),
                            input: getValues(`observations.${index}`),
                          },
                        });
                      }
                    }}
                  >
                    <div className="d-flex gap-2 align-items-center">
                      <PlusCircle color="green" />
                      <div>Crear</div>
                    </div>
                  </Dropdown.Item>
                )}
                <Dropdown.Item
                  onClick={() => {
                    remove(index);
                  }}
                >
                  <div className="d-flex gap-2 align-items-center">
                    <DashCircle color="red" />
                    <div>Quitar</div>
                  </div>
                </Dropdown.Item>
              </>
            ) : edit && can("UPDATE@OBSERVATION") ? (
              <>
                <Dropdown.Item
                  onClick={() => {
                    if (
                      getValues(`observations.${index}.observation`).length ===
                      0
                    ) {
                      toast.warning("La observación no debe estar vacia");
                    } else {
                      updateObservation(
                        {
                          observationId: getValues(`observations.${index}.id`),
                          input: {
                            observation: getValues(`observations.${index}`)
                              .observation,
                          },
                        },
                        {
                          onSuccess() {
                            setEdit(false);
                          },
                        },
                      );
                    }
                  }}
                >
                  <div className="d-flex gap-2 align-items-center">
                    <CheckCircle color="green" />
                    <div>Confirmar</div>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setEdit(false);
                  }}
                >
                  <div className="d-flex gap-2 align-items-center">
                    <XCircle color="red" />
                    <div>Cancelar</div>
                  </div>
                </Dropdown.Item>
              </>
            ) : (
              <>
                {can("UPDATE@OBSERVATION") && (
                  <Dropdown.Item
                    onClick={() => {
                      setEdit(true);
                    }}
                  >
                    <div className="d-flex gap-2 align-items-center">
                      <PencilSquare color="blue" />
                      <div>Editar</div>
                    </div>
                  </Dropdown.Item>
                )}
                {can("DELETE@OBSERVATION") && (
                  <Dropdown.Item
                    onClick={() => {
                      deleteObservation({
                        observationId: getValues(`observations.${index}.id`),
                      });
                    }}
                  >
                    <div className="d-flex gap-2 align-items-center">
                      <Trash color="red" />
                      <div>Eliminar</div>
                    </div>
                  </Dropdown.Item>
                )}
              </>
            )}
          </DropdownMenu>
        </InputGroup.Text>
      )}
    </InputGroup>
  );
};

const ObservationList: React.FC = () => {
  const { control, getValues } = useFormContext<Property>();
  const { can } = useAuthStore();

  const {
    fields: observations,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: "observations",
  });

  return (
    <>
      {getValues("observations")?.length ? (
        observations.map((observation, index) => (
          <ObservationItem
            observation={observation}
            index={index}
            update={update}
            remove={remove}
          />
        ))
      ) : (
        <Row>
          <Alert className="d-flex flex-row gap-2" variant="info">
            <InfoCircle size={24} />
            Este predio aun no tiene observaciones
          </Alert>
        </Row>
      )}
      {can("CREATE@OBSERVATION") && (
        <Row>
          <Button
            size="sm"
            className="text-white"
            variant={
              observations.some(
                ({ observation }) => observation.length === 0,
              ) && !!getValues("id")
                ? "danger"
                : "info"
            }
            disabled={
              observations.some(
                ({ observation }) => observation.length === 0,
              ) && !!getValues("id")
            }
            onClick={() => {
              append({
                id: crypto.randomUUID(),
                observation: "",
              });
            }}
          >
            Añadir observación
          </Button>
        </Row>
      )}
    </>
  );
};

export default ObservationList;

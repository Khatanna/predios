import { useAuth, useCustomMutation } from "../../../../hooks";
import { Observation } from "../../../ObservationPage/models/types";
import {
  customSwalError,
  customSwalSuccess,
} from "../../../../utilities/alerts";
import { usePaginationStore } from "../../state/usePaginationStore";
import { UseFieldArrayReturn, useFormContext } from "react-hook-form";
import { Property } from "../../models/types";
import { Row, Form, InputGroup } from "react-bootstrap";
import { Tooltip } from "../../../../components/Tooltip";
import {
  Check,
  CheckCircle,
  DashCircle,
  HouseAdd,
  Pencil,
  PencilFill,
  PencilSquare,
  Plus,
  PlusCircle,
  Trash,
  X,
  XCircle,
} from "react-bootstrap-icons";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
export type ObservationListProps = {
  observations: Pick<Observation, "observation" | "id">[];
} & Pick<UseFieldArrayReturn<Property, "observations">, "update" | "remove">;

const CREATE_OBSERVATION_MUTATION = `
	mutation CreateObservation($propertyId: String, $input: ObservationInput) {
		observation: createObservation(propertyId: $propertyId, input: $input) {
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
> = ({ observation, index, update, remove }) => {
  const queryClient = useQueryClient();
  const {
    register,
    getValues,
    formState: { defaultValues },
  } = useFormContext<Property>();
  const [createObservation] = useCustomMutation<
    Observation,
    { propertyId: string; input: ObservationInput }
  >(CREATE_OBSERVATION_MUTATION, {
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["getPropertyById"] });
      customSwalSuccess(
        "Observación creada",
        "Se ha creado una nueva observación para este predio",
      );
    },
    onError(error) {
      remove(index);
      customSwalError(
        error,
        "Ocurrio un error al intentar crear una observación para este predio",
      );
    },
  });
  const [updateObservation] = useCustomMutation<
    Observation,
    { observationId: string; input: ObservationInput }
  >(UPDATE_OBSERVATION_MUTATION, {
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["getPropertyById"] });
      customSwalSuccess(
        "Observación actualizada",
        "Se ha acutalizado la obsevación de este predio",
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
      queryClient.invalidateQueries({ queryKey: ["getPropertyById"] });
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
  const { role } = useAuth();
  // const { property } = usePaginationStore();
  const length = defaultValues?.observations?.length ?? 0;
  const isNew = index >= length;
  const [edit, setEdit] = useState(false);
  return (
    <Row className="position-relative mb-2 pt-3">
      <Form.Control
        as="textarea"
        rows={2}
        {...register(`observations.${index}.observation`)}
        placeholder="Observación..."
        disabled={!edit && !isNew}
        autoFocus={!edit || isNew}
        autoComplete="off"
      />
      <div
        className={
          "position-absolute top-0 end-0 mt-2 d-flex gap-1 justify-content-end"
        }
      >
        {role === "Administrador" && (
          <>
            {isNew ? (
              <>
                {!!getValues("id") && (
                  <Tooltip label="Crear observación">
                    <PlusCircle
                      color="green"
                      className="float-end"
                      role="button"
                      onClick={() => {
                        createObservation({
                          propertyId: getValues("id"),
                          input: {
                            observation: getValues(`observations.${index}`)
                              .observation,
                          },
                        });
                      }}
                    />
                  </Tooltip>
                )}
                <Tooltip label="Quitar observación">
                  <DashCircle
                    color="red"
                    className="float-end"
                    role="button"
                    onClick={() => {
                      remove(index);
                    }}
                  />
                </Tooltip>
              </>
            ) : edit ? (
              <>
                <Tooltip label="Confirmar">
                  <CheckCircle
                    color="green"
                    className="float-end"
                    role="button"
                    onClick={() => {
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
                    }}
                  />
                </Tooltip>
                <Tooltip label="Cancelar">
                  <XCircle
                    color="red"
                    className="float-end"
                    role="button"
                    onClick={() => {
                      setEdit(false);
                    }}
                  />
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip label="Editar observación">
                  <PencilSquare
                    color="blue"
                    className="float-end"
                    role="button"
                    onClick={() => {
                      setEdit(true);
                    }}
                  />
                </Tooltip>
                <Tooltip label="Borrar observación">
                  <Trash
                    color="red"
                    className="float-end"
                    role="button"
                    onClick={() => {
                      deleteObservation({
                        observationId: getValues(`observations.${index}.id`),
                      });
                    }}
                  />
                </Tooltip>
              </>
            )}
          </>
        )}
      </div>
    </Row>
  );
};

const ObservationList: React.FC<ObservationListProps> = ({
  observations,
  ...props
}) => {
  return observations.map((observation, index) => (
    <ObservationItem observation={observation} index={index} {...props} />
  ));
};

export default ObservationList;

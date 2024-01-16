import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import {
  CheckSquare,
  DashSquare,
  InfoCircle,
  PencilSquare,
  PlusSquare,
  XSquare,
} from "react-bootstrap-icons";
import {
  UseFieldArrayReturn,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { Tooltip } from "../../../../components/Tooltip";
import { useCustomMutation } from "../../../../hooks";
import {
  customSwalError,
  customSwalSuccess,
} from "../../../../utilities/alerts";
import { Tracking } from "../../../TrackingPage/models/types";
import { Property } from "../../models/types";
import { SelectUser } from "../SelectUser";
import { StateSelect } from "../StateSelect";

const CREATE_TRACKING_MUTATION = `
	mutation CreateTraking($propertyId: String, $input: TrackingInput) {
		tracking: createTracking(propertyId: $propertyId, input: $input) {
			observation
		}
	}
`;

const DELETE_TRACKING_MUTATION = `
	mutation DeleteTraking($propertyId: String, $id: String) {
		tracking: deleteTracking(propertyId: $propertyId, id: $id) {
			observation
		}
	}
`;

const UPDATE_TRACKING_MUTATION = `
	mutation UpdateTraking($trackingId: String, $input: TrackingInput) {
		tracking: updateTracking(trackingId: $trackingId, input: $input) {
			observation
		}
	}
`;

export type TrackingListProps = Pick<Property, "trackings"> &
  Pick<UseFieldArrayReturn<Property, "trackings">, "remove" | "update">;
type TrackingInput = Pick<
  Tracking,
  "state" | "dateOfInit" | "numberOfNote" | "observation" | "responsible" | "id"
>;
const TrackingItem: React.FC<
  { tracking: TrackingInput; index: number } & Pick<
    UseFieldArrayReturn<Property, "trackings">,
    "remove" | "update"
  >
> = ({ index, remove, update }) => {
  const queryClient = useQueryClient();
  const {
    register,
    getValues,
    formState: { defaultValues },
  } = useFormContext<Property>();
  const isNew = index >= (defaultValues?.trackings?.length ?? 0);
  const [edit, setEdit] = useState(false);
  const [create] = useCustomMutation<
    Tracking,
    { propertyId: string; input: TrackingInput }
  >(CREATE_TRACKING_MUTATION, {
    onSuccess(_data, { input }) {
      update(index, input);
      queryClient.invalidateQueries({ queryKey: ["getPropertyById"] });
      customSwalSuccess(
        "Seguimiento creado",
        "Se ha creado un nuevo seguimiento para este predio",
      );
    },
    onError(error) {
      remove(index);
      customSwalError(
        error,
        "Ocurrio un error al intentar crear el seguimientos",
      );
    },
  });
  const [deleteT] = useCustomMutation<
    Tracking,
    { propertyId: string; id: string }
  >(DELETE_TRACKING_MUTATION, {
    onSuccess() {
      customSwalSuccess(
        "Seguimiento eliminado",
        "Se ha eliminado un nuevo seguimiento para este predio",
      );
      queryClient.invalidateQueries({ queryKey: ["getPropertyById"] });
      remove(index);
    },
    onError(error) {
      customSwalError(
        error,
        "Ocurrio un error al intentar eliminar el seguimiento",
      );
    },
  });

  const [updateT] = useCustomMutation<
    Tracking,
    { trackingId: string; input: TrackingInput }
  >(UPDATE_TRACKING_MUTATION, {
    onSuccess(_data, { input }) {
      customSwalSuccess(
        "Seguimiento actualizdado",
        "Se ha actualizdado el seguimiento de este predio",
      );
      queryClient.invalidateQueries({ queryKey: ["getPropertyById"] });
      update(index, input);
    },
    onError(error, { input }) {
      update(index, input);
      customSwalError(
        error,
        "Ocurrio un error al intentar actualizar el seguimiento",
      );
    },
  });

  const createTracking = () => {
    create({
      propertyId: getValues("id"),
      input: getValues(`trackings.${index}`),
    });
  };
  const deleteTracking = () => {
    deleteT({
      propertyId: getValues("id"),
      id: getValues(`trackings.${index}`).id,
    });
  };

  return (
    <Row className="border border-1 border-dark-subtle d-flex py-2 rounded-1 position-relative mb-2">
      <Col>
        <Form.Group>
          {/* <StateSelect name={`trackings.${index}.state.name`} /> */}
        </Form.Group>
      </Col>
      <Col xs={2}>
        <Form.Group>
          <Form.Label className="fw-bold">Fecha de inicio:</Form.Label>
          <Form.Control
            type="date"
            {...register(`trackings.${index}.dateOfInit`)}
            size="sm"
            disabled={!edit && !isNew}
            placeholder="Fecha de inicio"
          />
        </Form.Group>
      </Col>
      <Col>
        <Form.Group>
          <Form.Label className="fw-bold">Responsable:</Form.Label>
          <SelectUser
            isDisabled={!isNew && !edit}
            name={`trackings.${index}.responsible.username`}
            user={`trackings.${index}.responsible`}
            placeholder="Responsable"
          />
        </Form.Group>
      </Col>
      <Col xs={2}>
        <Form.Group>
          <Form.Label className="fw-bold"># Nota:</Form.Label>

          <Form.Control
            {...register(`trackings.${index}.numberOfNote`)}
            disabled={!edit && !isNew}
            size="sm"
            placeholder="# Nota"
          />
        </Form.Group>
      </Col>
      <Col xs={3} className="">
        <Form.Group>
          <Form.Label className="fw-bold">Observación:</Form.Label>
          <Form.Control
            {...register(`trackings.${index}.observation`)}
            disabled={!edit && !isNew}
            size="sm"
            as="textarea"
            rows={1}
            placeholder="Observación"
          />
        </Form.Group>
      </Col>
      {"administrador" === "administrador" && (
        <div
          className={
            "position-absolute top-0 left-0 mt-1 d-flex gap-1 justify-content-end"
          }
        >
          {isNew ? (
            <>
              {Boolean(getValues("id")) && (
                <Tooltip label="Crear seguimiento">
                  <PlusSquare
                    color="green"
                    className="float-end"
                    role="button"
                    fontSize={16}
                    onClick={() => createTracking()}
                  />
                </Tooltip>
              )}
              <Tooltip label="Quitar seguimiento">
                <DashSquare
                  color="orange"
                  className="float-end"
                  role="button"
                  fontSize={16}
                  onClick={() => remove(index)}
                />
              </Tooltip>
            </>
          ) : (
            <>
              {!edit && getValues("id") ? (
                <>
                  <Tooltip label="Editar seguimiento">
                    <PencilSquare
                      color="blue"
                      className="float-end"
                      role="button"
                      fontSize={16}
                      onClick={() => setEdit(true)}
                    />
                  </Tooltip>
                  <Tooltip label="Borrar seguimiento">
                    <XSquare
                      color="red"
                      className="float-end"
                      role="button"
                      fontSize={16}
                      onClick={() => deleteTracking()}
                    />
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip label="Cancelar">
                    <XSquare
                      color="brown"
                      className="float-end"
                      role="button"
                      fontSize={16}
                      onClick={() => {
                        setEdit(false);
                      }}
                    />
                  </Tooltip>
                  <Tooltip label="Actualizar seguimiento">
                    <CheckSquare
                      color="green"
                      className="float-end"
                      role="button"
                      fontSize={16}
                      onClick={() => {
                        updateT({
                          trackingId: getValues(`trackings.${index}.id`),
                          input: { ...getValues(`trackings.${index}`) },
                        });
                        setEdit(false);
                      }}
                    />
                  </Tooltip>
                </>
              )}
            </>
          )}
        </div>
      )}
    </Row>
  );
};

const TrackingList: React.FC = () => {
  const { control } = useFormContext<Property>();
  const {
    fields: trackings,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: "trackings",
  });
  return (
    <Col>
      {trackings.length ? (
        trackings.map((tracking, index) => (
          <TrackingItem
            tracking={tracking}
            index={index}
            remove={remove}
            update={update}
            key={crypto.randomUUID()}
          />
        ))
      ) : (
        <Row>
          <Alert className="d-flex flex-row gap-2" variant="info">
            <InfoCircle size={24} />
            Este predio aun no tiene seguimientos
          </Alert>
        </Row>
      )}
      {"administrador" === "administrador" && (
        <Row>
          <Button
            size="sm"
            className="text-white"
            variant="info"
            onClick={() =>
              append({
                id: crypto.randomUUID(),
                numberOfNote: "",
                observation: "",
                state: {
                  name: "undefined",
                },
                dateOfInit: new Date().toISOString().substring(0, 10),
              })
            }
          >
            Añadir seguimiento
          </Button>
        </Row>
      )}
    </Col>
  );
};

export default TrackingList;

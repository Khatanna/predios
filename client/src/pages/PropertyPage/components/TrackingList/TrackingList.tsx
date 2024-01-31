import { gql, useMutation } from "@apollo/client";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { InfoCircle, Trash } from "react-bootstrap-icons";
import {
  UseFieldArrayReturn,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { toast } from "sonner";
import { Tooltip } from "../../../../components/Tooltip";
import { useAuthStore } from "../../../../state/useAuthStore";
import { Tracking } from "../../../TrackingPage/models/types";
import { Property } from "../../models/types";
import { CustomInput } from "../CustomInput";
import { SelectUser } from "../SelectUser";
import { StateSelect } from "../StateSelect";

const sortByDateOfString = (a: string, b: string) =>
  new Date(a).getTime() - new Date(b).getTime();

const CREATE_TRACKING_MUTATION = gql`
  mutation CreateTraking($propertyId: String, $input: TrackingInput) {
    tracking: createTracking(propertyId: $propertyId, input: $input) {
      id
      observation
      dateOfInit
      numberOfNote
      responsible {
        names
        firstLastName
        secondLastName
        username
      }
      state {
        name
      }
    }
  }
`;

const DELETE_TRACKING_MUTATION = gql`
  mutation DeleteTraking($id: String) {
    tracking: deleteTracking(id: $id) {
      observation
    }
  }
`;

export type TrackingListProps = Pick<Property, "trackings"> &
  Pick<UseFieldArrayReturn<Property, "trackings">, "remove" | "update">;
type TrackingInput = Pick<
  Tracking,
  "state" | "dateOfInit" | "numberOfNote" | "observation" | "responsible"
>;
const TrackingItem: React.FC<
  { index: number } & Pick<
    UseFieldArrayReturn<Property, "trackings">,
    "remove" | "update"
  >
> = ({ index, remove }) => {
  const { getValues, setValue } = useFormContext<Property>();

  const [deleteMutation] = useMutation<{ tracking: Tracking }, { id: string }>(
    DELETE_TRACKING_MUTATION,
    {
      onCompleted() {
        remove(index);
      },
    },
  );

  const { can } = useAuthStore();
  const handleDelete = () => {
    if (getValues("id")) {
      toast.promise(
        deleteMutation({
          variables: {
            id: getValues(`trackings.${index}.id`)!,
          },
        }),
        {
          loading: "Eliminando seguimiento",
          success: "Seguimiento eliminado",
          error: (e) => e?.message ?? "Ocurrio un error",
        },
      );
    } else {
      remove(index);
    }
  };

  return (
    <Row className="border border-1 border-dark-subtle d-flex py-2 rounded-1 position-relative mb-2">
      <Col>
        <Form.Group>
          <StateSelect name={`trackings.${index}.state.name`} />
        </Form.Group>
      </Col>
      <Col xs={2}>
        <Form.Group>
          <Form.Label className="fw-bold">Fecha:</Form.Label>
          <CustomInput
            type="date"
            name={`trackings.${index}.dateOfInit`}
            size="sm"
            params={getValues(`trackings.${index}.id`)}
            options={{
              onBlur() {
                setValue(
                  "trackings",
                  getValues("trackings").sort((a, b) =>
                    sortByDateOfString(b.dateOfInit, a.dateOfInit),
                  ),
                );
              },
            }}
            placeholder="Fecha"
          />
        </Form.Group>
      </Col>
      <Col>
        <Form.Group>
          <Form.Label className="fw-bold">Responsable:</Form.Label>
          <SelectUser
            name={`trackings.${index}.responsible.username`}
            placeholder="Responsable"
          />
        </Form.Group>
      </Col>
      <Col xs={2}>
        <Form.Group>
          <Form.Label className="fw-bold"># Nota:</Form.Label>
          <CustomInput
            name={`trackings.${index}.numberOfNote`}
            size="sm"
            as="textarea"
            rows={1}
            placeholder="# Nota"
          />
        </Form.Group>
      </Col>
      <Col xs={3} className="">
        <Form.Group>
          <Form.Label className="fw-bold">Observación:</Form.Label>
          <CustomInput
            name={`trackings.${index}.observation`}
            size="sm"
            as="textarea"
            rows={1}
            placeholder="Observación"
          />
        </Form.Group>
      </Col>
      {can("DELETE@TRACKING") && (
        <div className={"position-absolute top-0 end-0 mt-2"}>
          <Tooltip label="Borrar seguimiento">
            <Trash
              color="red"
              className="float-end"
              role="button"
              fontSize={16}
              onClick={handleDelete}
            />
          </Tooltip>
        </div>
      )}
    </Row>
  );
};

const TrackingList: React.FC = () => {
  const { control, getValues } = useFormContext<Property>();
  const { can } = useAuthStore();
  const {
    fields: trackings,
    prepend,
    remove,
    update,
  } = useFieldArray({
    control,
    name: "trackings",
  });

  const [create] = useMutation<
    { tracking: Tracking },
    { propertyId: string; input: TrackingInput }
  >(CREATE_TRACKING_MUTATION, {
    onCompleted({ tracking }) {
      prepend(tracking);
    },
    onError() {
      toast.error("Ocurrio un error, intentelo más tarde")
    },
  });

  return (
    <Col>
      {getValues("trackings")?.length ? (
        trackings.map((_tracking, index) => (
          <TrackingItem
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

      {can("CREATE@TRACKING") && (
        <Row>
          <Button
            size="sm"
            className="text-white"
            variant="info"
            onClick={() => {
              if (getValues("id")) {
                create({
                  variables: {
                    propertyId: getValues("id"),
                    input: {
                      numberOfNote: "",
                      observation: "",
                      state: {
                        name: "undefined",
                      },
                      dateOfInit: new Date().toISOString().substring(0, 10),
                    },
                  },
                });
              } else {
                prepend({
                  numberOfNote: "",
                  observation: "",
                  state: {
                    name: "undefined",
                  },
                  dateOfInit: new Date().toISOString().substring(0, 10),
                });
              }
            }}
          >
            Añadir seguimiento
          </Button>
        </Row>
      )}
    </Col>
  );
};

export default TrackingList;

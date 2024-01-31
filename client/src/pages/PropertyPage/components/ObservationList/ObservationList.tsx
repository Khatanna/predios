import { gql, useMutation } from "@apollo/client";
import {
  Alert,
  Button,
  InputGroup,
  Row
} from "react-bootstrap";
import {
  InfoCircle,
  Trash
} from "react-bootstrap-icons";
import {
  UseFieldArrayReturn,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { toast } from "sonner";
import { Tooltip } from "../../../../components/Tooltip";
import { useAuthStore } from "../../../../state/useAuthStore";
import { Observation } from "../../../ObservationPage/models/types";
import { Property } from "../../models/types";
import { CustomInput } from "../CustomInput";

const CREATE_OBSERVATION_MUTATION = gql`
  mutation CreateObservation($propertyId: String, $input: ObservationInput) {
    observation: createObservation(propertyId: $propertyId, input: $input) {
      id
      observation
    }
  }
`;

const DELETE_OBSERVATION_MUTATION = gql`
	mutation DeleteObservation($observationId: String) {
		observation: deleteObservation(observationId: $observationId) {
			observation
		}
	}
`;
type ObservationInput = Pick<Observation, "observation">;
const ObservationItem: React.FC<
  { index: number } & Pick<
    UseFieldArrayReturn<Property, "observations">,
    "update" | "remove"
  >
> = ({ index, remove }) => {
  const { getValues } = useFormContext<Property>();

  const [deleteMutation] = useMutation<
    Observation,
    { observationId: string }
  >(DELETE_OBSERVATION_MUTATION);
  const handleDelete = () => {
    if (getValues("id")) {
      toast.promise(
        deleteMutation({
          variables: {
            observationId: getValues(`observations.${index}.id`)!,
          },
        }),
        {
          loading: "Eliminando observación",
          success: () => {
            remove(index);
            return "Se elimino la observación"
          },
          error: (e) => e?.message ?? "Ocurrio un error",
        },
      );
    } else {
      remove(index);
    }
  }
  const { can } = useAuthStore();

  return (
    <InputGroup className="position-relative mb-2">
      <CustomInput
        name={`observations.${index}.observation`}
        placeholder="Observación..."
        as="textarea"
        params={getValues(`observations.${index}.id`)}
        rows={2}
        disabled={!getValues('id') || !getValues(`observations.${index}.id`)}
        noWrap
      />
      {can("DELETE@OBSERVATION") && (
        <div className={"position-absolute top-0 end-0 mt-2 me-3"}>
          <Tooltip label="Borrar observaciónO">
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

  const [create] = useMutation<
    { observation: Observation },
    { propertyId: string; input: ObservationInput }
  >(CREATE_OBSERVATION_MUTATION, {
    onCompleted({ observation }) {
      append(observation)
    },
    onError() {
      toast.error("Ocurrio un error, intentelo más tarde")
    },
  });

  const handleCreate = () => {
    if (getValues('id')) {
      create({
        variables: {
          propertyId: getValues('id'),
          input: {
            observation: ''
          }
        }
      })
    } else {
      append({
        id: crypto.randomUUID(),
        observation: "",
      });
    }
  }

  return (
    <>
      {getValues("observations")?.length ? (
        observations.map((_observation, index) => (
          <ObservationItem
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
            variant="info"
            onClick={handleCreate}
          >
            Añadir observación
          </Button>
        </Row>
      )}
    </>
  );
};

export default ObservationList;

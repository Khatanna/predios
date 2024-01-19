import { Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { FormCreateProps } from "../../models/types";
import { useCustomQuery } from "../../../../hooks/useCustomQuery";
import { Stage } from "../../../StagePage/models/types";
import {
  useStageMutations,
  useStateMutations,
  useStageStore,
} from "../../hooks/useRepository";
import { State } from "../../../StatePage/models/types";
import { EnhancedSelect } from "../EnhancedSelect";
import {
  customSwalError,
  customSwalSuccess,
} from "../../../../utilities/alerts";
import { useModalStore } from "../../../../state/useModalStore";
import { ExclamationTriangle } from "react-bootstrap-icons";

type InputState = Pick<State, "name" | "order" | "stage">;

const GET_ALL_STAGES_QUERY = `
  query getAllStages {
    stages: getAllStages {
      name
    }
  }
`;
const StateFormCreate: React.FC<FormCreateProps> = ({ onHide }) => {
  const { register, handleSubmit, control, watch, getValues, resetField } =
    useForm<State>();
  const { mutationCreate } = useStateMutations<{ state: State }, InputState>();
  const { mutationDelete } = useStageMutations<{ stage: Stage }>();
  const { items: stages, setItems: setStages } = useStageStore();
  const stage = watch("stage.name");
  const setModal = useModalStore((s) => s.setModal);
  const { error, isLoading } = useCustomQuery<{ stages: Stage[] }>(
    GET_ALL_STAGES_QUERY,
    ["getAllStages"],
    {
      onSuccess({ stages }) {
        setStages(stages);
      },
    },
  );

  return (
    <Form
      onSubmit={handleSubmit(({ name, order, stage }) => {
        mutationCreate(
          { input: { name, order, stage } },
          {
            onSuccess({
              data: {
                state: { name },
              },
            }) {
              customSwalSuccess(
                "Nuevo Estado agregado",
                `El estado ${name} se ha creado correctamente`,
              );
            },
            onError(error, { input: { name } }) {
              customSwalError(
                error.response!.data.errors[0].message,
                `Ocurrio un error al intentar crear el estado ${name}`,
              );
            },
            onSettled() {
              onHide();
            },
          },
        );
      })}
    >
      <Row>
        <Col className="d-flex gap-3 flex-column">
          <Row>
            <Col>
              <Form.Label>Estado</Form.Label>
              <Form.Control
                {...register("name")}
                placeholder="Nombre"
              ></Form.Control>
            </Col>
            <Col>
              <Form.Label>Orden</Form.Label>
              <Form.Control
                {...register("order")}
                placeholder="Orden"
              ></Form.Control>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Etapa</Form.Label>
              {isLoading ? (
                <div className="d-flex justify-content-center ">
                  <Spinner variant="warning" />
                </div>
              ) : error ? (
                <Alert>
                  <Alert.Heading>
                    <div className="d-flex align-content-center gap-2">
                      <ExclamationTriangle size={24} color="red" />
                      <div>No tienes permisos</div>
                    </div>
                  </Alert.Heading>
                  {error}
                </Alert>
              ) : (
                <Controller
                  name="stage.name"
                  control={control}
                  defaultValue="undefined"
                  render={({ field }) => (
                    <EnhancedSelect
                      {...field}
                      placeholder="Etapa"
                      options={stages.map(({ name }) => ({
                        label: name,
                        value: name,
                      }))}
                      onCreate={() => {
                        setModal({
                          show: true,
                          form: "createStage",
                          title: "Crear etapa",
                        });
                      }}
                      onEdit={() => {
                        setModal({
                          show: true,
                          form: "updateStage",
                          title: "Actualizar etapa",
                          params: { name: stage },
                        });
                      }}
                      onDelete={() => {
                        const stage = getValues("stage");

                        if (stage) {
                          mutationDelete(stage, {
                            onSuccess({
                              data: {
                                stage: { name },
                              },
                            }) {
                              customSwalSuccess(
                                "Etapa eliminada",
                                `La etapa ${name} se ha eliminado correctamente`,
                              );
                            },
                            onError(error, { name }) {
                              customSwalError(
                                error.response!.data.errors[0].message,
                                `Ocurrio un error al intentar eliminar la etapa ${name}`,
                              );
                            },
                            onSettled() {
                              resetField("stage.name");
                            },
                          });
                        }
                      }}
                    />
                  )}
                />
              )}
            </Col>
          </Row>
          <Row className="mt-3">
            <Col className="d-flex justify-content-end gap-2">
              <Button variant="danger" onClick={onHide}>
                Cancelar
              </Button>
              <Button type="submit" variant="success" className="text-white">
                Crear Estado
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};

export default StateFormCreate;

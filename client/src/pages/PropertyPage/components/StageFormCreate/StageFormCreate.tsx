import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import {
  customSwalError,
  customSwalSuccess,
} from "../../../../utilities/alerts";
import { Stage } from "../../../StagePage/models/types";
import { useStageMutations } from "../../hooks/useRepository";
import { FormCreateProps } from "../../models/types";
import { useModalStore } from "../../../../state/useModalStore";

const StageFormCreate: React.FC<FormCreateProps> = ({ onHide }) => {
  const { register, handleSubmit } = useForm<Stage>();
  const { mutationCreate } = useStageMutations<{ stage: Stage }>();
  const setModal = useModalStore((s) => s.setModal);
  return (
    <Form
      onSubmit={handleSubmit((data) => {
        mutationCreate(
          { input: data },
          {
            onSuccess({
              data: {
                stage: { name },
              },
            }) {
              customSwalSuccess(
                "Nueva etapa agregado",
                `La etapa ${name} se ha creado correctamente`,
              );
            },
            onError(error, { input: { name } }) {
              customSwalError(
                error.response!.data.errors[0].message,
                `Ocurrio un error al intentar crear la etapa ${name}`,
              );
            },
            onSettled() {
              onHide();
              setModal({
                form: "createState",
                show: true,
                title: "Crear estado",
              });
            },
          },
        );
      })}
    >
      <Row>
        <Col className="d-flex gap-3 flex-column">
          <Row>
            <Col>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                {...register("name")}
                placeholder="Nombre"
              ></Form.Control>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col className="d-flex justify-content-end gap-2">
              <Button
                variant="danger"
                onClick={() => {
                  onHide();
                  setModal({
                    form: "createState",
                    show: true,
                    title: "Crear estado",
                  });
                }}
              >
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

export default StageFormCreate;

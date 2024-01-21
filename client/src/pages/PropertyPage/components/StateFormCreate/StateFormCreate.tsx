import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { SelectNameable } from "../../../../components/SelectNameable";
import { useModalStore } from "../../../../state/useModalStore";
import { State } from "../../../StatePage/models/types";
import { GET_ALL_STATES_QUERY } from "../StateSelect/StateSelect";

type InputState = Pick<State, "name" | "stage">;

const GET_ALL_STAGES_QUERY = gql`
  query GetAllStages {
    options: getAllStages {
      name
    }
  }
`;

const GET_STATE_BY_NAME = gql`
  query GetState($name: String) {
    state: getState(name: $name) {
      name
      stage {
        name
      }
    }
  }
`;

const CREATE_STATE_MUTATION = gql`
  mutation CreateState($input: StateInput) {
    state: createState(input: $input) {
      name
    }
  }
`;

const UPDATE_STATE_MUTATION = gql`
  mutation UpdateState($name: String, $item: StateInput) {
    state: updateState(name: $name, item: $item) {
      name
    }
  }
`;

const stageMutations = {
  create: gql`
    mutation CreateStage($name: String) {
      result: createStage(name: $name) {
        name
      }
    }
  `,
  update: gql`
    mutation UpdateStage($currentName: String, $name: String) {
      result: updateStage(currentName: $currentName, name: $name) {
        name
      }
    }
  `,
  delete: gql`
    mutation DeleteStage($name: String) {
      result: deleteStage(name: $name) {
        name
      }
    }
  `,
};

const StateFormCreate: React.FC = () => {
  const { closeModal, value } = useModalStore();
  const [getState] = useLazyQuery<{ state: State }, { name?: string }>(
    GET_STATE_BY_NAME,
  );
  const { register, handleSubmit, control, reset, getFieldState } =
    useForm<State>({
      defaultValues: () =>
        getState({ variables: { name: value } }).then(
          ({ data }) => data!.state,
        ),
    });
  const [createMutation] = useMutation<{ state: State }, { input: InputState }>(
    CREATE_STATE_MUTATION,
    {
      refetchQueries: [{ query: GET_ALL_STATES_QUERY }],
    },
  );
  const [updateMutation] = useMutation<
    { state: State },
    { name: string; item: InputState }
  >(UPDATE_STATE_MUTATION, {
    refetchQueries: [
      { query: GET_STATE_BY_NAME, variables: { name: value } },
      { query: GET_ALL_STATES_QUERY },
    ],
  });

  const submit: SubmitHandler<State> = (data) => {
    if (!value) {
      toast.promise(
        createMutation({
          variables: {
            input: data,
          },
        }),
        {
          loading: "Creando estado",
          success: "Se ha creado un nuevo estado",
          error: "Ocurrio un error, intente más tarde",
          finally: reset,
        },
      );
    } else {
      toast.promise(
        updateMutation({
          variables: {
            name: value,
            item: data,
          },
        }),
        {
          loading: "Actualizando estado",
          success: "Se ha actualizado el estado",
          error: "Ocurrio un error, intente más tarde",
        },
      );
    }
  };
  return (
    <Form onSubmit={handleSubmit(submit)}>
      <Modal.Body>
        <Row>
          <Col>
            <Form.Label>Estado</Form.Label>
            <Form.Control
              {...register("name", {
                required: {
                  value: !value,
                  message: "Este campo es obligatorio",
                },
              })}
              placeholder="Nombre"
              isValid={
                getFieldState("name").isTouched &&
                !getFieldState("name").error?.message
              }
              isInvalid={!!getFieldState("name").error?.message}
            />
            <Form.Control.Feedback type="invalid">
              {getFieldState("name").error?.message}
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label>Etapa</Form.Label>
            <Controller
              name="stage.name"
              control={control}
              defaultValue="undefined"
              rules={
                !value
                  ? {
                      pattern: {
                        value: /^(?!undefined$).*$/gi,
                        message: "Este campo es obligatorio",
                      },
                      required: {
                        value: true,
                        message: "Este campo es obligatorio",
                      },
                    }
                  : undefined
              }
              render={({ field }) => (
                <SelectNameable
                  {...field}
                  query={GET_ALL_STAGES_QUERY}
                  placeholder={"Etapa"}
                  isValid={
                    getFieldState(field.name).isTouched &&
                    !getFieldState(field.name).error?.message
                  }
                  isInvalid={!!getFieldState(field.name).error?.message}
                  resource="STAGE"
                  fetchPolicy="no-cache"
                  mutations={stageMutations}
                  error={
                    <Form.Control.Feedback type="invalid">
                      {getFieldState(field.name).error?.message}
                    </Form.Control.Feedback>
                  }
                />
              )}
            />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={closeModal}>
          Cancelar
        </Button>
        <Button type="submit" variant="success" className="text-white">
          {value ? "Actualizar" : "Crear"} Estado
        </Button>
      </Modal.Footer>
    </Form>
  );
};

export default StateFormCreate;

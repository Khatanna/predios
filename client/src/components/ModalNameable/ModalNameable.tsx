import { DocumentNode } from "graphql";
import { Resource } from "../../pages/UserPage/components/Permission/Permission";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import { mutationMessages, resources } from "../../utilities/constants";
import { createPortal } from "react-dom";
import { Button, Form, FormGroup, Modal } from "react-bootstrap";

export type ModalNameableProps = {
  query: DocumentNode;
  resource: Resource;
  show: boolean;
  createMode: boolean;
  isSelected: boolean;
  value: string;
  mutations: Record<"create" | "update" | "delete", DocumentNode>;
  closeModal: () => void;
};

const ModalNameable: React.FC<ModalNameableProps> = ({
  query,
  show,
  createMode,
  isSelected,
  resource,
  closeModal,
  value,
  mutations,
}) => {
  const { register, handleSubmit, reset } = useForm<{ name: string }>({
    defaultValues: { name: value },
  });
  const [createMutation] = useMutation<
    { result: { name: string } },
    { name: string }
  >(mutations.create, {
    refetchQueries: [query],
  });
  const [updateMutation] = useMutation<
    { result: { name: string } },
    { currentName: string; name: string }
  >(mutations.update, {
    refetchQueries: [query],
  });
  const submit = ({ name }: { name: string }) => {
    if (isSelected && !createMode) {
      toast.promise(
        updateMutation({
          variables: {
            currentName: value,
            name,
          },
        }),
        {
          loading: `Actualizando ${resources[resource]}: ${value}`,
          success:
            mutationMessages[`UPDATE_${resource}`].getSuccessMessage(value),
          error: mutationMessages[`UPDATE_${resource}`].getErrorMessage(value),
          finally() {
            reset();
            closeModal();
          },
        },
      );
    } else {
      toast.promise(
        createMutation({
          variables: {
            name,
          },
        }),
        {
          loading: `Creando ${resources[resource]}: ${value}`,
          success:
            mutationMessages[`CREATE_${resource}`].getSuccessMessage(value),
          error: mutationMessages[`CREATE_${resource}`].getErrorMessage(value),
          finally() {
            reset();
            closeModal();
          },
        },
      );
    }
  };
  const onClose = () => {
    reset();
    closeModal();
  };
  return createPortal(
    <Modal show={show} centered onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isSelected && !createMode ? "Actualizar" : "Crear"}{" "}
          {resources[resource]}
        </Modal.Title>
      </Modal.Header>
      <Form
        id="modal"
        className="d-flex gap-2 flex-column"
        onSubmit={handleSubmit(submit)}
      >
        <Modal.Body>
          <FormGroup>
            <Form.Label>{resources[resource]}:</Form.Label>
            <Form.Control
              placeholder={resources[resource]}
              {...register("name")}
            />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="success" className="text-white">
            {isSelected && !createMode ? "Actualizar" : "Crear"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>,
    document.getElementById("modal")!,
  );
};

export default ModalNameable;

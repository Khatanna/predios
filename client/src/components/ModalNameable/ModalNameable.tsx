import { Button, Form, FormGroup, Modal } from "react-bootstrap";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useModalStore } from "../../state/useModalStore";
import { resources } from "../../utilities/constants";
import { toast } from "sonner";

const ModalNameable: React.FC = () => {
  const {
    show,
    title,
    closeModal,
    resource,
    value,
    createMutation,
    updateMutation,
  } = useModalStore();
  const { register, handleSubmit, reset } = useForm<{ name: string }>();

  const onClose = () => {
    reset();
    closeModal();
  };

  const submit = ({ name }: { name: string }) => {
    if (value) {
      updateMutation(value, name);
    } else {
      createMutation(name);
    }
  };

  return createPortal(
    <Modal show={show} centered onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form
        id="formModal"
        className="d-flex gap-2 flex-column"
        onSubmit={handleSubmit(submit)}
      >
        <Modal.Body>
          <FormGroup>
            <Form.Label>{resources[resource]}:</Form.Label>
            <Form.Control
              placeholder={resources[resource]}
              {...register("name", {
                value: value ? value : "",
              })}
            />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="success" className="text-white">
            {value ? "Actualizar" : "Crear"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>,
    document.getElementById("modal")!,
  );
};

export default ModalNameable;

import { useForm } from "react-hook-form";
import { useModalStore } from "../../../../state/useModalStore";
import { Button, Form, FormGroup, Modal } from "react-bootstrap";
import { resources } from "../../../../utilities/constants";

const FormNameable = () => {
  const { register, handleSubmit, reset } = useForm<{ name: string }>();
  const { closeModal, resource, value, createMutation, updateMutation } =
    useModalStore();
  const submit = ({ name }: { name: string }) => {
    if (value) {
      updateMutation(value, name);
    } else {
      createMutation(name);
    }
  };

  const onClose = () => {
    reset();
    closeModal();
  };

  return (
    <Form className="d-flex gap-2 flex-column" onSubmit={handleSubmit(submit)}>
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
  );
};

export default FormNameable;

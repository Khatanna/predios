import { Modal } from "react-bootstrap";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { forms, useModalStore } from "../../state/useModalStore";

const ModalNameable: React.FC = () => {
  const { show, title, closeModal, form } = useModalStore();
  const { reset } = useForm<{ name: string }>();
  const Form = forms[form];
  const onClose = () => {
    reset();
    closeModal();
  };

  return createPortal(
    <Modal show={show} centered onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form />
    </Modal>,
    document.getElementById("modal")!,
  );
};

export default ModalNameable;

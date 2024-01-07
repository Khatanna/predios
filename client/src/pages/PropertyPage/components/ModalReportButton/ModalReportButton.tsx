import { useState } from "react";
import { Tooltip } from "../../../../components/Tooltip";
import { FiletypeXlsx } from "react-bootstrap-icons";
import { Modal } from "react-bootstrap";
import { FormReport } from "../FormReport";

const ModalReportButton: React.FC<{ max: number }> = ({ max }) => {
  const [show, setShow] = useState(false);
  return (
    <>
      <Tooltip label="Generar reporte">
        <FiletypeXlsx
          size={30}
          color="green"
          role="button"
          onClick={() => setShow(true)}
        />
      </Tooltip>
      <Modal show={show} onHide={() => setShow(false)} centered size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Generar reportes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormReport max={max} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalReportButton;

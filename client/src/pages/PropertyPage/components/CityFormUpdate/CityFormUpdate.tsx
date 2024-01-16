import { Button, Col, Form, Row } from "react-bootstrap";
import { FormUpdateProps } from "../../models/types";

const CityFormUpdate: React.FC<FormUpdateProps> = ({ onHide, params }) => {
  return (
    <Form>
      <Row>
        <Col>
          <Form.Label>Departamento</Form.Label>
          <Form.Control placeholder="Departamento"></Form.Control>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="d-flex justify-content-end gap-2">
          <Button variant="danger" onClick={onHide}>
            Cancelar
          </Button>
          <Button type="submit" variant="success" className="text-white">
            Actualizar departamento
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default CityFormUpdate;

import { Button, Col, Row } from "react-bootstrap";
import { useAuthStore } from "../../../../state/useAuthStore";
import { useFormContext } from "react-hook-form";
import { Property } from "../../models/types";

const ButtonPropertyCreateForm: React.FC = () => {
  const { can } = useAuthStore();
  const { getValues } = useFormContext<Property>();

  if (can("CREATE@PROPERTY") && !getValues("id")) {
    return (
      <Row className="my-2">
        <Col className="d-flex justify-content-end gap-2">
          <Button type="submit" variant="warning" form="propertyForm">
            Crear predio
          </Button>
        </Col>
      </Row>
    );
  }
};

export default ButtonPropertyCreateForm;

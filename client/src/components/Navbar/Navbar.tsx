import { Col, Container, Navbar, Row } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useSeeker } from "../../hooks/useSeeker";
import { BackButton } from "../BackButton";
import { Nav } from "../Nav";
import { SeekerModal } from "../SeekerModal";
import { useApolloClient } from "@apollo/client";
import { useConnectionSubscription } from "../../pages/UserPage/hooks/useConnectionSubscription";
import { usePropertySubscription } from "../../pages/PropertyPage/hooks/usePropertySubscription";
import { NotificationPanel } from "../NotificationPanel";

const NavbarComponent: React.FC = () => {
  const { isModalOpen } = useSeeker();
  const client = useApolloClient();

  usePropertySubscription();
  useConnectionSubscription(client);
  return (
    <div className="d-flex flex-column vh-100">
      <Navbar
        expand="sm"
        sticky="top"
        bg="body-tertiary"
        className="shadow-sm p-0"
      >
        <Container fluid>
          <Navbar.Brand>
            <img
              src={logo}
              alt="Inra"
              width={42}
              height={42}
              className="img-responsive"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <Nav />
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container as={"main"} fluid className="flex-grow-1 d-flex flex-column">
        {isModalOpen && <SeekerModal />}
        <NotificationPanel />
        <Row>
          <Col xs={1}>
            <BackButton />
          </Col>
        </Row>
        <Row className="flex-grow-1">
          <Col xs={12}>
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NavbarComponent;

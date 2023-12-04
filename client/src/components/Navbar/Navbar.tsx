import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "graphql-ws";
import { useEffect } from "react";
import { Col, Container, Navbar, Row } from "react-bootstrap";
import { Navigate, Outlet } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../hooks";
import { Avatar } from "../Avatar";
import { BackButton } from "../BackButton";
import { Nav } from "../Nav";
import { useSeeker } from "../../hooks/useSeeker";
import { SeekerModal } from "../SeekerModal";

// const WS_QUERY = `
//     subscription Subscription {
//       userPermissionStatusUpdated
//     }
//   `
const WS_URL = import.meta.env.VITE_WS_URL as string;
const client = createClient({
  url: WS_URL,
});

const NavbarComponent: React.FC = () => {
  // const queryClient = useQueryClient();
  const { isAuth } = useAuth();
  const { isModalOpen } = useSeeker();

  // useEffect(() => {
  //   client.on('connected', () => {
  //     console.log("conectados");
  //   })

  //   client.subscribe<{ userConnected: boolean }>({
  //     query: `
  //       subscription Subscription {
  //       userConnected
  //     }
  //   `},
  //     {
  //       next({ data }) {
  //         console.log(data)
  //         if (data?.userConnected) {
  //           queryClient.invalidateQueries(['getAllUsers'])
  //         }
  //       },
  //       error(error) {
  //         console.log(error)
  //       },
  //       complete() {
  //         console.log("conectados completado")
  //       },
  //     })

  //   return () => {
  //     client.dispose()
  //   }
  // }, [queryClient])

  if (!isAuth) {
    return <Navigate to={"/auth"} />;
  }

  return (
    <div className="d-flex flex-column vh-100">
      <Navbar expand="sm" sticky="top" bg="body-tertiary" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand>
            <img
              src={logo}
              alt="Inra"
              width={32}
              height={32}
              className="img-responsive"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <Nav />
            <Avatar />
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container as={"main"} fluid className="flex-grow-1 d-flex flex-column">
        {isModalOpen && <SeekerModal />}
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

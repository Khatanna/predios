import { Col, Container, Navbar, Row } from "react-bootstrap";
import { Navigate, Outlet } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../hooks";
import { useSeeker } from "../../hooks/useSeeker";
import { Avatar } from "../Avatar";
import { BackButton } from "../BackButton";
import { Nav } from "../Nav";
import { SeekerModal } from "../SeekerModal";
import { gql, useSubscription } from "@apollo/client";
import { toast } from "sonner";

const WS_QUERY = gql`
subscription OnUserConnect {
  userConnected {
    username
    connected
  }
}
`

const NavbarComponent: React.FC = () => {
  const { isAuth } = useAuth();
  const { isModalOpen } = useSeeker();
  useSubscription<{ userConnected: { username: string, connected: boolean } }>(WS_QUERY, {
    onData({ data }) {
      if (data.data) {
        const { connected, username } = data.data.userConnected;
        toast.info(`El usuario: ${username} se ha ${connected ? 'conectado' : 'desconectado'}`)
      }
    }
  });
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

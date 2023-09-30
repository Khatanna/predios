import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "graphql-ws";
import { useEffect } from "react";
import { Col, Container, Dropdown, Navbar, Row } from "react-bootstrap";
import { ArrowLeftShort, PersonCircle } from "react-bootstrap-icons";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth, useCustomMutation } from "../../hooks";
import { customSwalError, customSwalSuccess } from "../../utilities/alerts";
import { StatusConnection } from "../../utilities/constants";
import { Nav } from "../Nav";
import { StateCell } from "../StateCell";
import { AuthProvider } from "../../context/AuthContext";

// const WS_QUERY = `
//     subscription Subscription {
//       userPermissionStatusUpdated
//     }
//   `
const WS_URL = import.meta.env.VITE_WS_URL as string;
const client = createClient({
  url: WS_URL
})

const LOGOUT = `
  mutation Logout($username: String, $token: String) {
    logout(username: $username, token: $token)
  }
`
const NavbarComponent: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { logout, user, refreshToken } = useAuth();
  const [logoutOfBackend] = useCustomMutation<{ logout: boolean }, { username: string, token: string }>(LOGOUT, {
    onSuccess({ logout }) {
      if (logout) {
        customSwalSuccess('Mensaje de sesión', 'Se ha cerrado la sesión correctamente')
      }
    },
    onError(error) {
      customSwalError("Ocurrio un error al intentar cerrar la sesión", error);
    },
  }, { headers: { operation: 'Logout' } })

  const handleLogout = () => {
    if (user && refreshToken) {
      logoutOfBackend({ username: user.username, token: refreshToken })
      queryClient.clear();
      logout()
    }
  }
  useEffect(() => {
    client.on('connected', () => {
      console.log("conectados");
    })

    // client.subscribe<{ userPermissionStatusUpdated: string[] }>({ query: WS_QUERY }, {
    //   next({ data }) {
    //     console.log("ws", data)
    //     if (data?.userPermissionStatusUpdated.length) {
    //       console.log("limpiando todas las queries")

    //       for (const query of data.userPermissionStatusUpdated) {
    //         console.log(query, map[query]);
    //         queryClient.invalidateQueries([map[query]])
    //       }
    //       // queryClient.invalidateQueries(['getAllUsers'])
    //     }
    //   },
    //   error(error) {
    //     console.log(error)
    //   },
    //   complete() {

    //   },
    // })

    client.subscribe<{ userConnected: boolean }>({
      query: `
        subscription Subscription {
        userConnected
      }
    `},
      {
        next({ data }) {
          console.log(data)
          if (data?.userConnected) {
            queryClient.invalidateQueries(['getAllUsers'])
          }
        },
        error(error) {
          console.log(error)
        },
        complete() {
          console.log("conectados completado")
        },
      })

    return () => {
      client.dispose()
    }
  }, [queryClient])

  return (
    <AuthProvider>
      <Navbar expand="sm" sticky="top" bg="body-tertiary">
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
            <div className="mx-4 align-items-center d-flex flex-column ">
              <div className="text-success fw-bold">{user?.username}</div>
              <StateCell status={user?.connection} values={StatusConnection} />
            </div>
            <Dropdown align={"end"} role="button">
              <Dropdown.Toggle
                as={PersonCircle}
                fontSize={32}
              />
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={handleLogout}
                >
                  🔐 Cerrar sesión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container as={"main"} fluid>
        <Row>
          <Col xs={1}>
            <div className="d-flex align-items-center text-primary" onClick={() => navigate(-1)} role="button">
              <ArrowLeftShort
                size={"28"}
                title="Volver"
              >
              </ArrowLeftShort>
              Volver
            </div>
          </Col>
        </Row>
        <Outlet />
      </Container>
    </AuthProvider>
  );
};

export default NavbarComponent;

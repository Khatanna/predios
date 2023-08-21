import { Button, Container, Navbar } from "react-bootstrap";
import { Navigate, Outlet } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../hooks";
import { Nav } from "../Nav";
import { Route } from "../Nav/types";

const routes: Route[] = [
  {
    path: "/",
    name: "Inicio",
  },
  {
    path: "/users",
    name: "Usuarios",
    children: [
      { path: "/users/all", name: "Ver todos" },
      { path: "/users/create", name: "Crear usuario" },
    ],
  },
  {
    path: "/admin",
    name: "Administración de entidades",
    children: [
      { path: "/admin/usertype", name: "Tipos de usuario" },
      { path: "/admin/permission", name: "Administrar permisos" },
    ],
  },
];

const NavbarComponent: React.FC = () => {
  const { logout, isAuth } = useAuth();

  if (!isAuth) {
    return <Navigate to={"/auth"} />;
  }

  return (
    <>
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
            <Nav routes={routes} />
            <Button variant="danger" size="sm" onClick={logout}>
              🔐 Cerrar sesión
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container as={"main"} fluid>
        <Outlet />
      </Container>
    </>
  );
};

export default NavbarComponent;

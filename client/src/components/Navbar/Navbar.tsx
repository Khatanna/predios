import { Container, Dropdown, Navbar } from "react-bootstrap";
import { Navigate, Outlet } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../hooks";
import { Nav } from "../Nav";
import type { Route } from "../Nav/types";
import { Role } from "../../types.d";
import { PersonCircle } from "react-bootstrap-icons";

const routes: Route[] = [
  {
    path: "/",
    name: "Inicio",
    role: Role.USER,
  },
  {
    path: "/users",
    name: "Usuarios",
    children: [
      { path: "/users/all", name: "Ver todos", role: Role.ADMIN },
      { path: "/users/create", name: "Crear usuario", role: Role.ADMIN },
    ],
    role: Role.ADMIN
  },
  {
    path: "admin/permissions",
    name: "Permisos",
    children: [
      { path: "admin/permissions/all", name: "Ver todos", role: Role.ADMIN },
      { path: "admin/permissions/create", name: "Crear permiso", role: Role.ADMIN },
      // { path: "admin/user/permissions/create", name: "Asignar permiso" },
    ],
    role: Role.ADMIN
  },
];

const NavbarComponent: React.FC = () => {
  const { logout, isAuth, user } = useAuth();

  if (!isAuth) {
    return <Navigate to={"/auth"} />;
  }

  return (
    <>
      {JSON.stringify(user?.permissions)}
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
            <div className="text-primary me-3 fw-bold">
              {user?.username}
            </div>
            <Dropdown align={'end'} role="button">
              <Dropdown.Toggle as={PersonCircle} fontSize={24}></Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={logout} >
                  🔐 Cerrar sesión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
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

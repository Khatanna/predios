import { Container, Dropdown, Navbar } from "react-bootstrap";
import { Navigate, Outlet } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../hooks";
import { Nav } from "../Nav";
import type { Route } from "../Nav/types";
import { Role } from "../../types.d";
import { PersonCircle } from "react-bootstrap-icons";
import { useQueryClient } from "@tanstack/react-query";

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
    role: Role.ADMIN,
  },
  {
    path: "admin/permissions",
    name: "Permisos",
    children: [
      { path: "admin/permissions/all", name: "Ver todos", role: Role.ADMIN },
      {
        path: "admin/permissions/create",
        name: "Crear permiso",
        role: Role.ADMIN,
      },
      // { path: "admin/user/permissions/create", name: "Asignar permiso" },
    ],
    role: Role.ADMIN,
  },
];

const role = {
  ADMIN: "Administrador",
  USER: "Usuario",
  UNDEFINED: "Indefinido",
};

const NavbarComponent: React.FC = () => {
  const queryClient = useQueryClient();
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
            <div className="text-center me-2 px-4 lh-sm border border-1 rounded-pill">
              <div className="text-success fw-bold">{user?.username}</div>
              <div className="text-warning fw-bolder">
                {role[user?.role ?? "UNDEFINED"]}
              </div>
            </div>
            <Dropdown align={"end"} role="button">
              <Dropdown.Toggle
                as={PersonCircle}
                fontSize={32}
              ></Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    queryClient.clear();
                    logout();
                  }}
                >
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

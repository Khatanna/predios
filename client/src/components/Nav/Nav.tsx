import React from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import { Calendar3, House, PersonCircle, ShieldLock } from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";
import { NavLink as LinkStyled } from "../../styled-components/Nav";
import type { Route } from "./types";
import { useAuth } from "../../hooks";

const size = 18;
const routes: Route[] = [
  {
    path: "/users",
    name: "Usuarios",
    icon: <PersonCircle color="green" size={size} />,
    role: 'administrador'
  },
  {
    path: "/admin/permissions",
    name: "Permisos",
    icon: <ShieldLock color="red" size={size} />,
    role: 'administrador'
  },
  {
    path: '/properties',
    name: 'Predios',
    icon: <House color="orange" size={size} />,
    role: 'usuario'
  },
  {
    path: "/admin/records",
    name: "Historial",
    icon: <Calendar3 color="blue" size={size} />,
    role: 'administrador'
  }
];

const NavComponent: React.FC = () => {
  const { role } = useAuth();
  return (
    <Nav className="me-auto gap-3">
      {routes.filter(r => role === 'administrador' ? r : r.role === role).map(({ path, name, icon, children }) => (
        <Nav.Item key={crypto.randomUUID()} as="div">
          {children ? (
            <LinkStyled $isActive={false}>
              {icon}
              <NavDropdown title={name} id={name} style={{ marginLeft: "-7px" }}>
                {children.map(({ path, name }) => (
                  <NavDropdown.Item key={crypto.randomUUID()} as={"div"}>
                    <NavLink to={path} className={"nav-link"}>
                      {({ isActive }) => (
                        <LinkStyled $isActive={isActive}>{name}</LinkStyled>
                      )}
                    </NavLink>
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            </LinkStyled>
          ) : (
            <NavLink to={path} className={'nav-link'}>
              {({ isActive }) => (
                <LinkStyled $isActive={isActive}>{icon} {name}</LinkStyled>
              )}
            </NavLink>
          )}
        </Nav.Item>
      ))
      }
    </Nav >
  );
};

export default NavComponent;

import React from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import {
  Calendar3,
  House,
  PersonCircle,
  ShieldLock,
} from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";
import { NavLink as LinkStyled } from "../../styled-components/Nav";
import type { Route } from "./types";

const size = 18;
const routes: Route[] = [
  {
    path: "/users",
    name: "Usuarios",
    icon: <PersonCircle color="green" size={size} />,
  },
  {
    path: "/admin/permissions",
    name: "Permisos",
    icon: <ShieldLock color="red" size={size} />,
  },
  {
    path: "/properties",
    name: "Predios",
    icon: <House color="orange" size={size} />,
  },
  {
    path: "/admin/records",
    name: "Historial",
    icon: <Calendar3 color="blue" size={size} />,
  },
];

const NavComponent: React.FC = () => {
  return (
    <Nav className="me-auto gap-3">
      {routes.map(({ path, name, icon, children }) => (
        <Nav.Item key={crypto.randomUUID()} as="div">
          {children ? (
            <LinkStyled $isActive={false}>
              {icon}
              <NavDropdown
                title={name}
                id={name}
                style={{ marginLeft: "-7px" }}
              >
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
            <NavLink to={path} className={"nav-link"}>
              {({ isActive }) => (
                <LinkStyled $isActive={isActive}>
                  {icon} {name}
                </LinkStyled>
              )}
            </NavLink>
          )}
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default NavComponent;

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
import { useAuthStore } from "../../state/useAuthStore";
import { Profile } from "../Profile";

const size = 18;
const routes: Route[] = [
  {
    path: "/users",
    name: "Usuarios",
    icon: <PersonCircle color="green" size={size} />,
    permission: {
      level: "READ",
      resource: "USER",
    },
  },
  {
    path: "/admin/permissions",
    name: "Permisos",
    icon: <ShieldLock color="red" size={size} />,
    permission: {
      level: "READ",
      resource: "PERMISSION",
    },
  },
  {
    path: "/properties",
    name: "Predios",
    icon: <House color="orange" size={size} />,
    permission: {
      level: "READ",
      resource: "PROPERTY",
    },
  },
  {
    path: "/admin/records",
    name: "Historial",
    icon: <Calendar3 color="blue" size={size} />,
    permission: {
      level: "READ",
      resource: "RECORD",
    },
  },
];

const NavComponent: React.FC = () => {
  const { can } = useAuthStore();
  return (
    <Nav className="gap-3 w-100 align-items-center">
      {routes
        .filter(({ permission: { level, resource } }) =>
          can(`${level}@${resource}`),
        )
        .map(({ path, name, icon, children }) => (
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
      <div className="ms-auto">
        <Profile />
      </div>
    </Nav>
  );
};

export default NavComponent;

import React from "react";
import type { Route } from "./types";
import { Nav, NavDropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { NavLink as LinkStyled } from "../../styled-components/Nav";

const routes: Route[] = [
  {
    path: "/",
    name: "Inicio",
  },
  {
    path: "/users/all",
    name: "Usuarios",
  },
  {
    path: "/admin/permissions/all",
    name: "Permisos",
  },
  {
    path: '/admin',
    name: 'Predios',
    children: [
      {
        path: '/admin/properties',
        name: 'Ver todos'
      },
      {
        path: '/admin/activities',
        name: 'Actividades'
      },
      {
        path: '/admin/beneficiaries',
        name: 'Beneficiarios'
      },
      {
        path: '/admin/observations',
        name: 'Observaciones'
      },
      {
        path: '/admin/clasifications',
        name: 'Clasificaciones'
      },
      {
        path: '/admin/types',
        name: 'Tipos'
      }
    ]
  },
  {
    path: '/admin/localizations',
    name: 'Ubicaciones',
    children: [
      {
        path: '/admin/localizations/cities',
        name: 'Departamentos'
      },
      {
        path: '/admin/localizations/provinces',
        name: 'Provincias'
      },
      {
        path: '/admin/localizations/municipalities',
        name: 'Municipios'
      }
    ]
  },
  {
    path: "/admin/records",
    name: "Historial"
  }
];
const NavComponent: React.FC = () => {
  return (
    <Nav className="me-auto">
      {routes.map(({ path, name, children }) => (
        <Nav.Item key={crypto.randomUUID()} as="div">
          {children ? (
            <NavDropdown title={name} id={name}>
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
          ) : (
            <NavLink to={path} className={'nav-link'}>
              {({ isActive }) => (
                <LinkStyled $isActive={isActive}>{name}</LinkStyled>
              )}
            </NavLink>
          )}
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default NavComponent;

import React from "react";
import type { Route } from "./types";
import { Nav, NavDropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { NavLink as LinkStyled } from "../../styled-components/Nav";
import { Calendar, Calendar3, CircleFill, House, Lock, Person, PersonCircle, ShieldLock } from "react-bootstrap-icons";

const size = 18;
const routes: Route[] = [
  {
    path: "/users",
    name: "Usuarios",
    icon: <PersonCircle color="green" size={size} />
  },
  {
    path: "/admin/permissions",
    name: "Permisos",
    icon: <ShieldLock color="red" size={size} />
  },
  {
    path: '/admin',
    name: 'Predios',
    icon: <House color="orange" size={size} />,
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
  // {
  //   path: '/admin',
  //   name: 'Ubicaciones',
  //   children: [
  //     {
  //       path: '/admin/localizations',
  //       name: 'Ver todos',
  //     },
  //     {
  //       path: '/admin/cities',
  //       name: 'Departamentos'
  //     },
  //     {
  //       path: '/admin/provinces',
  //       name: 'Provincias'
  //     },
  //     {
  //       path: '/admin/municipalities',
  //       name: 'Municipios'
  //     }
  //   ]
  // },
  {
    path: "/admin/records",
    name: "Historial",
    icon: <Calendar3 color="blue" size={size} />
  }
];

const NavComponent: React.FC = () => {
  return (
    <Nav className="me-auto gap-3">
      {routes.map(({ path, name, icon, children }) => (
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

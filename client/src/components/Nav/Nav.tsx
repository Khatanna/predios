import React from "react";
import type { Route } from "./types";
import { Nav, NavDropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { NavLink as LinkStyled } from "../../styled-components/Nav";
// import { useAuth } from "../../hooks";

export type NavProps = {
  routes: Route[];
};

const NavComponent: React.FC<NavProps> = ({ routes }) => {
  // const { user } = useAuth();
  return (
    <Nav className="me-auto">
      {routes.filter(r => r).map(({ path, name, children }) => (
        <Nav.Item key={crypto.randomUUID()} as="div">
          {children ? (
            <NavDropdown title={name} id={name}>
              {children.map(({ path, name }) => (
                <NavDropdown.Item key={crypto.randomUUID()} as={"div"}>
                  <NavLink to={path} className={"nav-link"} >
                    {({ isActive }) => (
                      <LinkStyled $isActive={isActive}>{name}</LinkStyled>
                    )}
                  </NavLink>
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          ) : (
            <NavLink to={path} className={'nav-link'} >
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

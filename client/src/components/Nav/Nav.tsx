import React from 'react';
import { route } from './types';
import { Nav, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { NavLink as LinkStyled } from '../../styled-components/Nav';

export type NavProps = {
	routes: route[]
}

const NavComponent: React.FC<NavProps> = ({ routes }) => {

	return <Nav className='me-auto'>
		{routes.map(({ path, name, children }) => (
			<Nav.Item key={crypto.randomUUID()} >
				{children
					?
					<NavDropdown title={name} id={name} >
						{children.map(({ path, name }) => (
							<NavDropdown.Item>
								<NavLink to={path} className={"nav-link"}>
									{({ isActive }) => (
										<LinkStyled $isActive={isActive} >
											{name}
										</LinkStyled>
									)}
								</NavLink>
							</NavDropdown.Item>
						))}
					</NavDropdown>
					:
					<NavLink to={path} className={"nav-link"}>
						{({ isActive }) => (
							<LinkStyled $isActive={isActive} >
								{name}
							</LinkStyled>
						)}
					</NavLink>
				}
			</Nav.Item>
		))}
	</Nav>
};

export default NavComponent;

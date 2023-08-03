import React from 'react';
import { route } from './types';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { NavLink } from '../../styled-components/Nav';

export type NavProps = {
	routes: route[]
}

const NavComponent: React.FC<NavProps> = ({ routes }) => {
	const { pathname } = useLocation();

	return <Nav className='ms-auto'>
		{routes.map(({ path, name }) => (
			<Nav.Item key={crypto.randomUUID()} >
				<Link to={path} className="nav-link">
					<NavLink $isActive={pathname === path}>
						{name}
					</NavLink>
				</Link>
			</Nav.Item>
		))}
	</Nav>
};

export default NavComponent;

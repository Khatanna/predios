import React from 'react';
import { Breadcrumb, Nav } from 'react-bootstrap';
import { route } from '../Nav/types';
import { Link, useLocation } from 'react-router-dom';
import { NavLink } from '../../styled-components/Nav';

export type BreadcrumbProps = {
	routes: route[]
}

const BreadcrumbComponent: React.FC<BreadcrumbProps> = ({ routes }) => {
	const { pathname } = useLocation();

	return <Breadcrumb>
		{routes.map(({ path, name }) => (
			<Breadcrumb.Item key={crypto.randomUUID()} linkAs={'div'} className='d-flex'>
				<Nav.Item>
					<Link to={path} className='nav-link'>
						<NavLink $isActive={pathname === path}>
							{name}
						</NavLink>
					</Link>
				</Nav.Item>
			</Breadcrumb.Item>
		))}
	</Breadcrumb>;
};

export default BreadcrumbComponent;

import { Button, Col, Container, Navbar, Row } from 'react-bootstrap';
import { Navigate, Outlet } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../pages/Login/hooks';
import { Breadcrumb } from '../Breadcrumb';
import { Nav } from '../Nav';
import { route } from '../Nav/types';

export type NavbarProps = {
}

const routes: route[] = [
	{
		path: '/',
		name: 'Inicio'
	},
	{
		path: '/users',
		name: 'Usuarios'
	},
	{
		path: '/properties',
		name: 'Predios'
	}
]

const NavbarComponent: React.FC<NavbarProps> = ({ }) => {
	const { logout, isAuth } = useAuth();

	if (!isAuth) {
		return <Navigate to={"/auth"} />
	}

	return <>
		<Navbar expand="sm" sticky='top' bg='body-tertiary' >
			<Container fluid>
				<Navbar.Brand>
					<img src={logo} alt="Inra" width={42} height={32} className='img-responsive img-thumbnail p-0' />
				</Navbar.Brand>
				<Navbar.Toggle aria-controls='basic-navbar-nav' />
				<Navbar.Collapse>
					<Nav routes={routes} />
					<Button variant='danger' size='sm' onClick={logout}>🔐 Cerrar sesión</Button>
				</Navbar.Collapse>
			</Container>
		</Navbar>
		<Container as={'main'}>
			<Row>
				<Col>
					<Breadcrumb routes={routes} />
				</Col>
			</Row>
			<Outlet />
		</Container>
	</>
};

export default NavbarComponent;

import { Button, Container, Navbar } from 'react-bootstrap';
import { Navigate, Outlet } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../hooks';
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
	}
]

const NavbarComponent: React.FC<NavbarProps> = ({ }) => {
	const { logout, isAuth } = useAuth();

	if (!isAuth) {
		return <Navigate to={"/auth"} />
	}

	return <>
		<Navbar expand="sm" sticky='top' bg='body-tertiary p-0'>
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
			<Outlet />
		</Container>
	</>
};

export default NavbarComponent;

import { useEffect } from 'react';
import { Button, Col, Container, Navbar, Row } from 'react-bootstrap'
import logo from '../../assets/logo.png'
import { Navigate, Outlet } from 'react-router-dom';
import { Breadcrumb } from '../Breadcrumb';
import { Nav } from '../Nav';
import { route } from '../Nav/types';
import { useAuthStore } from '../../pages/Login/state/auth/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import Swal from 'sweetalert2';
import { instance } from '../../utilities/config/axios';

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

type error = {
	message: string
}

type APILogoutResponse = {
	logout: boolean
}

type GraphQLMappendResponse = {
	data: APILogoutResponse
	error?: error
}

type GraphQLResponse = {
	data: APILogoutResponse
	errors: error[]
}

const LOGOUT_QUERY = `
	query Query($id: ID, $token: String)	{
		logout: isAuth(id: $id, token: $token) 
	}
`

type AxiosResponseLoginQuery = AxiosResponse<GraphQLMappendResponse>[keyof Pick<AxiosResponse<GraphQLMappendResponse>, 'data'>]

const NavbarComponent: React.FC<NavbarProps> = ({ }) => {
	const { isAuth, logoutStore, user, token, verifyAuth } = useAuthStore(s => s);
	const { mutate: logout } = useMutation<AxiosResponseLoginQuery>(async () => {
		const { data } = await instance.post<GraphQLResponse>('/', {
			query: LOGOUT_QUERY,
			variables: {
				id: user?.id,
				token
			}
		})
		return { ...data, error: data.errors ? data.errors[0] : undefined };
	}, {
		onSuccess({ data, error }) {
			if (error) {
				Swal.fire({
					icon: 'error',
					title: 'Error al cerrar la sesión',
					text: error.message,
					confirmButtonColor: 'green',
					confirmButtonText: 'Aceptar'
				})
			} else {
				if (data.logout) {
					logoutStore()
				}
			}
		},
	})

	useEffect(() => {
		verifyAuth();
	}, [])

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
					<Button variant='danger' size='sm' onClick={() => logout()}>🔐 Cerrar sesión</Button>
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

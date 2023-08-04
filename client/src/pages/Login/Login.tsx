import { Container, Row } from 'react-bootstrap';
import { LoginForm } from './components/LoginForm';
import { Navigate } from 'react-router';
import { useAuthStore } from '../../state/useAuthStore';
import { useEffect } from 'react';
import { useSessionStore } from './state';
import Swal from 'sweetalert2';
import { newAccessToken } from './services';

export type LoginProps = {
}

const Login: React.FC<LoginProps> = ({ }) => {
	const { isAuth, accessToken } = useAuthStore();
	const { refreshToken } = useSessionStore();

	useEffect(() => {
		if (accessToken) {
			console.log("relax")
		} else {
			console.log("pedir nuevo token")
			newAccessToken(refreshToken!);
		}
		// if (refreshToken) {
		// 	getNewAccessToken(refreshToken);
		// } else {

		// 	// Swal.fire({
		// 	// 	icon: 'info',
		// 	// 	title: 'Mensaje de sesión',
		// 	// 	text: 'Su sesion ha expirado',
		// 	// 	confirmButtonColor: 'green',
		// 	// 	confirmButtonText: 'Aceptar'
		// 	// })
		// }
	}, [])

	if (isAuth) {
		return <Navigate to={"/"} />
	}

	return <Container fluid>
		<Row className='vh-100 align-content-center justify-content-center'>
			<LoginForm />
		</Row>
	</Container>
};

export default Login;

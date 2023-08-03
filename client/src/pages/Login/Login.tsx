import { Row, Container } from 'react-bootstrap';
import { LoginForm } from './components/LoginForm';
import { Navigate } from 'react-router';
import { useAuthStore } from './state/auth/useAuthStore';
import { useEffect } from 'react';

export type LoginProps = {
}

const Login: React.FC<LoginProps> = ({ }) => {
	const { isAuth, verifyAuth } = useAuthStore(s => s);

	useEffect(() => {
		verifyAuth();
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

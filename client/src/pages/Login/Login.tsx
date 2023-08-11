import { Container, Row } from 'react-bootstrap';
import { Navigate } from 'react-router';
import { LoginForm } from './components/LoginForm';
import { useAuth } from '../../hooks';

export type LoginProps = {
}

const Login: React.FC<LoginProps> = ({ }) => {
	const { isAuth } = useAuth();

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

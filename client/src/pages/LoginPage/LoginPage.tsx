import { Container, Row } from 'react-bootstrap';
import { Navigate } from 'react-router';
import { LoginForm } from './components/LoginForm';
import { useAuth } from '../../hooks';

const LoginPage: React.FC = () => {
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

export default LoginPage;

import { Container, Row } from 'react-bootstrap';
import { Navigate } from 'react-router';
import { useAuthStore } from '../../state/useAuthStore';
import { LoginForm } from './components/LoginForm';

const LoginPage: React.FC = () => {
	const { isAuth } = useAuthStore();
	if (isAuth) {
		return <Navigate to={"../"} />
	}

	return <Container fluid>
		<Row className='vh-100 align-content-center justify-content-center'>
			<LoginForm />
		</Row>
	</Container>
};

export default LoginPage;

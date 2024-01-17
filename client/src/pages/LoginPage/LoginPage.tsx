import { Container, Row } from 'react-bootstrap';
import { LoginForm } from './components/LoginForm';

const LoginPage: React.FC = () => {
	return <Container fluid>
		<Row className='vh-100 align-content-center justify-content-center'>
			<LoginForm />
		</Row>
	</Container>
};

export default LoginPage;

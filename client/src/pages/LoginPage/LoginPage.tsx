import { Container, Row } from 'react-bootstrap';
import { LoginForm } from './components/LoginForm';
import { useAuthStore } from '../../state/useAuthStore';
import { gql, useQuery } from '@apollo/client';
import { User } from '../UserPage/models/types';
import { toast } from 'sonner';
import { Navigate } from 'react-router';
const GET_NEW_ACCESSTOKEN_QUERY = gql`
  query GetNewAccessToken($refreshToken: String) {
    result: getNewAccessToken(refreshToken: $refreshToken) {
      accessToken
      user {
        username
        role {
          name
          permissions {
            permission {
              level
              resource
            }
          }
        }
      }
    }
  }
`;
const LoginPage: React.FC = () => {
	const { isAuth, refreshToken, setAccessToken, logout, setUser } =
		useAuthStore();
	const { loading } = useQuery<
		{ result: { accessToken: string; user: User } },
		{ refreshToken?: string }
	>(GET_NEW_ACCESSTOKEN_QUERY, {
		variables: {
			refreshToken,
		},
		onCompleted({ result: { accessToken, user } }) {
			setAccessToken(accessToken);
			setUser(user);
		},
		onError(error) {
			toast.error(error.message);
			logout();
		},
		context: {
			headers: {
				operation: "Login",
			},
		},
		skip: !refreshToken,
	});

	if (loading) {
		return <div>Verificando credenciales</div>;
	}

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

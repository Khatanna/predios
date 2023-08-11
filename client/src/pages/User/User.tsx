import React from 'react';
import { UserList } from './components/UserList';
import { Container, Row, Col } from 'react-bootstrap';

export type UserProps = {
}

const User: React.FC<UserProps> = ({ }) => {
	return <Container fluid>
		<Row className='vh-100 align-content-center justify-content-center'>
			<Col>
				<UserList />
			</Col>
		</Row>
	</Container>
};

export default User;

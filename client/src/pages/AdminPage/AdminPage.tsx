import React from 'react';
import { Menu, Dashboard } from './components';
import { Row, Col } from 'react-bootstrap';

export type AdminProps = {
}

const AdminPage: React.FC<AdminProps> = () => {
	return <Row>
		<Col xs={2}>
			<div className='position-relative'>
				<div className='position-absolute top-50 start-50 translate-middle-x '>
					<Menu />
				</div>
			</div>
		</Col>
		<Col>
			<Dashboard />
		</Col>
	</Row>;
};

export default AdminPage;

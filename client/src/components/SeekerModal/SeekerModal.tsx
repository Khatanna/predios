import { useState } from 'react';
import { Button, Col, Form, InputGroup, Modal } from 'react-bootstrap';
import { CheckCircle, XCircle } from 'react-bootstrap-icons';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { useCustomQuery } from '../../hooks/useCustomQuery';
import { useSeeker } from '../../hooks/useSeeker';
import { Property } from '../../pages/PropertyPage/models/types';

const SEARCH_PROPERTY_BY_ATTRIBUTE = `
	query SearchPropertyByAttribute($query: String) {
		property: searchPropertyByAttribute(query: $query) {
			id
		}
	}
`

const SeekerModal: React.FC = () => {
	const { isModalOpen, closeModal } = useSeeker();
	const navigate = useNavigate();
	const [value, setValue] = useState('');
	const { data, refetch, remove } = useCustomQuery<{ property: Property }>(SEARCH_PROPERTY_BY_ATTRIBUTE, ['searchPropertyByAttribute', { query: value }], { enabled: false })
	return createPortal(<Modal show={isModalOpen} onHide={closeModal} centered>
		<Modal.Header closeButton closeLabel='Cerrar'>
			<Modal.Title>
				Buscar predio
			</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			<Form onSubmit={async (e) => {
				e.preventDefault()
				const { data } = await refetch()

				if (data) {
					console.log(data);
					const id = data.data.property.id;
					navigate(`/admin/properties/${id}`)
					closeModal();
					remove()
				}
			}} className='row g-3'>
				<Col xs={12} className='position-relative'>
					<InputGroup>
						{value}
						<Form.Control placeholder='Propiedad' value={value} onChange={(e) => setValue(e.target.value)} autoFocus>
						</Form.Control>
						<InputGroup.Text>
							{data?.property ? <CheckCircle color='green' size={16}></CheckCircle> : <XCircle color='red' size={16}></XCircle>}
						</InputGroup.Text>
					</InputGroup>
				</Col>
				<Col>
					<Button type="submit" className='float-end'> Buscar 🔎</Button>
				</Col>
			</Form>
		</Modal.Body>
	</Modal>, document.getElementById('modal')!)
};

export default SeekerModal;

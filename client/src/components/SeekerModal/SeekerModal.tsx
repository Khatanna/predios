import { useState } from 'react';
import { Button, Col, Form, InputGroup, Modal, Spinner } from 'react-bootstrap';
import { CheckCircle, XCircle } from 'react-bootstrap-icons';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { useCustomQuery } from '../../hooks/useCustomQuery';
import { useSeeker } from '../../hooks/useSeeker';
import { Property } from '../../pages/PropertyPage/models/types';
import { Table } from '../Table';
import { TableColumn } from 'react-data-table-component';

const SEARCH_PROPERTY_BY_ATTRIBUTE = `
	query SearchPropertyByAttribute($code: String, $codeOfSearch: String, $agrupationIdentifier: String) {
		properties: searchPropertyByAttribute(code: $code, codeOfSearch: $codeOfSearch, agrupationIdentifier: $agrupationIdentifier) {
			id
			name
			agrupationIdentifier
			code
			codeOfSearch
			area
		}
	}
`

type PropertySearch = Pick<Required<Property>, 'id', 'name' | 'agrupationIdentifier' | 'area' | 'code' | 'codeOfSearch'>

const columns: TableColumn<PropertySearch>[] = [
	{
		name: 'Nombre del predio',
		selector: row => row.name,
		wrap: true,
		grow: 3
	},
	{
		name: 'Id de agrupación social',
		selector: row => row.agrupationIdentifier
	},
	{
		name: 'Codigo de predio',
		selector: row => row.code
	},
	{
		name: 'Codigo de busqueda',
		selector: row => row.codeOfSearch
	},
	// {
	// 	name: 'Superficie',
	// 	selector: row => row.area.concat(' ha')
	// },
]

const SeekerModal: React.FC = () => {
	const { isModalOpen, closeModal } = useSeeker();
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [codeOfSearch, setCodeOfSearch] = useState('');
	const [agrupationIdentifier, setAgrupationIdentifier] = useState('');

	const { data, isFetching } = useCustomQuery<{ properties: PropertySearch[] }>(SEARCH_PROPERTY_BY_ATTRIBUTE, ['searchPropertyByAttribute', { code, codeOfSearch, agrupationIdentifier }])
	return createPortal(<Modal show={isModalOpen} onHide={closeModal} centered size='lg'>
		<Modal.Header closeButton closeLabel='Cerrar'>
			<Modal.Title>
				Buscar predio
			</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			<Form onSubmit={async (e) => {
				e.preventDefault()
				// const { data } = await refetch()

				// if (data) {
				// 	console.log(data);
				// 	const id = data.data.property.id;
				// 	navigate(`/admin/properties/${id}`)
				// 	closeModal();
				// 	remove()
				// }
			}} className='row g-3'>
				<Col xs={12} className='position-relative'>
					{/* <Form.Control placeholder='Nombre del predio' value={name} onChange={(e) => setName(e.target.value)} autoFocus /> */}
				</Col>
				<Col xs={4}>
					<Form.Control placeholder='Codigo de predio' value={code} onChange={(e) => setCode(e.target.value)} />
				</Col>
				<Col xs={4}>
					<Form.Control placeholder='Codigo de busqueda' value={codeOfSearch} onChange={(e) => setCodeOfSearch(e.target.value)} />
				</Col>
				<Col xs={4}>
					<Form.Control placeholder='Id de agrupación social' value={agrupationIdentifier} onChange={(e) => setAgrupationIdentifier(e.target.value)} />
				</Col>
				{data?.properties && (
					<Col xs={12} className='mb-2'>
						<Table
							columns={columns}
							data={data.properties}
							title={false}
							dense={true}
							name='predios encontrados'
							pagination={false}
							progressPending={isFetching}
							progressComponent={<Spinner />}
							onRowDoubleClicked={(row) => navigate(`/properties/${row.id}`, { replace: true })}
						/>
					</Col>
				)}
				{/* <Col>
					<Button type="submit" className='float-end'> Buscar 🔎</Button>
				</Col> */}
			</Form>
		</Modal.Body>
	</Modal>, document.getElementById('modal')!)
};

export default SeekerModal;

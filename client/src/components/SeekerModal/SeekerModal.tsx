import { useState } from 'react';
import { Col, Form, Modal, Spinner } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { useCustomQuery } from '../../hooks/useCustomQuery';
import { useSeeker } from '../../hooks/useSeeker';
import { Property } from '../../pages/PropertyPage/models/types';
import { Table } from '../Table';
const SEARCH_PROPERTY_BY_ATTRIBUTE = `
	query SearchPropertyByAttribute($page: Int, $limit: Int, $orderBy: String, $code: String, $codeOfSearch: String, $agrupationIdentifier: String, $name: String, $beneficiary: String) {
		results: searchPropertyByAttribute(page: $page, limit: $limit, orderBy: $orderBy, code: $code, codeOfSearch: $codeOfSearch, agrupationIdentifier: $agrupationIdentifier, name: $name, beneficiary: $beneficiary) {
			page
			limit
			total	
			properties {
				registryNumber
				id
				name
				agrupationIdentifier
				code
				codeOfSearch
				area
			}
		}
	}
`

type PropertySearch = Pick<Required<Property>, 'id' | 'name' | 'code' | 'codeOfSearch' | 'registryNumber'>

const columns: TableColumn<PropertySearch>[] = [
	{
		name: 'N°',
		selector: row => row.registryNumber,
		width: '80px'
	},
	{
		name: 'Nombre del predio',
		selector: row => row.name,
		wrap: true,
		grow: 3
	},
	{
		name: 'Codigo de predio',
		selector: row => row.code
	},
	{
		name: 'Codigo de busqueda',
		selector: row => row.codeOfSearch
	},
]

const SeekerModal: React.FC = () => {
	const { isModalOpen, closeModal } = useSeeker();
	const [paginationToggle, setPaginationToggle] = useState(false);
	const navigate = useNavigate();
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [attributes, setAttributes] = useState({
		code: '',
		name: '',
		beneficiary: '',
		codeOfSearch: '',
		agrupationIdentifier: ''
	})
	const { code, agrupationIdentifier, beneficiary, codeOfSearch, name } = attributes;
	const { data, isLoading } = useCustomQuery<{ results: { page: number; limit: number; total: number; properties: PropertySearch[] } }>(SEARCH_PROPERTY_BY_ATTRIBUTE, ['searchPropertyByAttribute', { page, limit, orderBy: 'asc', ...attributes }], {
		enabled: true, refetchOnWindowFocus: false, cacheTime: 0, onSuccess() {
			setPaginationToggle(false);
		}
	});
	const handleChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) => {
		setAttributes({
			...attributes,
			[name]: value
		})
		setPaginationToggle(true);
	}
	return createPortal(
		<Modal show={isModalOpen} onHide={closeModal} centered size='xl' backdrop="static" keyboard={false}>
			<Modal.Header closeButton closeLabel='Cerrar'>
				<Modal.Title>
					Buscar predio
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={async (e) => {
					e.preventDefault()
				}} className='row g-3'>
					<Col xs={6} className='position-relative'>
						<Form.Control name='name' placeholder='Nombre del predio' value={name} onChange={handleChange} autoFocus />
					</Col>
					<Col xs={6} className='position-relative'>
						<Form.Control name='beneficiary' placeholder='Nombre de beneficiario' value={beneficiary} onChange={handleChange} />
					</Col>
					<Col xs={4}>
						<Form.Control name='code' placeholder='Codigo de predio' value={code} onChange={handleChange} />
					</Col>
					<Col xs={4}>
						<Form.Control name='codeOfSearch' placeholder='Codigo de busqueda' value={codeOfSearch} onChange={handleChange} />
					</Col>
					<Col xs={4}>
						<Form.Control name='agrupationIdentifier' placeholder='Id de agrupación social' value={agrupationIdentifier} onChange={handleChange} />
					</Col>

					<Col xs={12} className='mb-2'>
						<Table
							columns={columns}
							data={data?.results.properties ?? []}
							title={false}
							dense
							name='predios encontrados'
							progressPending={isLoading}
							paginationServer
							paginationTotalRows={data?.results.total ?? 0}
							paginationResetDefaultPage={paginationToggle}
							//paginationPerPage={data.results.limit}
							paginationComponentOptions={{
								selectAllRowsItem: false,
							}}
							paginationRowsPerPageOptions={[8, 10, 15, 20]}
							onChangePage={(page) => {
								setPage(page);
							}}
							onChangeRowsPerPage={(newLimit) => {
								setLimit(newLimit)
							}}
							progressComponent={<Spinner />}
							onRowDoubleClicked={(row) => navigate(`/properties/${row.id}`, { replace: true })}
						/>
					</Col>
				</Form>
			</Modal.Body>
		</Modal>
		, document.getElementById('modal')!)
};

export default SeekerModal;

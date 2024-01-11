import { gql, useLazyQuery } from '@apollo/client';
import { Col, Form, Modal, Spinner } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { useSeeker } from '../../hooks/useSeeker';
import { Property } from '../../pages/PropertyPage/models/types';
import { useModalInputStore } from '../../state/useModalInputStore';
import { Table } from '../Table';
import { useState } from 'react';

export type SeekerModalInputProps = {
  // types...
}

const GET_PROPERTY_BY_ATTRIBUTE = gql`
	query GetPropertyByAttribute($page: Int, $limit: Int, $orderBy: String,$fieldName: String, $value: String) {
  results: getPropertyByAttribute(page: $page, limit: $limit, orderBy: $orderBy, fieldName: $fieldName, value: $value) {
    page
    limit
    total	
    properties {
      id
      name
      registryNumber
      code
      technicalObservation
      }
    }
	}
`

const columns: TableColumn<Pick<Property, 'technicalObservation' | 'code' | 'id'>>[] = [
  {
    name: 'Observación tecnica',
    selector: row => row.technicalObservation,
    wrap: true,
    grow: 2
  },
  {
    name: 'Codigo de predio',
    selector: row => row?.code ?? 'Sin codigo'
  },
]
const SeekerModalInput: React.FC<SeekerModalInputProps> = ({ }) => {
  const navigate = useNavigate();
  const { isAvailableModal, setIsAvailableModal } = useSeeker();
  const { isOpen, closeModal, fieldName } = useModalInputStore();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(7);
  const [value, setValue] = useState('');
  const [findProperty, { data, loading, refetch }] = useLazyQuery<{ results: { properties: Property[], page: number, total: number, limit: number } }, { page: number; limit: number, orderBy: 'asc' | 'desc'; fieldName: string, value: string }>(GET_PROPERTY_BY_ATTRIBUTE);
  return createPortal(
    <Modal size='lg' show={isOpen && !isAvailableModal} onHide={() => {
      closeModal()
      setIsAvailableModal(true)
    }} backdrop="static" keyboard={false}>
      <Modal.Header closeButton closeLabel='Cerrar'>
        <Modal.Title>
          Buscar por: <b>Observacion tecnica</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={async (e) => {
          e.preventDefault()
        }} className='row g-3'>
          <Col xs={12} className='position-relative'>
            <Form.Control name='field' placeholder='Buscar...' value={value} autoFocus onChange={(({ target }) => {
              setValue(target.value)
              findProperty({
                variables: {
                  page,
                  limit,
                  orderBy: 'asc',
                  fieldName,
                  value: target.value,
                }
              })
            })} />
          </Col>
          <Col xs={12} className='mb-2'>
            <Table
              columns={columns}
              data={data?.results.properties ?? []}
              title={false}
              name='predios encontrados'
              progressPending={loading}
              paginationServer
              paginationTotalRows={data?.results.total ?? 0}
              paginationPerPage={data?.results.limit}
              paginationComponentOptions={{
                selectAllRowsItem: false,
              }}
              paginationRowsPerPageOptions={[8, 10, 15, 20]}
              onChangePage={(page) => {
                setPage(page);
                findProperty({
                  variables: {
                    page,
                    limit,
                    orderBy: 'asc',
                    fieldName,
                    value
                  }
                });
              }}
              onChangeRowsPerPage={(newLimit) => {
                setLimit(newLimit)
                findProperty({
                  variables: {
                    page,
                    limit,
                    orderBy: 'asc',
                    fieldName,
                    value
                  }
                });
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

export default SeekerModalInput;

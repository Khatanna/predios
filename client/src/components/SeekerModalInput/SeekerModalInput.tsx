import { Button, Col, Form, Modal } from 'react-bootstrap';
import { createPortal } from 'react-dom';
import { useSeeker } from '../../hooks/useSeeker';
import { useModalInputStore } from '../../state/useModalInputStore';
import { gql, useLazyQuery } from '@apollo/client';
import { useState } from 'react';
import { Property } from '../../pages/PropertyPage/models/types';
import { usePaginationStore } from '../../pages/PropertyPage/state/usePaginationStore';
import { toast } from 'sonner';

export type SeekerModalInputProps = {
	// types...
}

const GET_PROPERTY_BY_ATTRIBUTE = gql`
	query GetPropertyByAttribute($fieldName: String, $value: String, $currentRegistryNumber: Int) {
		result: getPropertyByAttribute(fieldName: $fieldName, value: $value, currentRegistryNumber: $currentRegistryNumber) {
      next
      prev
      property {
        id
        name
        registryNumber
        code
        codeOfSearch
        plots
        bodies
        sheets
        area
        polygone
        expertiseOfArea
        secondState
        agrupationIdentifier
        technicalObservation
        technical {
          user {
            names
            firstLastName
            secondLastName
            username
          }
        }
        legal {
          user {
            names
            firstLastName
            secondLastName
            username
          }
        }
        fileNumber {
          number
        }
        groupedState {
          name
        }
        beneficiaries {
          name
        }
        city {
          name
        }
        province {
          name
        }
        municipality {
          name
        }
        type {
          name
        }
        activity {
          name
        }
        clasification {
          name
        }
        observations {
          id
          observation
        }
        reference {
          name
        }
        responsibleUnit {
          name
        }
        folderLocation {
          name
        }
        state {
          name
        }
        trackings {
          id
          observation
          numberOfNote
          dateOfInit
          state {
            name
          }
          responsible {
            names
            firstLastName
            secondLastName
            username
          }
        }
      }
    }
	}
`

const SeekerModalInput: React.FC<SeekerModalInputProps> = ({ }) => {
	const { isAvailableModal, setIsAvailableModal } = useSeeker();
	const { isOpen, closeModal, fieldName } = useModalInputStore();
	const { setState } = usePaginationStore();
	const [findProperty, { data }] = useLazyQuery<{ result: { next: string; prev: string; property: Property } }, { fieldName: string, value: string, currentRegistryNumber?: number }>(GET_PROPERTY_BY_ATTRIBUTE, {
		onCompleted({ result }) {
			if (!result) {
				toast.error("No se encontraron coincidencias")
			} else {
				setState(result)
			}
		},
	});
	const [value, setValue] = useState<string>()
	return createPortal(
		<Modal show={isOpen && !isAvailableModal} onHide={() => {
			closeModal()
			setIsAvailableModal(true)
		}} centered backdrop="static" keyboard={false}>
			<Modal.Header closeButton closeLabel='Cerrar'>
				<Modal.Title>
					Buscar por: <b>Observacion tecnica</b>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={async (e) => {
					e.preventDefault()
				}} className='row g-3'>
					<Col xs={8} className='position-relative'>
						<Form.Control name='field' placeholder='Buscar...' autoFocus value={value} onChange={(({ target }) => setValue(target.value))} onKeyDown={(e) => {
							if (e.key === "Enter" && value) {
								findProperty({
									variables: {
										fieldName,
										value,
										currentRegistryNumber: data?.result.property.registryNumber
									}
								})
							}
						}} />
					</Col>
					<Col xs={4} className='position-relative'>
						<Button className='w-100' variant='danger' onClick={() => {
							if (!value) return;
							findProperty({
								variables: {
									fieldName,
									value,
									currentRegistryNumber: data?.result.property.registryNumber
								}
							})
						}}>Buscar siguiente</Button>
					</Col>
				</Form>
			</Modal.Body>
		</Modal>
		, document.getElementById('modal')!)
};

export default SeekerModalInput;

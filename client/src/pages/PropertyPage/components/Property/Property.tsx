import React from 'react';
import { useParams } from 'react-router';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import { Property } from '../../models/types';
import { PropertyForm } from '../PropertyForm';

const GET_PROPERTY_BY_ID_QUERY = `
query GetPropertyById($id: String) {
	property: getPropertyById(id: $id) {
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
		groupedState {
			name
		}
		beneficiaries {
			id
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
			type
		}
		reference {
			name
		}
		responsibleUnit {
			name
		}
		subDirectory {
			name
		}
		state {
			name
		}
		trackings {
			observation
			numberOfNote
			dateOfInit
			dateOfEnd
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
}`

const Property: React.FC = () => {
	const { id } = useParams();
	const { data, isLoading } = useCustomQuery<{ property: Property }>(GET_PROPERTY_BY_ID_QUERY, ['getPropertyById', { id }])

	if (isLoading) {
		return <div>cargando...</div>
	}

	return <>
		<PropertyForm property={data?.property} />
	</>
};

export default Property;

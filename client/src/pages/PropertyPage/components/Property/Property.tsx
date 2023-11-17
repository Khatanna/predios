import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import { Property } from '../../models/types';
import { PropertyForm } from '../PropertyForm';
import { usePaginationStore } from '../../state/usePaginationStore';

const GET_PROPERTY_BY_ID_QUERY = `
query GetPropertyById($id: String) {

		property: getPropertyById(id: $id) {
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
}`

const Property: React.FC = () => {
	const { id } = useParams();

	const { setState } = usePaginationStore();
	const { isLoading } = useCustomQuery<{ property: Property }>(GET_PROPERTY_BY_ID_QUERY, ['getPropertyById', { id }], {
		onSuccess({ property }) {
			setState({ property, nextCursor: property.id });
		}
	})
	// const { isLoading } = useCustomQuery<{ result: { nextCursor?: string, prevCursor?: string, property: Property } }>(GET_PROPERTY_BY_ID_QUERY, ['getProperty', { nextCursor: undefined, prevCursor: undefined }], {
	// 	onSuccess({ result: { prevCursor, nextCursor, property } }) {
	// 		// console.log({ prevCursor, nextCursor })
	// 		setState({ property, nextCursor, prevCursor })
	// 		// navigate(`../${nextCursor}`)
	// 	},
	// })

	if (isLoading) {
		return <div>cargando...</div>
	}

	return <>
		<PropertyForm newItem />
	</>
};

export default Property;

import { gql } from "@apollo/client";

export const GET_PROPERTY_QUERY = `
query GetPropertyPaginate($nextCursor: String, $prevCursor: String) {
    result: getProperty(nextCursor: $nextCursor, prevCursor: $prevCursor){
      nextCursor
      prevCursor
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
`;
export const CREATE_PROPERTY_MUTATION = gql`
  mutation CreateProperty($input: PropertyInput) {
    property: createProperty(input: $input) {
      name
    }
  }
`;

export const UPDATE_PROPERTY_MUTATION = `
  mutation UpdateProperty($id: String, $input: PropertyInput) {
    property: updateProperty(id: $id, input: $input) {
      name
    }
  }
`;

export const GET_PROPERTY_BY_ID_QUERY = gql`
  query GetPropertyByRegistryNumber($id: String) {
    result: getPropertyByRegistryNumber(id: $id) {
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
`;

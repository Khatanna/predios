import { useParams } from "react-router";
import { Property } from "../../models/types";
import { PropertyForm } from "../PropertyForm";
import { usePaginationStore } from "../../state/usePaginationStore";
import { gql, useQuery } from "@apollo/client";
import { toast } from "sonner";

const GET_PROPERTY_BY_ID_QUERY = gql`
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

const Property: React.FC = () => {
  const { id } = useParams();
  const { setState } = usePaginationStore();
  useQuery<
    { result: { property: Property; next: string; prev: string } },
    { id: string }
  >(GET_PROPERTY_BY_ID_QUERY, {
    fetchPolicy: 'no-cache',
    variables: {
      id: id!,
    },
    onCompleted({ result }) {
      setState(result);
    },
    onError(error) {
      toast.info(error.message);
    },
  });

  // if (loading) {
  //TODO poner un esqueleton
  //   return <div>cargando...</div>;
  // }

  return <PropertyForm />;
};

export default Property;

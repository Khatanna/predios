import { useParams } from "react-router";
import { Property } from "../../models/types";
import { PropertyForm } from "../PropertyForm";
import { usePaginationStore } from "../../state/usePaginationStore";
import { useQuery } from "@apollo/client";
import { toast } from "sonner";
import { GET_PROPERTY_BY_ID_QUERY } from "../../graphQL/types";

const Property: React.FC = () => {
  const { id } = useParams();
  const { setState } = usePaginationStore();
  useQuery<
    { result: { property: Property; next: string; prev: string } },
    { id: string }
  >(GET_PROPERTY_BY_ID_QUERY, {
    fetchPolicy: "no-cache",
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

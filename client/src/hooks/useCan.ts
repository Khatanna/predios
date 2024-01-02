import { gql, useLazyQuery } from "@apollo/client";
import { useState } from "react";
import {
  Level,
  Resource,
} from "../pages/UserPage/components/Permission/Permission";
import { toast } from "sonner";

const CAN_QUERY = gql`
  query Can($resource: String, $level: String) {
    can(resource: $resource, level: $level)
  }
`;
export const useCan = () => {
  const [can, setCan] = useState(false);
  const [refetch] = useLazyQuery<
    { can: boolean },
    { resource: Resource; level: Level }
  >(CAN_QUERY, {
    onCompleted(data) {
      setCan(data.can);
    },
    onError() {
      setCan(false);
      toast.info("No tiene permisos para editar este campo");
    },
    fetchPolicy: "no-cache",
  });

  return { can, refetch };
};

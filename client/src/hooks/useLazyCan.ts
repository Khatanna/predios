import { gql, useLazyQuery } from "@apollo/client";
import {
  Level,
  Resource,
} from "../pages/UserPage/components/Permission/Permission";
import { toast } from "sonner";

const CAN_QUERY = gql`
  query Can($can: [CanInput]) {
    can(can: $can) {
      can
      resource
      level
    }
  }
`;

const canAdapter = (data?: {
  can: Array<{ resource: Resource; level: Level; can: boolean }>;
}) => {
  if (!data) return {};

  return data.can.reduce((acc, { can, level, resource }) => {
    acc[`${level}@${resource}`] = can;

    return acc;
  }, {} as Record<string, boolean>);
};

export const useLazyCan = () => {
  const [fetchCan, query] = useLazyQuery<
    { can: Array<{ resource: Resource; level: Level; can: boolean }> },
    { can: Array<{ resource: Resource; level: Level }> }
  >(CAN_QUERY, {
    onError() {
      toast.info("No tiene permisos para editar este campo");
    },
    fetchPolicy: "no-cache",
  });

  return { fetchCan, ...query, data: canAdapter(query.data) };
};

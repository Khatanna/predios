import React from "react";
import { usePaginationStore } from "../../state/usePaginationStore";
import { useFormContext } from "react-hook-form";
import { Property } from "../../models/types";
import { Tooltip } from "../../../../components/Tooltip";
import { FastForwardFill } from "react-bootstrap-icons";
import { Badge } from "react-bootstrap";
import { GET_PROPERTY_QUERY } from "../../graphQL/types";
import { useCustomQuery } from "../../../../hooks/useCustomQuery";

const Paginator: React.FC = () => {
  const { getValues } = useFormContext<Property>();
  const { nextCursor, prevCursor, setState } = usePaginationStore((s) => {
    if (!getValues("id")) {
      return { ...s, property: undefined };
    }

    return s;
  });

  const { refetch: fetchNext } = useCustomQuery<{
    result: { nextCursor?: string; prevCursor?: string; property: Property };
  }>(
    GET_PROPERTY_QUERY,
    ["getPropertyPaginateNext", { nextCursor, prevCursor: undefined }],
    {
      onSuccess({ result }) {
        setState(result);
      },
      enabled: false,
      refetchOnWindowFocus: false,
    },
  );
  const { refetch: fetchPrev } = useCustomQuery<{
    result: { nextCursor?: string; prevCursor?: string; property: Property };
  }>(
    GET_PROPERTY_QUERY,
    ["getPropertyPaginatePrev", { nextCursor: undefined, prevCursor }],
    {
      onSuccess({ result }) {
        setState(result);
      },
      enabled: false,
      refetchOnWindowFocus: false,
    },
  );

  return (
    <div className="position-absolute top-0 end-0 d-flex gap-2 justify-content-end align-items-center mt-1">
      <Tooltip label="Anterior">
        <FastForwardFill
          color="orange"
          size={24}
          style={{ rotate: "-180deg" }}
          onClick={() => fetchPrev()}
        />
      </Tooltip>
      <Tooltip label="Número de registro">
        <Badge className="fw-bold mx-2 fs-6">
          {getValues("registryNumber")}
        </Badge>
      </Tooltip>
      <Tooltip label="Siguiente">
        <FastForwardFill color="orange" size={24} onClick={() => fetchNext()} />
      </Tooltip>
    </div>
  );
};

export default Paginator;

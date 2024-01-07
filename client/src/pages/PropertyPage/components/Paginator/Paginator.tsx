import { usePaginationStore } from "../../state/usePaginationStore";
import { useFormContext } from "react-hook-form";
import { Property } from "../../models/types";
import { Tooltip } from "../../../../components/Tooltip";
import { FastForwardFill } from "react-bootstrap-icons";
import { Badge } from "react-bootstrap";
import { useNavigate } from "react-router";

const Paginator: React.FC = () => {
  const navigate = useNavigate();
  const { getValues } = useFormContext<Property>();
  const { next, prev } = usePaginationStore();

  return (
    <div className="position-absolute top-0 end-0 d-flex gap-2 justify-content-end align-items-center mt-1">
      <Tooltip label="Anterior">
        <FastForwardFill
          color="orange"
          size={24}
          style={{ rotate: "-180deg" }}
          onClick={() => navigate(`../${prev}`, { replace: true })}
        />
      </Tooltip>
      <Tooltip label="Número de registro">
        <Badge className="fw-bold mx-2 fs-6">
          {getValues("registryNumber")}
        </Badge>
      </Tooltip>
      <Tooltip label="Siguiente">
        <FastForwardFill
          color="orange"
          size={24}
          onClick={() => navigate(`../${next}`, { replace: true })}
        />
      </Tooltip>
    </div>
  );
};

export default Paginator;

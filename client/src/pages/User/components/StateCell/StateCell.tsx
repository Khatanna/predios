import React from "react";
import { CircleFill } from "react-bootstrap-icons";

export type StateCellProps = {
  status: string;
};

const StateCell: React.FC<StateCellProps> = ({ status }) => {
  return (
    <div className="d-flex align-items-center gap-2">
      {status === "ENABLE" ? (
        <>
          Habilitado <CircleFill color="green" />
        </>
      ) : (
        <>
          Deshabilitado <CircleFill color="red" />
        </>
      )}
    </div>
  );
};

export default StateCell;

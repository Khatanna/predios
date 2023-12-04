import { CircleFill } from "react-bootstrap-icons";
import { memo } from "react";

type x = {
  label: string;
  color: string;
};

export type StateCellProps = {
  values: Record<string, x>;
  status?: string;
};

const StateCell: React.FC<StateCellProps> = memo(({ values, status }) => {
  const { label, color } = status
    ? values[status]
    : { label: "Indefinido", color: "orange" };
  return (
    <div className="d-flex align-items-center gap-2">
      <>{label}</> <CircleFill color={color} />
    </div>
  );
});

export default StateCell;

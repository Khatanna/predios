import {
  OverlayTrigger,
  OverlayTriggerProps,
  Tooltip as TooltipBoostrap,
} from "react-bootstrap";

export type TooltipProps = {
  label: string;
} & Omit<OverlayTriggerProps, 'overlay'>;

const Tooltip: React.FC<TooltipProps> = ({ placement, label, children }) => {
  return (
    <OverlayTrigger
      key={crypto.randomUUID()}
      placement={placement}
      overlay={
        <TooltipBoostrap id={crypto.randomUUID()}>{label}</TooltipBoostrap>
      }
    >
      {children}
    </OverlayTrigger>
  );
};

export default Tooltip;

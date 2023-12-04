import { memo } from "react";
import { PersonFill } from "react-bootstrap-icons";
import { Role } from "../../models/types";

export type RoleIconProps = Role;

const RoleIcon: React.FC<RoleIconProps> = memo(({ name }) => {
  return (
    <div className="d-flex align-items-center gap-2">
      <PersonFill size={20} color={name === "Usuario" ? "orange" : "green"} />
      {name}
    </div>
  );
});

export default RoleIcon;

import { memo } from "react";
import { PersonFill } from "react-bootstrap-icons";
import { Role } from "../../models/types";
import { normalizeString } from "../../utils/normalizeString";

export type RoleIconProps = Pick<Role, "name">;

const RoleIcon: React.FC<RoleIconProps> = memo(({ name }) => {
  return (
    <div className="d-flex align-items-center gap-2">
      <PersonFill
        size={20}
        color={normalizeString(name).includes("usuario") ? "orange" : "green"}
      />
      {name}
    </div>
  );
});

export default RoleIcon;

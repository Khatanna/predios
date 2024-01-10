import { memo } from "react";
import {
  PersonFill,
  PersonFillAdd,
  PersonFillExclamation,
  PersonFillGear,
} from "react-bootstrap-icons";
import { Role } from "../../models/types";
import { normalizeString } from "../../utils/normalizeString";

export type RoleIconProps = Pick<Role, "name">;
const size = 24;
const RoleIcon: React.FC<RoleIconProps> = memo(({ name }) => {
  const Icon =
    normalizeString(name) === "administrador" ? (
      <PersonFillGear color="green" size={size} />
    ) : normalizeString(name) === "usuario lector" ? (
      <PersonFillExclamation color="black" size={size} />
    ) : normalizeString(name) === "usuario editor" ? (
      <PersonFillAdd color="orange" size={size} />
    ) : (
      <PersonFill color="cyan" size={size} />
    );

  return (
    <div className="d-flex align-items-center gap-2">
      {Icon}
      {name}
    </div>
  );
});

export default RoleIcon;

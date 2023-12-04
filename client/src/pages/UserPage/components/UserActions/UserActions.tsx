import { memo } from "react";
import { PersonAdd } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { Tooltip } from "../../../../components/Tooltip";

export type UserActionsProps = {
  // types...
};

const UserActions: React.FC<UserActionsProps> = memo(() => {
  return (
    <Tooltip placement="left" label="Crear un nuevo usuario">
      <Link to={"/users/create"}>
        <PersonAdd role="button" size={"30"} />
      </Link>
    </Tooltip>
  );
});

export default UserActions;

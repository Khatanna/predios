import { Badge } from "react-bootstrap";
import { User } from "../../pages/UserPage/models/types";

export type PillUserProps = Pick<User, "username">;

const PillUser: React.FC<PillUserProps> = ({ username }) => {
  return (
    <Badge bg={"success"} className="position-absolute translate-middle-y" pill>
      {username}
    </Badge>
  );
};
export default PillUser;

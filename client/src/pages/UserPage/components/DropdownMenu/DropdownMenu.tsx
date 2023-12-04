import React from "react";
import { Dropdown, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DropdownMenu as Menu } from "../../../../components/DropdownMenu";
import { useUserDelete } from "../../hooks/useUserDelete";
import { useUserUpdateState } from "../../hooks/useUserUpdateState";
import { User } from "../../models/types";
export type DropdownMenuProps = {
  user: Omit<User, "createdAt">;
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({ user }) => {
  const { handleState, loading } = useUserUpdateState(user);
  const { handleDelete } = useUserDelete(user);

  if (loading) {
    return <Spinner size="sm" variant="warning" />;
  }

  return (
    <Menu>
      <Dropdown.Item as={Link} to="edit" state={user}>
        ✏ Editar
      </Dropdown.Item>
      <Dropdown.Item as={Link} to="permissions" state={user}>
        📑 Permisos
      </Dropdown.Item>
      <Dropdown.Item onClick={handleState}>
        {user.status === "ENABLE" ? "⛔ Deshabilitar" : "✔ Habilitar"}
      </Dropdown.Item>
      <Dropdown.Item onClick={handleDelete}>🗑 Eliminar</Dropdown.Item>
    </Menu>
  );
};

export default DropdownMenu;

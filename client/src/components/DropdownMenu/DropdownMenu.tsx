import React from "react";
import { Dropdown, DropdownProps } from "react-bootstrap";
import { ThreeDotsVertical } from "react-bootstrap-icons";
import { Tooltip } from "../Tooltip";

const DropdownMenu: React.FC<DropdownProps> = ({ children, ...props }) => {
  return (
    <Dropdown {...props}>
      <Tooltip label="Menú de opciones">
        <Dropdown.Toggle
          as={ThreeDotsVertical}
          variant="link"
          role="button"
          color="#186a3a"
        />
      </Tooltip>
      <Dropdown.Menu>{children}</Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownMenu;

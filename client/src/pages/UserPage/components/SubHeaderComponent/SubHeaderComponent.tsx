"use client";
import React from "react";
import { useUsersStore } from "../../state/useUsersStore";
import { Form } from "react-bootstrap";

export type SubHeaderComponentProps = {
  // types...
};

const SubHeaderComponent: React.FC<SubHeaderComponentProps> = React.memo(() => {
  const { filterText, setFilterText } = useUsersStore();

  return (
    <div className="d-flex justify-content-between align-items-center gap-3">
      <Form.Control
        size="sm"
        onChange={({ target: { value } }) => {
          setFilterText(value);
        }}
        value={filterText}
        placeholder="Buscar..."
        className="form-control"
        autoComplete="off"
      />
    </div>
  );
});

export default SubHeaderComponent;

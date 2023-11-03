import React from "react";
import { Alert } from "react-bootstrap";
import { TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router";
import { Chip } from "../../components/Chip";
import { StateCell } from "../../components/StateCell";
import { Table } from "../../components/Table";
import { useCustomQuery } from "../../hooks/useCustomQuery";
import { StateOfStatus, levels, resources } from "../../utilities/constants";
import { OptionMenu } from "./components/DropdownMenu";
import { Permission } from "./models/types";
import { Tooltip } from "../../components/Tooltip";
import { FileEarmarkLock } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const GET_ALL_PERMISSIONS_QUERY = `{
	permissions: getAllPermissions {
		id
		name
		description
		resource
		level
		status
		createdAt
	}
}`;

const columns: TableColumn<Permission>[] = [
  {
    name: "Nro",
    selector: (_row, index) => (index || 0) + 1,
    sortFunction: (a, b) => Number(a.createdAt) - Number(b.createdAt),
    width: "80px",
  },
  {
    name: "Nombre",
    selector: (row) => row.name,
    wrap: true,
    reorder: true,
  },
  {
    name: "Descripción",
    selector: (row) => row.description,
    wrap: true,
    reorder: true,
    grow: 2,
  },
  {
    name: "Recurso",
    cell: (row) => (
      <Chip
        text={resources[row.resource as keyof typeof resources]}
        background={row.resource}
      />
    ),
    reorder: true,
    sortFunction: (a, b) => a.resource.localeCompare(b.resource),
  },
  {
    name: "Nivel de acceso",
    cell: (row) => (
      <Chip
        text={levels[row.level as keyof typeof levels]}
        background={row.level}
        outline={true}
      />
    ),
    reorder: true,
    sortFunction: (a, b) => a.level.localeCompare(b.level),
  },
  {
    name: "Estado",
    cell: ({ status }) => <StateCell status={status} values={StateOfStatus} />,
    reorder: true,
    sortFunction: (a, b) => a.status.localeCompare(b.status),
  },
  {
    cell: (row) => <OptionMenu permission={row} />,
    button: true,
    width: "30px",
  },
];

const PermissionsLayout: React.FC = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useCustomQuery<{
    permissions: Permission[];
  }>(GET_ALL_PERMISSIONS_QUERY, ["getAllPermissions"]);

  if (error) {
    return (
      <div className="my-2">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <Table
      name="permisos"
      columns={columns}
      data={data?.permissions ?? []}
      onRowDoubleClicked={(row) =>
        navigate("/admin/permissions/edit", { state: row })
      }
      progressPending={isLoading}
      actions={
        <Tooltip placement="left" label="Crear nuevos permisos">
          <Link to={"create"}>
            <FileEarmarkLock size={30} />
          </Link>
        </Tooltip>
      }
    />
  );
};

export default PermissionsLayout;

import { Alert } from "react-bootstrap";
import { TableColumn } from "react-data-table-component";
import { useLocation } from "react-router";
import { Chip } from "../../../../components/Chip";
import { Table } from "../../../../components/Table";
import { useCustomQuery } from "../../../../hooks/useCustomQuery";
import {
  StateOfStatus,
  levels,
  resources
} from "../../../../utilities/constants";
import { Permission } from "../../../PermissionPage/models/types";
import { User } from "../../models/types";
import { StateCell } from "../../../../components/StateCell";
const GET_PERMISSION_BY_USERNAME = `query ($username: String) {
	data: getUserByUsername(username: $username) {
		role {
      name
      permissions {
        permission {
          name
          level
          resource
          description
          status
        }
        assignedBy
      }
    }
	}
}`;

export type Resource = keyof typeof resources;
type Level = keyof typeof levels;

const columns: TableColumn<{
  status: string;
  assignedBy: string
  permission: Permission;
}>[] = [
    {
      name: "Nro",
      selector: (_row, index) => (index || 0) + 1,
      width: "80px",
      sortFunction: (a, b) => Number(a.permission.createdAt) - Number(b.permission.createdAt),
    },
    {
      name: "Nombre",
      selector: (row) => row.permission.name,
      wrap: true,
      reorder: true,
    },
    {
      name: "Descripción",
      selector: (row) => row.permission.description,
      wrap: true,
      reorder: true,
      grow: 2,
    },
    {
      name: "Recurso",
      cell: (row) => (
        <Chip
          text={resources[row.permission.resource as Resource]}
          background={row.permission.resource}
        />
      ),
      reorder: true,
      sortFunction: (a, b) =>
        a.permission.resource.localeCompare(b.permission.resource),
    },
    {
      name: "Nivel de acceso",
      cell: (row) => (
        <Chip
          text={levels[row.permission.level as Level]}
          background={row.permission.level}
          outline={true}
        />
      ),
      reorder: true,
      sortFunction: (a, b) =>
        a.permission.level.localeCompare(b.permission.level),
    },
    {
      name: "Estado",
      cell: ({ permission: { status } }) => <StateCell status={status} values={StateOfStatus} />,
      reorder: true,
      sortFunction: (a, b) => a.status.localeCompare(b.status),
    },
    {
      name: 'Asignado por',
      selector: (row) => row.assignedBy
    },
  ];

const Permission: React.FC = () => {
  const { state } = useLocation();
  const username: string = state.username;

  const { data, isLoading, error } = useCustomQuery<{
    data: {
      permissions: {
        status: string;
        createdAt: string;
        permission: Permission;
        user: User;
      }[];
      role: {
        name: string
        permissions: {
          status: string;
          permission: Permission;
          assignedBy: string
        }[]
      }
    };
  }>(GET_PERMISSION_BY_USERNAME, ["getPermissionByUsername", { username }]);

  if (error) {
    return (
      <div className="my-2">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <Table
      name={`permisos del usuario (${state.username})`}
      columns={columns}
      data={data?.data.role.permissions ?? []}
      progressPending={isLoading}
      title={`Permisos del usuario: ${state.names.concat(
        " ",
        state.firstLastName,
        " ",
        state.secondLastName,
      )}`}
      pointerOnHover={false}
    />
  );
};

export default Permission;

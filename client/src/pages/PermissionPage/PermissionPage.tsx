import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { Alert, ListGroup, Modal } from "react-bootstrap";
import { FileEarmarkLock, PersonBadge } from "react-bootstrap-icons";
import { TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { Chip } from "../../components/Chip";
import { StateCell } from "../../components/StateCell";
import { Table } from "../../components/Table";
import { Tooltip } from "../../components/Tooltip";
import { StateOfStatus, levels, resources } from "../../utilities/constants";
import { Role } from "../UserPage/models/types";
import { capitalizeString } from "../UserPage/utils/capitalizeString";
import { OptionMenu } from "./components/DropdownMenu";
import { Permission } from "./models/types";

const GET_ALL_PERMISSIONS_QUERY = gql`{
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

const GET_ALL_ROLES = gql`
  query GetAllRoles {
    roles: getAllRoles {
      name
    }
  }
`;

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
];

export const PermissionTable: React.FC<{
  name: string;
  permissions: Permission[];
  isLoading: boolean;
  actions?: React.ReactNode;
  Dropdown: React.FC<{ permission: Permission }>;
}> = ({ name, permissions, isLoading, actions, Dropdown }) => {
  const navigate = useNavigate();

  return (
    <Table
      name={name}
      columns={[
        ...columns,
        {
          cell: (row) => <Dropdown permission={row} />,
          button: true,
          width: "30px",
        },
      ]}
      data={permissions}
      onRowDoubleClicked={(row) => {
        navigate("/admin/permissions/edit", { state: row });
      }}
      progressPending={isLoading}
      actions={actions}
    />
  );
};

const PermissionsLayout: React.FC = () => {
  const [show, setShow] = useState(false);
  const { data, error, loading } = useQuery<{
    permissions: Permission[];
  }>(GET_ALL_PERMISSIONS_QUERY);
  const { data: profiles } = useQuery<{ roles: Pick<Role, "name">[] }>(
    GET_ALL_ROLES,
  );

  if (error) {
    return (
      <div className="my-2">
        <Alert variant="danger">{error.message}</Alert>
      </div>
    );
  }

  return (
    <>
      <PermissionTable
        name="permisos"
        Dropdown={OptionMenu}
        permissions={data?.permissions ?? []}
        isLoading={loading}
        actions={
          <div className="d-flex gap-2">
            <Tooltip placement="left" label="Perfiles">
              <div
                className="text-primary"
                role="button"
                onClick={() => setShow(true)}
              >
                <PersonBadge size={30} />
              </div>
            </Tooltip>
            <Tooltip placement="left" label="Crear nuevos permisos">
              <Link to={"create"}>
                <FileEarmarkLock size={30} />
              </Link>
            </Tooltip>
          </div>
        }
      />
      <Modal show={show} onHide={() => setShow(false)} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>
            <div>Lista de perfiles</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {profiles?.roles.map(({ name }) => (
              <ListGroup.Item action as={Link} to={`${name}`}>
                {capitalizeString(name)}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PermissionsLayout;

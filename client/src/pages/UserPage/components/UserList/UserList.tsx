import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Alert } from "react-bootstrap";
import { PersonAdd, PersonFill } from "react-bootstrap-icons";
import { TableColumn } from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { StateCell } from "../../../../components/StateCell";
import { Table } from "../../../../components/Table";
import { Tooltip } from "../../../../components/Tooltip";
import { StateOfStatus, StatusConnection } from "../../../../utilities/constants";
import { userListAdapter } from "../../adapters/userList.adapter";
import { User } from "../../models/types";
import { useUsersStore } from "../../state/useUsersStore";
import { DropdownMenu } from "../DropdownMenu";
// import { UserProvider } from "../../context/UserContext";
import { GET_ALL_USERS_QUERY } from "../../GraphQL/types";
const columns: TableColumn<User>[] = [
  {
    name: "Nro",
    selector: (_row, index) => (index || 0) + 1,
    // sortFunction: (a, b) => a.names.localeCompare(b.names),
    width: "75px",
  },
  {
    name: "Nombre de usuario",
    selector: (row) => row.username,
    reorder: true,
    sortable: true
  },
  {
    name: "Nombres",
    selector: (row) =>
      row.names
        .split(/\s/)
        .map((w) => w[0] + w.slice(1).toLocaleLowerCase())
        .join(" "),
    reorder: true,
    sortable: true
  },
  {
    name: "Apellido Paterno",
    selector: (row) =>
      row.firstLastName[0] + row.firstLastName.slice(1).toLocaleLowerCase(),
    reorder: true,
    sortable: true,
  },
  {
    name: "Apellido Materno",
    selector: (row) =>
      row.secondLastName[0] + row.secondLastName.slice(1).toLocaleLowerCase(),
    reorder: true,
    sortable: true,
  },
  {
    name: "Rol",
    cell: ({ role: { name } }) => <div className="d-flex align-items-center gap-2">
      <PersonFill size={20} color={name === "Usuario" ? 'orange' : 'green'} />
      {name}
    </div>,
    reorder: true,
    sortFunction: (a, b) => a.role.name.localeCompare(b.role.name),
    sortable: true,
  },
  {
    name: "Tipo",
    selector: (row) => row.type.name,
    reorder: true,
  },
  {
    name: "Conexión",
    cell: ({ connection }) => (
      <StateCell
        status={connection}
        values={StatusConnection}
      />
    ),
  },
  {
    name: "Estado",
    cell: ({ status }) => <StateCell status={status} values={StateOfStatus} />,
    sortFunction: (a, b) => a.status.localeCompare(b.status),
    reorder: true,
  },
  {
    cell: (row) => <DropdownMenu user={row} />,
    button: true,
    width: "50px",
    allowOverflow: true,
  },
]

const SubHeaderComponent: React.FC = React.memo(() => {
  const { filterText, setFilterText } = useUsersStore();

  return (
    <div className="d-flex justify-content-between align-items-center gap-3">
      <input
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

const ActionsComponent: React.FC = React.memo(() => {
  return <Tooltip placement="left" label="Crear un nuevo usuario">
    <Link to={"/users/create"}>
      <PersonAdd role="button" size={"30"} />
    </Link>
  </Tooltip>
})

const UserList: React.FC = () => {
  const { filterText } = useUsersStore();
  const { loading, error, data } = useQuery<{ users: User[] }, { filterText: string }>(GET_ALL_USERS_QUERY, {
    variables: {
      filterText
    }
  });

  const navigate = useNavigate();
  if (error) {
    return (
      <div className="my-2">
        <Alert variant="danger">{error?.message ?? "No se encontro ningun usuario"}</Alert>
      </div>
    );
  }

  return (
    <Table
      name="usuarios"
      columns={columns}
      data={userListAdapter(data?.users)}
      progressPending={loading}
      paginationPerPage={20}
      dense
      onRowDoubleClicked={(row) => navigate("permissions", { state: row })}
      actions={<ActionsComponent />}
      subHeaderComponent={<SubHeaderComponent />}
    />
  );
};

export default UserList;

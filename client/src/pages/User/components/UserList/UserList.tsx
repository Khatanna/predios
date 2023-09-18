import { useMemo, useState } from "react";
import { Alert } from "react-bootstrap";
import { PersonAdd } from "react-bootstrap-icons";
import { TableColumn } from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { StateCell } from "../../../../components/StateCell";
import { Table } from "../../../../components/Table";
import { useCustomQuery } from "../../../../hooks/useCustomQuery";
import { User } from "../../models/types";
import { DropdownMenu } from "../DropdownMenu";

const columns: TableColumn<User>[] = [
  {
    name: "Nro",
    selector: (_row, index) => (index || 0) + 1,
    sortable: true,
    sortFunction: (a, b) => Number(a.createdAt) - Number(b.createdAt),
    width: "80px",
  },
  {
    name: "Nombre de usuario",
    selector: (row) => row.username,
    sortable: true,
    reorder: true,
  },
  {
    name: "Nombres",
    selector: (row) =>
      row.names
        .split(/\s/)
        .map((w) => w[0] + w.slice(1).toLocaleLowerCase())
        .join(" "),
    sortable: true,
    reorder: true,
  },
  {
    name: "Apellido Paterno",
    selector: (row) =>
      row.firstLastName[0] + row.firstLastName.slice(1).toLocaleLowerCase(),
    sortable: true,
    reorder: true,
  },
  {
    name: "Apellido Materno",
    selector: (row) =>
      row.secondLastName[0] + row.secondLastName.slice(1).toLocaleLowerCase(),
    sortable: true,
    reorder: true,
  },
  {
    name: "Tipo",
    selector: (row) => row.type.name,
    sortable: true,
    reorder: true,
  },
  {
    name: "Estado",
    cell: (row) => <StateCell status={row.status} />,
    sortable: true,
    reorder: true,
  },
  {
    cell: (row) => <DropdownMenu user={row} />,
    button: true,
    allowOverflow: true,
  },
];

const SubHeaderComponent: React.FC<{
  filterText: string;
  setFilterText: React.Dispatch<React.SetStateAction<string>>;
}> = ({ filterText, setFilterText }) => {
  return (
    <div className="d-flex justify-content-between align-items-center gap-3">
      <input
        onChange={(e) => {
          setFilterText(e.target.value.toLowerCase());
        }}
        value={filterText}
        placeholder="Buscar..."
        className="form-control"
        autoComplete="off"
      />
    </div>
  );
};

const GET_ALL_USERS_QUERY = `
  query AllUsers {
    allUsers {
      names
      username
			firstLastName
			secondLastName
      status
      createdAt
      typeId
      type {
        name
      }
    }
  }
`;

const UserList: React.FC = () => {
  const { isLoading, error, data } = useCustomQuery<{ allUsers: User[] }>(
    GET_ALL_USERS_QUERY,
    ["getAllUsers"],
  );
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");
  const subHeaderComponent = useMemo(() => {
    return (
      <SubHeaderComponent
        filterText={filterText}
        setFilterText={setFilterText}
      />
    );
  }, [filterText]);

  if (error) {
    return (
      <div className="my-2">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <Table
      name="usuarios"
      columns={columns}
      data={
        data?.allUsers.filter(
          (item) =>
            item.names.toLowerCase().includes(filterText) ||
            item.firstLastName.toLowerCase().includes(filterText) ||
            item.secondLastName.toLowerCase().includes(filterText) ||
            item.username.toLowerCase().includes(filterText) ||
            item.names
              .toLowerCase()
              .concat(
                " ",
                item.firstLastName.toLowerCase(),
                " ",
                item.secondLastName.toLowerCase(),
              )
              .includes(filterText),
        ) ?? []
      }
      progressPending={isLoading}
      onRowDoubleClicked={(row) => navigate("../edit", { state: row })}
      actions={
        <Link to={"/users/create"}>
          <PersonAdd role="button" size={"30"} />
        </Link>
      }
      subHeaderComponent={subHeaderComponent}
    />
  );
};

export default UserList;

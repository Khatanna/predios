import { Alert } from "react-bootstrap";
import { PersonAdd } from "react-bootstrap-icons";
import { TableColumn } from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "../../../../components/Icon";
import { StateCell } from "../../../../components/StateCell";
import { Table } from "../../../../components/Table";
import { StateOfStatus } from "../../../../utilities/constants";
import { useFetchUsers } from "../../hooks";
import { User } from "../../models/types";
import { useUsersStore } from "../../state/useUsersStore";
import { DropdownMenu } from "../DropdownMenu";

const columns: TableColumn<User>[] = [
  {
    name: "Nro",
    selector: (_row, index) => (index || 0) + 1,
    sortFunction: (a, b) => Number(a.createdAt) - Number(b.createdAt),
    width: "75px",
  },
  {
    name: "Nombre de usuario",
    selector: (row) => row.username,
    reorder: true,
  },
  {
    name: "Nombres",
    selector: (row) =>
      row.names
        .split(/\s/)
        .map((w) => w[0] + w.slice(1).toLocaleLowerCase())
        .join(" "),
    reorder: true,
  },
  {
    name: "Apellido Paterno",
    selector: (row) =>
      row.firstLastName[0] + row.firstLastName.slice(1).toLocaleLowerCase(),
    reorder: true,
  },
  {
    name: "Apellido Materno",
    selector: (row) =>
      row.secondLastName[0] + row.secondLastName.slice(1).toLocaleLowerCase(),
    reorder: true,
  },
  {
    name: "Tipo",
    selector: (row) => row.type.name,
    reorder: true,
  },
  {
    name: 'Conexión',
    cell: ({ connection }) => <StateCell status={connection} values={{
      "ONLINE": {
        label: 'En Linea',
        color: 'green'
      },
      "OFFLINE": {
        label: 'Desconectado',
        color: 'red'
      }
    }} />
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
    width: '30px',
    allowOverflow: true,
  },
];

const SubHeaderComponent: React.FC = () => {
  const { filterText, setFilterText } = useUsersStore()

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

// const UPDATE_STATE_OF_MANY_USERS = `
//   mutation UpdateStateOfManyUsers($input: UpdateStateOfPermissionUsersByUsernameInput) {
//     result: updateStateUsersByUsername(input: $input) {
//       count
//     }
//   }
// `

const UserList: React.FC = () => {
  const {
    users,
    total,
    currentPage,
    getNextPage,
    getPreviousPage,
    changeRowsPerPage,
    currentCount
  } = useUsersStore();
  const { isLoading, error, data } = useFetchUsers();
  const navigate = useNavigate();
  // const [rowsSelected, setSelectedRows] = useState<User[]>([]);
  // const [showContextMenu, setShowContextMenu] = useState(false);
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
      selectableRows
      data={Object.values(users)}
      progressPending={isLoading}
      onRowDoubleClicked={(row) => navigate("../permissions", { state: row })}
      actions={
        <Icon placement="left" label="Crear un nuevo usuario">
          <Link to={"/users/create"}>
            <PersonAdd role="button" size={"30"} />
          </Link>
        </Icon>
      }
      // contextActions={<ContextActions />}
      // clearSelectedRows={showContextMenu}
      //onSelectedRowsChange={({ selectedRows }) => setSelectedRows(selectedRows)}
      subHeaderComponent={<SubHeaderComponent />}
      paginationServer
      paginationTotalRows={total}
      paginationServerOptions={{
        persistSelectedOnPageChange: true,
        persistSelectedOnSort: true,
      }}
      paginationPerPage={currentCount}
      onChangeRowsPerPage={(numberOfResults) => {
        console.log(numberOfResults)
        changeRowsPerPage(numberOfResults)
      }}
      onChangePage={(page) => {
        if (currentPage < page) {
          getNextPage({ page, nextCursor: data?.results.nextCursor })
        }
        if (page < currentPage) {
          getPreviousPage({ page, prevCursor: data?.results.prevCursor })
        }
      }}
    />
  );
};

export default UserList;

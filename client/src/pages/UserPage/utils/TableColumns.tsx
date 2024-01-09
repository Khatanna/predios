import { TableColumn } from "react-data-table-component";
import { User } from "../models/types";
import { RoleIcon } from "../components/RoleIcon";
import { StateCell } from "../../../components/StateCell";
import { StateOfStatus, StatusConnection } from "../../../utilities/constants";
import { DropdownMenu } from "../components/DropdownMenu";
import { capitalizeString } from "./capitalizeString";

export const columns: TableColumn<User>[] = [
  {
    name: "Nro",
    selector: (_row, index) => (index || 0) + 1,
    width: "30px",
    right: true,
    compact: true,
  },
  {
    name: "Nombre de usuario",
    selector: ({ username }) => username,
    reorder: true,
    sortable: true,
  },
  {
    name: "Nombres",
    selector: ({ names }) => names,
    reorder: true,
    sortable: true,
  },
  {
    name: "Apellido Paterno",
    selector: ({ firstLastName }) => firstLastName,
    reorder: true,
    sortable: true,
  },
  {
    name: "Apellido Materno",
    selector: ({ secondLastName }) => secondLastName,
    reorder: true,
    sortable: true,
  },
  {
    name: "Rol",
    cell: ({ role: { name } }) => <RoleIcon name={capitalizeString(name)} />,
    reorder: true,
    sortFunction: (a, b) => a.role.name.localeCompare(b.role.name),
    sortable: true,
  },
  {
    name: "Tipo",
    selector: ({ type: { name } }) => name,
    reorder: true,
    sortable: true,
  },
  {
    name: "Conexión",
    cell: ({ connection }) => (
      <StateCell status={connection} values={StatusConnection} />
    ),
    sortable: true,
    sortFunction: (a, b) => a.connection.localeCompare(b.connection)
  },
  {
    name: "Estado",
    cell: ({ status }) => <StateCell status={status} values={StateOfStatus} />,
    sortFunction: (a, b) => a.status.localeCompare(b.status),
    reorder: true,
  },
  {
    cell: (user) => <DropdownMenu user={user} />,
    button: true,
    allowOverflow: true,
    width: "30px",
    center: true,
  },
];

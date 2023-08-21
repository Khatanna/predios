import React from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { User } from "../../models/types";
import { DropdownMenu } from "../DropdownMenu";
import { StateCell } from "../StateCell";
const columns: TableColumn<User>[] = [
  {
    name: "Nro",
    selector: (_row, index) => (index || 0) + 1,
    width: "100px",
  },
  {
    name: "Nombre de usuario",
    selector: (row) => row.username,
    sortable: true,
  },
  {
    name: "Nombres",
    selector: (row) => row.names,
    sortable: true,
  },
  {
    name: "Apellido Paterno",
    selector: (row) => row.firstLastName,
    sortable: true,
  },
  {
    name: "Apellido Materno",
    selector: (row) => row.secondLastName,
    sortable: true,
  },
  {
    name: "Tipo",
    selector: (row) => row.type?.name ?? "Indefinido",
    sortable: true,
  },
  {
    name: "Estado",
    cell: (row) => <StateCell status={row.status} />,
    sortable: true,
  },
  {
    cell: (row) => <DropdownMenu user={row} />,
    button: true,
  },
];

const paginationComponentOptions = {
  rowsPerPageText: "Filas por página",
  rangeSeparatorText: "de",
  selectAllRowsItem: true,
  selectAllRowsItemText: "Todos",
};

export type DataTableUserProps = {
  data: User[];
};

const DataTableUser: React.FC<DataTableUserProps> = ({ data }) => {
  return (
    <DataTable
      className="overflow-visible"
      columns={columns}
      data={data}
      pagination
      paginationComponentOptions={paginationComponentOptions}
      highlightOnHover
      responsive
      striped
    />
  );
};

export default DataTableUser;

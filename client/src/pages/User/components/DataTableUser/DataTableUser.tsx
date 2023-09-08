import React, { useMemo, useState } from "react";
import { ArrowDownShort, PersonAdd } from "react-bootstrap-icons";
import DataTable, { TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { StateCell } from "../../../../components/StateCell";
import { User } from "../../models/types";
import { DropdownMenu } from "../DropdownMenu";

const initialColumns: TableColumn<User>[] = [
  {
    name: "Nro",
    selector: (_row, index) => (index || 0) + 1,
    width: "100px",
    sortable: true,
    sortFunction: (a, b) => Number(a.createdAt) - Number(b.createdAt)
  },
  {
    name: "Nombre de usuario",
    selector: (row) => row.username,
    sortable: true,
    reorder: true
  },
  {
    name: "Nombres",
    selector: (row) => row.names.split(/\s/).map(w => w[0] + w.slice(1).toLocaleLowerCase()).join(' '),
    sortable: true,
    reorder: true
  },
  {
    name: "Apellido Paterno",
    selector: (row) => row.firstLastName[0] + row.firstLastName.slice(1).toLocaleLowerCase(),
    sortable: true,
    reorder: true
  },
  {
    name: "Apellido Materno",
    selector: (row) => row.secondLastName[0] + row.secondLastName.slice(1).toLocaleLowerCase(),
    sortable: true,
    reorder: true
  },
  {
    name: "Tipo",
    selector: (row) => row.type!.name,
    sortable: true,
    reorder: true
  },
  {
    name: 'Rol',
    selector: (row) => row.role === 'USER' ? 'Usuario' : 'Administrador',
    sortable: true,
    reorder: true
  },
  {
    name: "Estado",
    cell: (row) => <StateCell status={row.status} />,
    sortable: true,
    reorder: true,
  },
  {
    name: 'Opciones',
    cell: (row) => <DropdownMenu user={row} />,
    button: true,
  },
]

const paginationComponentOptions = {
  rowsPerPageText: "Usuarios por página",
  rangeSeparatorText: "de",
  selectAllRowsItem: true,
  selectAllRowsItemText: "Todos",
};

export type DataTableUserProps = {
  data: User[];
  isLoading: boolean
};

const SubHeaderComponent: React.FC<{ filterText: string, setFilterText: React.Dispatch<React.SetStateAction<string>> }> = ({ filterText, setFilterText }) => {
  return (
    <div className="d-flex justify-content-between align-items-center gap-3">

      <input onChange={e => {
        setFilterText(e.target.value.toLowerCase())
      }} value={filterText} placeholder="Buscar..." className="form-control" autoComplete="off" />
    </div>
  );
}

const getOrderedColumns = () => {
  const data = localStorage.getItem('columns');

  if (data) {
    const columns: string[] = JSON.parse(data);
    return columns.map((name) => initialColumns.find(column => column.name === name)!)
  }

  return initialColumns;
}

const DataTableUser: React.FC<DataTableUserProps> = ({ data, isLoading }) => {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState('');
  const filteredItems = data.filter(
    item => item.names.toLowerCase().includes(filterText) || item.firstLastName.toLowerCase().includes(filterText) || item.secondLastName.toLowerCase().includes(filterText) || item.username.toLowerCase().includes(filterText) || item.names.toLowerCase().concat(" ", item.firstLastName.toLowerCase(), " ", item.secondLastName.toLowerCase()).includes(filterText)
  );

  return (
    <DataTable
      className="overflow-visible"
      columns={getOrderedColumns()}
      actions={<Link to={"/users/create"} >
        <PersonAdd role="button" size={"30"} />
      </Link>}
      data={filteredItems}
      pagination
      paginationComponentOptions={paginationComponentOptions}
      highlightOnHover
      responsive
      striped
      pointerOnHover
      onRowDoubleClicked={(row) => navigate('../edit', { state: row })}
      sortIcon={<ArrowDownShort color="green" />}
      noDataComponent="No existen registros"
      persistTableHead
      title={"Lista de usuarios"}
      subHeader
      progressPending={isLoading}
      progressComponent={<div>cargando usuarios...</div>}
      subHeaderComponent={<SubHeaderComponent filterText={filterText} setFilterText={setFilterText} />}
      onColumnOrderChange={(nextOrder) => {
        localStorage.setItem('columns', JSON.stringify(nextOrder.map(c => c.name)))
      }}
    />
  );
};

export default DataTableUser;

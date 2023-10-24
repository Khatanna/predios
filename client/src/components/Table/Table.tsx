import { useMemo, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { ArrowDownShort } from "react-bootstrap-icons";
import DataTable, {
  TableProps
} from "react-data-table-component";

const Table = <T extends NonNullable<unknown>>(
  { name, ...props }: TableProps<T> & { name: string; },
) => {
  const paginationComponentOptions = useMemo(() => {
    const showName = name[0].toUpperCase() + name.slice(1);
    return {
      rowsPerPageText: `${showName} por página`,
      rangeSeparatorText: "de",
      selectAllRowsItem: true,
      selectAllRowsItemText: "Todos",

    };
  }, [name]);
  const [dense, setDense] = useState(props.dense);

  // const getOrderedColumns = useCallback(() => {
  //   const data = localStorage.getItem(`columns@${props.name}`);

  //   if (data) {
  //     const columns: string[] = JSON.parse(data);
  //     const rest = props.columns.filter((c) => !c.name);
  //     return columns
  //       .map((name) => props.columns.find((column) => column.name === name)!)
  //       .concat(rest);
  //   }

  //   return props.columns;
  // }, [props.columns, props.name]);

  return (
    <DataTable
      {...props}
      columns={props.columns.map(c => ({ ...c, sortable: true }))}
      striped
      pagination
      responsive
      className="overflow-visible"
      pointerOnHover={props.pointerOnHover ?? true}
      highlightOnHover
      selectableRowsHighlight
      onColumnOrderChange={(nextOrder) => {
        localStorage.setItem(
          `columns@user_permission`,
          JSON.stringify(nextOrder.filter((c) => c.name).map((c) => c.name)),
        );
      }}
      subHeader={Boolean(props.subHeaderComponent)}
      progressComponent={<div className="mt-5">
        <Spinner variant="success" />
      </div>}
      sortIcon={<ArrowDownShort color="green" />}
      paginationComponentOptions={paginationComponentOptions}
      noDataComponent="No hay registros por ahora"
      persistTableHead
      contextMessage={{
        message: "seleccionados",
        plural: "Elementos",
        singular: "Elementos",
      }}
      dense={dense}
      title={<div>
        <div>
          {`Lista de ${name}`}
        </div>
        <div className="fs-6 mt-2">
          <Form.Check
            type="switch"
            id="dense-switch"
            label="Comprimir"
            checked={dense}
            onChange={() => setDense(!dense)}
          />
        </div>
      </div>}
    />
  );
};

export default Table;

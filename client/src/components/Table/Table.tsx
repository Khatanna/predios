import { useCallback, useMemo } from "react";
import { ArrowDownShort, DistributeVertical } from "react-bootstrap-icons";
import DataTable, {
  TableProps,
  ContextMessage,
} from "react-data-table-component";

const messages: ContextMessage = {
  message: "",
  plural: "",
  singular: "",
};

const Table = <T extends NonNullable<unknown>>(
  props: TableProps<T> & { name: string },
) => {
  const paginationComponentOptions = useMemo(() => {
    const showName = props.name[0].toUpperCase() + props.name.slice(1);
    return {
      rowsPerPageText: `${showName} por página`,
      rangeSeparatorText: "de",
      selectAllRowsItem: true,
      selectAllRowsItemText: "Todos",
    };
  }, [props.name]);

  const getOrderedColumns = useCallback(() => {
    const data = localStorage.getItem(`columns@${props.name}`);

    if (data) {
      const columns: string[] = JSON.parse(data);
      const rest = props.columns.filter((c) => !c.name);
      return columns
        .map((name) => props.columns.find((column) => column.name === name)!)
        .concat(rest);
    }

    return props.columns;
  }, [props.columns, props.name]);
  // const customContext = c > <div>{c}</div>;
  return (
    <DataTable
      {...props}
      columns={getOrderedColumns()}
      striped
      pagination
      responsive
      className="overflow-visible"
      pointerOnHover={props.pointerOnHover ?? true}
      highlightOnHover
      onColumnOrderChange={(nextOrder) => {
        localStorage.setItem(
          `columns@user_permission`,
          JSON.stringify(nextOrder.filter((c) => c.name).map((c) => c.name)),
        );
      }}
      subHeader={Boolean(props.subHeaderComponent)}
      progressComponent={
        <div>cargando {props.name}...</div> /* mejor un spinner */
      }
      sortIcon={<ArrowDownShort color="green" />}
      paginationComponentOptions={paginationComponentOptions}
      noDataComponent="No hay registros por ahora"
      persistTableHead
      selectableRows
      // contextMessage={{
      //   message: props.name,
      //   plural: "seleccionados |",
      //   singular: "seleccionado |",
      // }}

      title={`Lista de ${props.name}`}
    />
  );
};

export default Table;

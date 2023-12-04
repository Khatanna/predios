import { useMemo, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { ArrowDownShort } from "react-bootstrap-icons";
import DataTable, { TableProps } from "react-data-table-component";

const Table = <T extends NonNullable<unknown>>({
  name,
  columns,
  ...props
}: TableProps<T> & { name: string }) => {
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

  return (
    <div className="d-flex flex-column h-100">
      <DataTable
        columns={columns}
        striped
        pagination
        responsive
        customStyles={{
          subHeader: {
            style: {
              flexGrow: 0,
            },
          },
          header: {
            style: {
              flexGrow: 0,
            },
          },
          tableWrapper: {
            style: {
              height: "100%",
            },
          },
        }}
        className="overflow-visible flex-grow-1"
        pointerOnHover={props.pointerOnHover ?? true}
        highlightOnHover
        selectableRowsHighlight
        subHeader={Boolean(props.subHeaderComponent)}
        progressComponent={
          <div className="d-flex flex-column align-items-center gap-2">
            <Spinner variant="primary" />
            <small className="fw-bold">Buscando los registros...</small>
          </div>
        }
        sortIcon={<ArrowDownShort color="red" />}
        paginationComponentOptions={paginationComponentOptions}
        noDataComponent="No hay registros por ahora"
        persistTableHead
        contextMessage={{
          message: "seleccionados",
          plural: "Elementos",
          singular: "Elementos",
        }}
        title={
          <div>
            <div>{`Lista de ${name}`}</div>
            <div className="fs-6 mt-2">
              <Form.Check
                type="switch"
                id="dense-switch"
                label="Comprimir"
                checked={dense}
                onChange={() => setDense(!dense)}
              />
            </div>
          </div>
        }
        {...props}
        dense={dense}
      />
    </div>
  );
};

export default Table;

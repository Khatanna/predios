import { gql, useQuery } from "@apollo/client";
import { Alert, Form } from "react-bootstrap";
import { FileEarmarkPlus } from "react-bootstrap-icons";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { Table } from "../../../../components/Table";
import { Tooltip } from "../../../../components/Tooltip";
import { useAuthStore } from "../../../../state/useAuthStore";
import { ResponsibleUnit } from "../../../ResponsibleUnitPage/models/types";
import { Property } from "../../models/types";
import { ModalReportButton } from "../ModalReportButton";
import { usePropertyListStore } from "../../state/usePropertyListStore";
import { DropdownMenu } from "../DropdownMenu";
import { useColumnPropertyStore } from '../../state/useColumnPropertyStore';

export const GET_ALL_PROPERTIES_QUERY = gql`
  query GetProperties(
    $page: Int
    $limit: Int
    $fieldOrder: String
    $orderBy: String
    $unit: String
  ) {
    results: getProperties(
      page: $page
      limit: $limit
      fieldOrder: $fieldOrder
      orderBy: $orderBy
      unit: $unit
    ) {
      total
      properties {
        id
        name
        code
        registryNumber
        codeOfSearch
        createdAt
        city {
          name
        }
        province {
          name
          code
        }
        municipality {
          name
        }
        type {
          name
        }
        state {
          name
        }
        reference {
          name
        }
        responsibleUnit {
          name
        }
      }
    }
  }
`;

const GET_ALL_UNITS = gql`
  query GetAllUnits {
    units: getAllUnits {
      name
    }
  }
`;

const PropertyList: React.FC = () => {
  const navigate = useNavigate();
  const { can } = useAuthStore();
  const {
    page,
    limit,
    fieldOrder,
    orderBy,
    unit,
    setPage,
    setLimit,
    setFieldOrder,
    setUnit,
  } = usePropertyListStore();
  const { columns, showColumns, toogleShowColumn, isChecked } = useColumnPropertyStore();
  const { data, loading, error } = useQuery<{
    results: { total: number; properties: Property[] };
  }>(GET_ALL_PROPERTIES_QUERY, {
    variables: {
      page,
      limit,
      orderBy,
      unit,
      fieldOrder,
    },
  });

  const { data: unitsResponse } = useQuery<{
    units: ResponsibleUnit[];
  }>(GET_ALL_UNITS);

  if (error) {
    return (
      <div className="my-2">
        <Alert variant="danger">
          {error.message ?? "Ocurrio un error al listar los predios"}
        </Alert>
      </div>
    );
  }

  return (
    <>
      <Table
        name="predios"
        subHeader
        subHeaderComponent={<div className="d-flex gap-3">
          {showColumns.map((name) => (
            <Form.Check
              value={name}
              label={name}
              id={name}
              checked={isChecked(name)}
              onChange={() => {
                toogleShowColumn(name)
              }}
            />
          ))}
        </div>}
        columns={columns.concat(can('DELETE@PROPERTY') ? {
          cell: (row) => <DropdownMenu property={row} />,
          button: true,
          allowOverflow: true,
          width: "30px",
          center: true,
        } : [])}
        data={data?.results.properties ?? []}
        progressPending={loading}
        dense
        defaultSortAsc={orderBy === 'desc'}
        sortServer
        onSort={(column, orderBy) => {
          if (!column.sortField) return;
          setFieldOrder(column.sortField as keyof Property, orderBy);
        }}
        onRowDoubleClicked={(row) => {
          navigate(`${row.id}`);
        }}
        paginationServer
        paginationTotalRows={data?.results.total ?? 0}
        paginationPerPage={limit}
        paginationRowsPerPageOptions={[10, 20, 30, 50, data?.results.total ?? 60]}
        onChangePage={(page) => {
          setPage(page);
        }}
        onChangeRowsPerPage={setLimit}
        actions={
          <div className="d-flex gap-2 align-items-center">
            {can("READ@UNIT") && (
              <Form.Select
                onChange={({ target }) => setUnit(target.value)}
                defaultValue={"all"}
                value={unit}
              >
                <option value={"all"}>Todas las unidades</option>
                {unitsResponse?.units.map((u) => (
                  <option value={u.name}>{u.name}</option>
                ))}
              </Form.Select>
            )}
            {can("CREATE@PROPERTY") && (
              <Tooltip label="Crear predio">
                <Link to={"create"}>
                  <FileEarmarkPlus size={36} />
                </Link>
              </Tooltip>
            )}
            <ModalReportButton max={data?.results.total ?? 0} />
            {/* <Tooltip label="Cargar predios">
            <div>
              <JournalPlus size={36} color="red" role="button" />
            </div>
          </Tooltip> */}
          </div>
        }
      />
    </>
  );
};

export default PropertyList;

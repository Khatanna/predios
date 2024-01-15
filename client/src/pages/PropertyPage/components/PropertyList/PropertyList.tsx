import { gql, useQuery } from "@apollo/client";
import { Alert, Form } from "react-bootstrap";
import { FileEarmarkPlus } from "react-bootstrap-icons";
import { TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { Table } from "../../../../components/Table";
import { Tooltip } from "../../../../components/Tooltip";
import { useAuthStore } from "../../../../state/useAuthStore";
import { ResponsibleUnit } from "../../../ResponsibleUnitPage/models/types";
import { Property } from "../../models/types";
import { ModalReportButton } from "../ModalReportButton";
import { usePropertyListStore } from "../../state/usePropertyListStore";

const columns: TableColumn<Property>[] = [
  {
    name: "Nro",
    selector: ({ registryNumber }) => `${registryNumber}`,
    right: true,
    compact: true,
    width: "40px",
    sortable: true,
    sortField: "registryNumber",
  },
  {
    name: "Nombre del predio",
    selector: (row) => row.name,
    wrap: true,
    grow: 2,
    sortable: true,
    sortField: "name",
  },
  {
    name: "Codigo de busqueda",
    selector: (row) => row.codeOfSearch ?? "Sin codigo",
    sortable: true,
    sortField: "codeOfSearch",
  },
  {
    name: "Estado",
    selector: (row) => row.state?.name ?? "Sin estado definido",
    grow: 2,
  },
  // {
  //   name: "Tipo de predio",
  //   selector: (row) => row.type?.name ?? "Sin definir",
  //   sortable: true,
  // },
  {
    name: "Ubicación",
    selector: ({ city, province, municipality }) =>
      `${city?.name} - ${province?.name} / ${municipality?.name}`,
    grow: 2,
  },
  {
    name: "Unidad responsable",
    selector: (row) => row.responsibleUnit?.name ?? "Sin unidad",
  },
];

const GET_ALL_PROPERTIES_QUERY = gql`
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
        columns={columns}
        data={data?.results.properties ?? []}
        progressPending={loading}
        dense
        defaultSortAsc={false}
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
        paginationPerPage={20}
        paginationRowsPerPageOptions={[10, 20, 30, 50, 100, 200]}
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

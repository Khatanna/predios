import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useCustomQuery } from "../../../../hooks/useCustomQuery";
import { Property } from "../../models/types";
import { Tooltip } from "../../../../components/Tooltip";
import { Link } from "react-router-dom";
import { HouseAdd } from "react-bootstrap-icons";
import { TableColumn } from "react-data-table-component";
import { Table } from "../../../../components/Table";
import { useAuth } from "../../../../hooks";
import { Alert } from "react-bootstrap";

export type PropertyListProps = {};
const columns: TableColumn<Property>[] = [
  {
    name: "Nro",
    selector: ({ registryNumber }) => `${registryNumber}`,
    right: true,
    compact: true,
    width: "40px",
    sortable: true,
    sortField: 'registryNumber',
  },
  {
    name: "Nombre del predio",
    selector: (row) => row.name,
    wrap: true,
    grow: 2,
    sortable: true,
  },
  {
    name: "Codigo",
    selector: (row) => row.code ?? "Sin codigo",
  },
  {
    name: "Estado",
    selector: (row) => row.state?.name ?? "Sin estado definido",
    grow: 2,
    sortable: true,
  },
  {
    name: "Tipo de predio",
    selector: (row) => row.type?.name ?? "Sin definir",
    sortable: true,
  },
  {
    name: 'Ubicación',
    selector: ({ city, province, municipality }) => `${city?.name} - ${province?.name} / ${municipality?.name}`,
    grow: 2,
    sortable: true,
  }
];

const GET_ALL_PROPERTIES_QUERY = `
	query GetProperties($page: Int, $limit: Int, $orderBy: String) {
		results: getProperties(page: $page, limit: $limit, orderBy: $orderBy) {
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
      }
		}
	}
`;

const PropertyList: React.FC<PropertyListProps> = ({ }) => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [orderBy, setOrderBy] = useState('asc');
  const { data, isLoading, error } = useCustomQuery<{ results: { total: number, properties: Property[] } }>(
    GET_ALL_PROPERTIES_QUERY,
    ["getAllProperties", { page, limit, orderBy }],
  );

  if (error) {
    return (
      <div className="my-2">
        <Alert variant="danger">
          {error ?? "Ocurrio un error al listar los predios"}
        </Alert>
      </div>
    );
  }

  return (
    <Table
      name="predios"
      columns={columns}
      data={data?.results.properties ?? []}
      progressPending={isLoading}
      dense
      defaultSortAsc={false}
      onSort={(column) => {
        if (column.sortField === 'registryNumber') {
          setOrderBy((current) => {
            if (current === 'asc') {
              return 'desc'
            }

            return 'asc'
          })
        }
      }}
      onRowDoubleClicked={(row) => {
        navigate(`${row.id}`);
      }}
      paginationServer
      paginationTotalRows={data?.results.total ?? 0}
      paginationPerPage={20}
      paginationRowsPerPageOptions={[10, 20, 30, 50, 100, 200]}
      onChangePage={(page) => {
        setPage(page)
      }}
      onChangeRowsPerPage={setLimit}
      actions={
        role === "administrador" &&
        <Tooltip label="Crear predio">
          <Link to={"create"}>
            <HouseAdd size={30} />
          </Link>
        </Tooltip>
      }
    />
  );
};

export default PropertyList;

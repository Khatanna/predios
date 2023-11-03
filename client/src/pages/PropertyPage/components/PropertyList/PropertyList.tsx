import React from "react";
import { useNavigate } from "react-router";
import { useCustomQuery } from "../../../../hooks/useCustomQuery";
import { Property } from "../../models/types";
import { Tooltip } from "../../../../components/Tooltip";
import { Link } from "react-router-dom";
import { HouseAdd } from "react-bootstrap-icons";
import { TableColumn } from "react-data-table-component";
import { Table } from "../../../../components/Table";

export type PropertyListProps = {};
const columns: TableColumn<Property>[] = [
  {
    name: "Nro",
    selector: (_row, index) => (index || 0) + 1,
    width: "80px",
    sortFunction: (a, b) => +a.createdAt - +b.createdAt,
  },
  {
    name: "Nombre del predio",
    selector: (row) => row.name,
    wrap: true,
  },
  {
    name: "Codigo",
    selector: (row) => row.code ?? "Sin codigo",
  },
  {
    name: "Codigo de busqueda",
    selector: (row) => row.codeOfSearch ?? "Sin codigo de busqueda",
  },
  {
    name: "Tipo de predio",
    selector: (row) => row.type?.name ?? "Sin definir",
  },
  {
    name: "Departamento",
    selector: (row) => row.city?.name ?? "Sin definir",
  },
  {
    name: "Provincia",
    selector: (row) => row.province?.name ?? "Sin definir",
  },
  {
    name: "Municipio",
    selector: (row) => row.municipality?.name ?? "Sin definir",
  },
];

const GET_ALL_PROPERTIES_QUERY = `
	query {
		properties: getAllProperties {
			id
			name
			code
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
		}
	}
`;

const PropertyList: React.FC<PropertyListProps> = ({}) => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useCustomQuery<{ properties: Property[] }>(
    GET_ALL_PROPERTIES_QUERY,
    ["getAllProperties"],
  );
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Table
      name="predios"
      columns={columns}
      data={data?.properties ?? []}
      progressPending={isLoading}
      dense
      onRowDoubleClicked={(row) => {
        navigate(`${row.id}`);
      }}
      actions={
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

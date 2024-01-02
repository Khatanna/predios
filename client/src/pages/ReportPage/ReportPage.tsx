import { useState } from 'react';
import { gql, useQuery } from "@apollo/client";
import ReactPDF, {
  PDFViewer,
  Document,
  Text,
  Page,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { Property } from "../PropertyPage/models/types";

const globalStyles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row"
  },
  tableCol: {
    width: "14.28%",
    paddingBottom: '5px',
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCell: {
    // margin: "auto",
    marginTop: 5,
    fontSize: 10,
    padding: '2px'
  }
});
const Cell: React.FC<{ children: React.ReactNode, styles?: ReactPDF.Styles[string] }> = ({ children, styles }) => {
  return <View style={{ ...globalStyles.tableCell, ...styles }}>
    <Text>{children}</Text>
  </View>
}
const Td: React.FC<{ children: React.ReactNode, styles?: ReactPDF.Styles[string] }> = ({ children, styles }) => {
  return <View style={{ ...globalStyles.tableCol, ...styles }}>
    {children}
  </View>
}
const Tr: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <View style={globalStyles.tableRow}>
    {children}
  </View>
}
const Table: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <View style={globalStyles.table}>
    {children}
  </View>
}

const DATA = gql`
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
        activity {
          name
        }
        clasification {
          name
        }
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
`

const ReportPage: React.FC = () => {
  const { data, error } = useQuery<{
    results: {
      properties: Array<Property>
    }
  }>(DATA, {
    variables: {
      page: 1,
      limit: 20,
      orderBy: 'asc'
    }
  });

  const [showName, setShowName] = useState(true);
  return (
    <div className="w-100 vh-100">
      {/* <label>
        nombre
        <input type="checkbox" value={showName} onChange={() => setShowName(!showName)} />
      </label> */}
      <PDFViewer width={'100%'} height={'100%'}>
        <Document >
          <Page size="A4" style={globalStyles.body} >
            <Table>
              <Tr>
                {showName && <Td styles={{ width: '25%' }}>
                  <Cell>Nombre</Cell>
                </Td>}
                <Td styles={{ width: '15%' }}>
                  <Cell styles={{ margin: 'auto' }}>Codigo</Cell>
                </Td>
                <Td styles={{ width: '25%' }}>
                  <Cell>Estado</Cell>
                </Td>
                <Td >
                  <Cell styles={{ margin: 'auto' }}>Actividad</Cell>
                </Td>
                <Td styles={{ width: '20%' }}>
                  <Cell styles={{ margin: 'auto' }}>Clasificación</Cell>
                </Td>
              </Tr>
              {data?.results.properties.map(p => (
                <Tr>
                  {showName && <Td styles={{ width: '25%' }}>
                    <Cell>{p.name}</Cell>
                  </Td>}
                  <Td styles={{ width: '15%' }}>
                    <Cell styles={{ margin: 'auto' }}>{p.code}</Cell>
                  </Td>
                  <Td styles={{ width: '25%' }}>
                    <Cell>{p.state?.name}</Cell>
                  </Td>
                  <Td>
                    <Cell styles={{ margin: 'auto' }}>{p.activity?.name}</Cell>
                  </Td>
                  <Td styles={{ width: '20%' }}>
                    <Cell styles={{ margin: 'auto' }}>{p.clasification?.name}</Cell>
                  </Td>
                </Tr>
              ))}
            </Table>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  );
};

export default ReportPage;

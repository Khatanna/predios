import {
  PDFViewer,
  Document,
  Text,
  Page,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const ReportPage: React.FC = () => {
  return (
    <PDFViewer className="w-100 vh-100">
      <Document pageMode="fullScreen">
        <Page size="A4" debug>
          <View>
            <Text>Section #1</Text>
          </View>
          <View>
            <Text>Section #2</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default ReportPage;

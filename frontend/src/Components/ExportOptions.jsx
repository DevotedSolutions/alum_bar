import { Button } from "@mui/material";
import React from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { CSVLink } from "react-csv";

const MyPDF = ({ data }) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = currentDate.toLocaleTimeString();

  const chunkedData = [];
  for (let i = 0; i < data.length; i += 25) {
    chunkedData.push(data.slice(i, i + 25));
  }

  return (
    <Document>
      {chunkedData.map((chunk, index) => (
        <Page key={index} size={"A4"} style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.header}>Inventory Overview</Text>
            <Text style={styles.dateTime}>Page: {index + 1}</Text>
            <Text style={styles.dateTime}>
              Generated on:
              {formattedDate} at {formattedTime}
            </Text>

            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.columnHeader}>Code</Text>
                <Text style={styles.columnHeader}>Name</Text>
                <Text style={styles.columnHeader}>Description</Text>
                <Text style={styles.columnHeader}>Quantity</Text>
              </View>

              {/* Map through data chunk and create table rows */}
              {chunk.map((item) => (
                <View style={styles.tableRow} key={item.code}>
                  <Text style={styles.column}>{item.code}</Text>
                  <Text style={styles.column}>{item.name}</Text>
                  <Text style={styles.column}>{item.description}</Text>
                  <Text style={styles.column}>{item.quantity}</Text>
                </View>
              ))}
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
  },
  dateTime: {
    fontSize: 12,
    marginBottom: 10,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    backgroundColor: "#F2F2F2",
    pageBreakInside: "avoid", // Avoid page break within rows
  },
  columnHeader: {
    width: "25%",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 5,
    fontWeight: "bold",
    fontSize: 10, // Small font size
  },
  column: {
    width: "25%",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 5,
    fontSize: 10, // Small font size
  },
});

const ExportOptions = ({ data }) => {
  const myDataAll = data?.map((obj) => {
    const newObj = {
      code: obj?.productcode,
      name: obj?.productName,
      description: obj?.productDescription,
      quantity: obj?.quantity,
    };

    return newObj; // Return the modified object
  });

  const myData = myDataAll.sort((a, b) => {
    if (a.code < b.code) return -1;
    if (a.code > b.code) return 1;

    if (a.description < b.description) return -1;
    if (a.description > b.description) return 1;

    return 0;
  });

  return (
    <div>
      <Button
        sx={{
          borderRadius: "8px",
          padding: "7px 20px",
          textTransform: "capitalize",
          margin: "0px 12px",
        }}
        variant="contained"
      >
        <PDFDownloadLink
          style={{ color: "white", textDecoration: "none" }}
          document={<MyPDF data={myData} />}
          fileName="data.pdf"
        >
          Export as PDF
        </PDFDownloadLink>
      </Button>

      <Button
        sx={{
          borderRadius: "8px",
          padding: "7px 20px",
          textTransform: "capitalize",
        }}
        variant="contained"
      >
        <CSVLink
          data={myData}
          filename="data.csv"
          style={{ color: "white", textDecoration: "none" }}
        >
          Export as CSV
        </CSVLink>
      </Button>
    </div>
  );
};

export default ExportOptions;

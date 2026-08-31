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

  const exportBtnSx = {
    height: "44px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#fff",
    border: "1px solid #D8DCE0",
    color: "#2C323A",
    borderRadius: "6px",
    padding: "0 18px",
    fontSize: "14px",
    fontWeight: 500,
    textTransform: "none",
    boxShadow: "none",
    "&:hover": { borderColor: "#0D8B92", color: "#0D8B92", background: "#fff", boxShadow: "none" },
  };

  const docIcon = (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3v5h5" />
      <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
    </svg>
  );

  return (
    <div style={{ display: "flex", gap: "12px" }}>
      <Button sx={exportBtnSx}>
        <PDFDownloadLink
          style={{ color: "inherit", textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}
          document={<MyPDF data={myData} />}
          fileName="data.pdf"
        >
          {docIcon}
          Export as PDF
        </PDFDownloadLink>
      </Button>

      <Button sx={exportBtnSx}>
        <CSVLink
          data={myData}
          filename="data.csv"
          style={{ color: "inherit", textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}
        >
          {docIcon}
          Export as CSV
        </CSVLink>
      </Button>
    </div>
  );
};

export default ExportOptions;

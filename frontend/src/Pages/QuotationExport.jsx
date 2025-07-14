import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Grid,
  TextField,
} from "@mui/material";
import {
  Assignment,
  CheckCircle,
  HourglassEmpty,
  Add,
  Info,
  Delete,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import { getAllQuotations } from "../services/designation/getAllDesignation";
import { deleteQuotation } from "../services/designation/deleteDesignation";
import { DeleteOutlineTwoTone } from "@mui/icons-material";

const styles = {
  root: {
    padding: "16px",
  },
  addButton: {
    marginBottom: "30px",
  },
  table: {
    width: "850px",
  },
};

const QuotationExport = () => {
  const [quotations, setquotations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [update, setUpdate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, [update]);

  async function getData() {
    try {
      const resp = await getAllQuotations();
      if (resp.status === 200) {
        setquotations(resp.data);
        // setTotalPages(resp.data.totalPages);
      } else {
        toast.error(resp.data.message);
      }
    } catch (error) {
      toast.error("Check network connection");
    }
  }

  return (
    <div
      style={{
        padding: "16px",
        width: "100%",
      }}
    >
      <Grid container width={"100%"} justifyContent={"center"}>
        <TableContainer component={Paper} style={styles.table}>
          <TextField
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            placeholder="Search..."
            sx={{
              margin: "15px",
            }}
          />
          <Table style={styles.table} aria-label="Job Sheets">
            <TableHead>
              <TableRow>
                <TableCell>Client Name</TableCell>
                <TableCell>Devis Number</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Quotation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quotations
                ?.filter(
                  (item) =>
                    item?.clientName
                      ?.toUpperCase()
                      ?.includes(searchQuery?.toUpperCase()) ||
                    item?.email
                      ?.toUpperCase()
                      ?.includes(searchQuery?.toUpperCase()) ||
                    item?.phone
                      ?.toUpperCase()
                      ?.includes(searchQuery?.toUpperCase()) ||
                    item?.devisNumber
                      ?.toUpperCase()
                      ?.includes(searchQuery?.toUpperCase())
                )
                .map((sheet) => (
                  <TableRow key={sheet.id}>
                    <TableCell>{sheet.clientName}</TableCell>
                    <TableCell>{sheet.devisNumber}</TableCell>
                    <TableCell>{sheet.phone}</TableCell>
                    <TableCell>{sheet.email}</TableCell>
                    <TableCell>
                      {moment(sheet.uploadedAt).format("YYYY-MM-DD HH:mm")}
                    </TableCell>
                    <TableCell
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <a
                        href={`https://app.noutfermeture.com/api/${sheet?.filePath}`}
                        target="_blank"
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        <Button
                          edge="end"
                          variant="contained"
                          size="small"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            textTransform: "capitalize",
                          }}
                        >
                          Download
                        </Button>
                      </a>
                      <IconButton
                        onClick={async () => {
                          console.log(sheet);
                          const response = await deleteQuotation(sheet?._id);
                          toast?.success(response?.data?.message);

                          setUpdate(!update);
                        }}
                      >
                        <DeleteOutlineTwoTone
                          style={{
                            color: "#FF0000",
                          }}
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </div>
  );
};

export default QuotationExport;

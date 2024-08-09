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
import {
  addNewJobSheet,
  deleteJobSheet,
  getAllJobSheets,
} from "../services/jobSheets/getAllJobSheets";
import { toast } from "react-toastify";
import moment from "moment";
import JobSheetPopup from "../Components/jobSheets/createJobSheet";

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

const JobSheetPage = () => {
  const [jobSheets, setJobSheets] = useState([]);
  const [update, setUpdate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, [update]);

  async function getData() {
    try {
      const resp = await getAllJobSheets();
      if (resp.status === 200) {
        setJobSheets(resp.data);
        // setTotalPages(resp.data.totalPages);
      } else {
        toast.error(resp.data.message);
      }
    } catch (error) {
      toast.error("Check network connection");
    }
  }

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleCreateJobSheet = async (type) => {
    try {
      const resp = await addNewJobSheet({
        type,
      });
      if (resp.status === 200) {
        setUpdate(!update);
        toast.success("Job Sheet Added");
      } else {
        toast.error(resp.data.message);
      }
    } catch (error) {
      toast.error("Check network connection");
    }
  };

  return (
    <div
      style={{
        padding: "16px",
        width: "100%",
      }}
    >
      <Grid container width={"100%"} justifyContent={"flex-start"}>
        <Button
          variant="contained"
          color="primary"
          style={styles.addButton}
          startIcon={<Add />}
          onClick={() => {
            setIsPopupOpen(!isPopupOpen);
          }}
        >
          Add New Job Sheet
        </Button>

        <JobSheetPopup
          open={isPopupOpen}
          onClose={handleClosePopup}
          onCreate={handleCreateJobSheet}
        />
      </Grid>
      <Grid container width={"100%"} justifyContent={"center"}>
        <TableContainer component={Paper} style={styles.table}>
          <Table style={styles.table} aria-label="Job Sheets">
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>Sheets Inside</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobSheets.map((sheet) => (
                <TableRow key={sheet.id}>
                  <TableCell>
                    {sheet.completed ? (
                      <CheckCircle color="success" />
                    ) : sheet.numberOfSheets > 0 ? (
                      <HourglassEmpty color="secondary" />
                    ) : (
                      <Assignment color="error" />
                    )}
                  </TableCell>
                  <TableCell>{sheet.type}</TableCell>
                  <TableCell>
                    {moment(sheet.createdAt).format("YYYY-MM-DD HH:mm")}
                  </TableCell>
                  <TableCell>{sheet.numberOfSheets}</TableCell>
                  <TableCell>
                    <Button
                      edge="end"
                      variant="contained"
                      size="small"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        textTransform: "capitalize",
                      }}
                      onClick={() => {
                        navigate(`${sheet._id}`);
                      }}
                    >
                      <Info style={{ paddingRight: "5px" }} /> Details
                    </Button>
                  </TableCell>

                  <TableCell>
                    <IconButton
                      edge="end"
                      style={{ paddingLeft: "12px" }}
                      onClick={async () => {
                        const resp = await deleteJobSheet(sheet._id);
                        if (resp.status === 200) {
                          setUpdate(!update);
                          toast.success("Product deleted successfully!");
                        } else {
                          toast.error("Could not delete the product");
                        }
                      }}
                    >
                      <Delete color="error" />
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

export default JobSheetPage;

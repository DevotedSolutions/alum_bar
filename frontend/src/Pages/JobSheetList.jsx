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
  Typography,
} from "@mui/material";
import {
  Add,
  Info,
  Delete,
  ArrowLeftOutlined,
  CalculateOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  GetSheetOptimization,
  createFrappeExcel,
  deleteSheet,
  getFrappeJobSheets,
  getSumFrappeJS,
} from "../services/jobSheets/getAllJobSheets";
import { toast } from "react-toastify";
import moment from "moment";
import { useParams } from "react-router-dom";
import GlazzingTable from "../Components/jobSheets/GlazzingTable";
import OptimizedSheetTable from "../Components/jobSheets/OptimizationTable";

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

const JobSheetList = () => {
  const [jobSheets, setJobSheets] = useState([]);
  const [update, setUpdate] = useState(false);
  const [sumData, setSumData] = useState({
    sumVT: [],
    sumAcc: [],
    sumProfiles: [],
  });
  const [optimizedData, setOptimizedData] = useState([]);
  const [excelExport, setExcelExport] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    getData();
  }, [update]);

  async function getData() {
    try {
      const resp = await getFrappeJobSheets(id);
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
  useEffect(() => {
    if (sumData.sumProfiles) {
      getOptimizedSheets(sumData.sumProfiles).then((sheetData) => {
        setOptimizedData([...sheetData]);
      });
    }
  }, [sumData.sumProfiles]);

  async function getOptimizedSheets(data) {
    const groupedByCode = data.reduce((acc, item) => {
      if (!acc[item.code]) acc[item.code] = [];
      acc[item.code].push(item);
      return acc;
    }, {});

    const result = await Promise.all(
      Object.keys(groupedByCode).map(async (code) => ({
        code,
        optimizedSheet: await optimizeSheet(code, groupedByCode[code]),
      }))
    );

    return result;
  }

  async function optimizeSheet(code, data) {
    const codeData = data.filter((item) => item.code === code);
    try {
      const resp = await GetSheetOptimization([...codeData]);
      if (resp.status === 200) {
        return resp.data;
      } else {
        toast.error(resp.data.message);
        return null;
      }
    } catch (error) {
      toast.error("Check network connection");
      return null;
    }
  }

  const navigate = useNavigate();

  return (
    <div
      style={{
        padding: "16px",
        width: "100%",
      }}
    >
      <Button
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: "12px",
        }}
        onClick={() => {
          navigate(-1);
        }}
      >
        <ArrowLeftOutlined /> Back
      </Button>
      <Grid container width={"100%"} justifyContent={"flex-start"}>
        <Button
          variant="contained"
          color="primary"
          style={styles.addButton}
          startIcon={<Add />}
          onClick={() => {
            navigate(`newSheet`);
          }}
        >
          Add New Sheet
        </Button>
      </Grid>
      <Grid container width={"100%"} justifyContent={"center"}>
        <TableContainer component={Paper} style={styles.table}>
          <Table style={styles.table} aria-label="Job Sheets">
            <TableHead>
              <TableRow>
                <TableCell>Window Ref.</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Width</TableCell>
                <TableCell>Height</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobSheets.map((sheet) => (
                <TableRow key={sheet.id}>
                  <TableCell>{sheet.windowRef}</TableCell>
                  <TableCell>{sheet.title}</TableCell>
                  <TableCell>
                    {moment(sheet.createdAt).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>{sheet.client}</TableCell>
                  <TableCell>{sheet.quantity}</TableCell>
                  <TableCell>{sheet.width}</TableCell>
                  <TableCell>{sheet.height}</TableCell>
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
                      <Info style={{ paddingRight: "5px" }} />
                      Details
                    </Button>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      edge="end"
                      style={{ paddingLeft: "12px" }}
                      onClick={async () => {
                        const resp = await deleteSheet("frappe", sheet._id);
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
      <Button
        variant="contained"
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: "12px",
          marginTop: "25px",
          textTransform: "capitalize",
        }}
        onClick={async () => {
          const resp = await getSumFrappeJS(id);
          if (resp.status === 200) {
            setSumData(resp.data);
            const resp1 = await createFrappeExcel(id);
            if (resp1.status) {
              setExcelExport(
                `https://app.noutfermeture.com/api/jobsheets/${id}.xlsx`
              );
            }
          } else {
            toast.error(resp.data.message);
          }
        }}
      >
        <CalculateOutlined style={{ marginRight: "8px" }} /> Optimize Job Sheet
      </Button>

      {sumData.sumVT.length > 0 && (
        <div style={{ margin: "20px 0" }}>
          <Typography variant="h6" gutterBottom>
            Sum VT
          </Typography>
          <Grid container width={"100%"} justifyContent={"center"}>
            <GlazzingTable data={sumData.sumVT} />
          </Grid>
        </div>
      )}
      {sumData.sumAcc.length > 0 && (
        <div style={{ margin: "10px 0" }}>
          <Typography variant="h6" gutterBottom>
            Sum Accessories
          </Typography>
          <Grid container width={"100%"} justifyContent={"center"}>
            <TableContainer component={Paper} style={styles.table}>
              <Table aria-label="accessories table" style={styles.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Color</TableCell>
                    <TableCell>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sumData.sumAcc.map((accessory) =>
                    accessory.list.map((item) => {
                      return (
                        <TableRow>
                          <TableCell>{accessory.name}</TableCell>
                          <TableCell>{accessory.code}</TableCell>
                          <TableCell>{accessory.color}</TableCell>
                          <TableCell>{item}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </div>
      )}

      {sumData.sumProfiles?.length > 0 && (
        <div style={{ margin: "10px 0" }}>
          <Typography variant="h6" gutterBottom>
            Sum Profiles
          </Typography>
          <Grid container width={"100%"} justifyContent={"center"}>
            <TableContainer component={Paper} style={styles.table}>
              <Table aria-label="glazing table" style={styles.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Color</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sumData.sumProfiles.map((profile) => (
                    <TableRow>
                      <TableCell>{profile.name}</TableCell>
                      <TableCell>{profile.code}</TableCell>
                      <TableCell>{profile.color}</TableCell>
                      <TableCell>{profile.param}</TableCell>
                      <TableCell>{profile.quantity}</TableCell>
                      <TableCell>{profile.length}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </div>
      )}

      {optimizedData?.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Profiles Sheet Optimization
          </Typography>
          <Grid container width={"100%"} justifyContent={"center"}>
            <OptimizedSheetTable data={optimizedData} />
          </Grid>
        </>
      )}
      {excelExport && (
        <>
          <Button variant="contained">
            <a
              style={{
                textDecoration: "none",
                color: "#FAFAFA",

                textTransform: "capitalize",
              }}
              href={excelExport}
              target="_blank"
            >
              Export as XLSX
            </a>
          </Button>
        </>
      )}
    </div>
  );
};

export default JobSheetList;

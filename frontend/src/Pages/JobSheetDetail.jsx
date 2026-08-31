import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
} from "@mui/material";
import moment from "moment";
import {
  addNewFrappeJS,
  getFrappeSheetByID,
  getJobSheetDetails,
  updateFrappeJS,
} from "../services/jobSheets/getAllJobSheets";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { Save } from "@mui/icons-material";
import { COLORS, buttonSx } from "../theme/tokens";
import { ChevronLeftIcon } from "../Components/common/navIcons";

const textFieldStyles = { marginBottom: "16px" };

const cardSx = {
  background: "#fff",
  border: `1px solid ${COLORS.cardBorder}`,
  borderRadius: "8px",
  overflowX: "auto",
  boxShadow: "0 1px 3px rgba(20,26,32,0.05)",
};

const resultTh = (label, i, arr) => (
  <TableCell
    key={label}
    sx={{
      color: "#fff",
      fontWeight: 700,
      fontSize: "12px",
      letterSpacing: "0.07em",
      textTransform: "uppercase",
      borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.12)" : "none",
    }}
  >
    {label}
  </TableCell>
);

const JobSheetDetails = () => {
  const { id, sheetID } = useParams();

  const isNewSheet = sheetID === "newSheet";

  const [formData, setFormData] = useState({
    title: "",
    jobSheet: id,
    date: moment().format("YYYY-MM-DD"),
    client: "",
    projet: "",
    repere: "",
    handleDirection: "",
    handleHeight: "",
    lang: "EN",
    jointCovers: "yes",
    threshold: "yes",
    closing: "",
    windowRef: "",
    quantity: "",
    width: "",
    height: "",
    glazzing: "",
    basement: "no",
    blade: "",
    thirdParty: "no",
    thirdPartyValue: 0,
    color: "",
  });

  async function getData() {
    try {
      const resp = await getFrappeSheetByID(sheetID);
      if (resp.status === 200) {
        const item = resp.data[0];
        setFormData(item);

        setData({
          profiles: item.profiles,
          accessories: item.accessories,
          glazzingValues: item.glazzingValues,
        });
        // setTotalPages(resp.data.totalPages);
      } else {
        toast.error(resp.data.message);
      }
    } catch (error) {
      toast.error("Check network connection");
    }
  }

  const windowRefValues = [
    "F1",
    "F2",
    "F3",
    "F4",
    "FP",
    "OF1",
    "OF2",
    "PCP 1",
    "PCP 2",
    "PCV 1",
    "PCV 2",
    "PCV Haut1",
    "PCV Haut2",
    "PE 1",
    "PE 2",
    "PE 2 Tra",
    "PF 1",
    "PF 2",
    "POB 1",
    "POB 2",
    "POB E1",
    "POB E2",
    "PSP 1",
    "PSP 2",
    "SO 1",
    "SO 2",
    "VB 1",
    "VP 1",
    "VP 2",
  ];

  useEffect(() => {
    if (!isNewSheet) {
      getData();
    }
  }, []);

  const [data, setData] = useState({
    profiles: [],
    accessories: [],
    glazzingValues: [],
  });

  const handleChange = (e) => {
    const name = e.target.name;
    if (name === "height" || name === "width" || name === "quantity") {
      setFormData({
        ...formData,
        [name]: parseFloat(e.target.value ? e.target.value : 0),
      });
    } else {
      setFormData({ ...formData, [name]: e.target.value });
    }
  };

  const handleGetSheet = async () => {
    // Replace with your API endpoint
    const resp = await getJobSheetDetails({
      ...formData,
    });
    if (resp.status === 200) {
      setData(resp.data);
    } else {
      console.log(resp);
      toast.error(resp.data.message);
    }
  };
  const navigate = useNavigate();

  return (
    <Box>
      <Button
        onClick={() => navigate(-1)}
        sx={{ display: "flex", alignItems: "center", gap: "8px", textTransform: "none", color: COLORS.textSecondary, marginBottom: "8px" }}
      >
        <ChevronLeftIcon size={16} /> Back
      </Button>
      <Box sx={{ fontSize: "20px", fontWeight: 700, color: COLORS.textPrimary, marginBottom: "16px" }}>
        Job Sheet Details
      </Box>
      <Box sx={{ ...cardSx, padding: "20px", marginBottom: "16px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
            sx={textFieldStyles}
          />

          <TextField
            label="Client"
            name="client"
            value={formData.client}
            onChange={handleChange}
            fullWidth
            sx={textFieldStyles}
          />
          <TextField
            label="Projet"
            name="projet"
            value={formData.projet}
            onChange={handleChange}
            fullWidth
            sx={textFieldStyles}
          />
          <TextField
            label="Repere"
            name="repere"
            value={formData.repere}
            onChange={handleChange}
            fullWidth
            sx={textFieldStyles}
          />
          <TextField
            select
            name="handleDirection"
            label="Sens Poignée"
            value={formData.handleDirection}
            onChange={handleChange}
            fullWidth
            required
            sx={textFieldStyles}
          >
            {[
              "VIPD",
              "VIPG",
              "VEPD",
              "VEPG",
              "VIOSD",
              "VIOSG",
              "VEOSD",
              "VEOSG",
            ]?.map((val) => {
              return <MenuItem value={val}>{val}</MenuItem>;
            })}
          </TextField>

          <TextField
            label="Hauteur Poignée"
            name="handleHeight"
            value={formData.handleHeight}
            onChange={handleChange}
            fullWidth
            sx={textFieldStyles}
          />
          <TextField
            select
            label="Language"
            name="lang"
            value={formData.lang}
            onChange={handleChange}
            fullWidth
            required
            sx={textFieldStyles}
          >
            {["EN", "FR"]?.map((val) => {
              return <MenuItem value={val}>{val}</MenuItem>;
            })}
          </TextField>
          <TextField
            label="Couvre Joints"
            name="jointCovers"
            value={formData.jointCovers}
            onChange={handleChange}
            fullWidth
            required
            sx={textFieldStyles}
          >
            {["yes", "no"]?.map((val) => {
              return <MenuItem value={val}>{val}</MenuItem>;
            })}
          </TextField>

          <TextField
            label="Width"
            name="width"
            type="number"
            value={formData.width}
            onChange={handleChange}
            fullWidth
            required
            sx={textFieldStyles}
          />
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            fullWidth
            required
            sx={textFieldStyles}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="Window Reference"
            name="windowRef"
            value={formData.windowRef}
            onChange={handleChange}
            fullWidth
            required
            sx={textFieldStyles}
          >
            {windowRefValues?.map((val) => {
              return <MenuItem value={val}>{val}</MenuItem>;
            })}
          </TextField>
          <TextField
            select
            label="Fermeture"
            name="closing"
            value={formData.closing}
            onChange={handleChange}
            fullWidth
            required
            sx={textFieldStyles}
          >
            {["Cremone", "1 pts", "3 pts", "Locqueteau"]?.map((val) => {
              return <MenuItem value={val}>{val}</MenuItem>;
            })}
          </TextField>

          <TextField
            select
            label="Seuille"
            name="threshold"
            value={formData.threshold}
            onChange={handleChange}
            fullWidth
            required
            sx={textFieldStyles}
          >
            {["yes", "no"]?.map((val) => {
              return <MenuItem value={val}>{val}</MenuItem>;
            })}
          </TextField>

          <TextField
            select
            required
            label="Glazing"
            name="glazzing"
            value={formData.glazzing}
            onChange={handleChange}
            fullWidth
            sx={textFieldStyles}
          >
            {[
              "6 mm Claire",
              "Double Vitrage Claire",
              "Double Vitrage Petit Bois",
              "33,1 Claire",
              "8 mm Claire",
              "44,2 Claire",
              "6 mm Imprimée",
              "33,1 Opale",
              "Lame Sapin",
              "Lame Pleine",
              "Persienne",
            ]?.map((val) => {
              return <MenuItem value={val}>{val}</MenuItem>;
            })}
          </TextField>
          <TextField
            select
            label="Soubassement"
            name="basement"
            value={formData.basement}
            onChange={handleChange}
            fullWidth
            sx={textFieldStyles}
          >
            {["yes", "no"]?.map((val) => {
              return <MenuItem value={val}>{val}</MenuItem>;
            })}
          </TextField>
          <TextField
            label="Lame Remplissage"
            name="blade"
            value={formData.blade}
            onChange={handleChange}
            fullWidth
            sx={textFieldStyles}
          />
          <TextField
            label="Tierce"
            select
            name="thirdParty"
            value={formData.thirdParty}
            onChange={handleChange}
            fullWidth
            sx={textFieldStyles}
          >
            {["yes", "no"]?.map((val) => {
              return <MenuItem value={val}>{val}</MenuItem>;
            })}
          </TextField>
          <TextField
            label="Tierce Value"
            name="thirdPartyValue"
            value={formData.thirdPartyValue}
            onChange={handleChange}
            fullWidth
            sx={textFieldStyles}
          ></TextField>
          <TextField
            label="Height"
            name="height"
            value={formData.height}
            onChange={handleChange}
            fullWidth
            required
            sx={textFieldStyles}
          />
          <TextField
            label="Color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            fullWidth
            required
            sx={textFieldStyles}
          />
        </Grid>
      </Grid>
      </Box>
      <Button sx={buttonSx.primary("44px")} onClick={handleGetSheet}>
        Get Sheet
      </Button>
      {data?.profiles?.length > 0 && (
        <div style={{ margin: "20px 0" }}>
          <Box sx={{ fontSize: "15px", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: COLORS.textPrimary, marginBottom: "12px" }}>
            Profiles
          </Box>
          <Grid container width={"100%"} justifyContent={"center"}>
            <TableContainer component={Paper} sx={{ ...cardSx, width: "850px" }}>
              <Table aria-label="profiles table">
                <TableHead>
                  <TableRow sx={{ background: COLORS.tableHeaderBg }}>
                    {["Name", "Code", "Color", "Param", "Quantity", "Length", ""].map((h, i, arr) => resultTh(h, i, arr))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.profiles.map((profile) => (
                    <TableRow key={profile._id}>
                      <TableCell>{profile.name}</TableCell>
                      <TableCell>{profile.code}</TableCell>
                      <TableCell>{profile.color}</TableCell>
                      <TableCell>{profile.param}</TableCell>
                      <TableCell>{profile.quantity}</TableCell>
                      <TableCell>{profile.length}</TableCell>
                      <TableCell>{profile.next}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </div>
      )}
      {data?.accessories?.length > 0 && (
        <div style={{ margin: "20px 0" }}>
          <Box sx={{ fontSize: "15px", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: COLORS.textPrimary, marginBottom: "12px" }}>
            Accessories
          </Box>
          <Grid container width={"100%"} justifyContent={"center"}>
            <TableContainer component={Paper} sx={{ ...cardSx, width: "850px" }}>
              <Table aria-label="accessories table">
                <TableHead>
                  <TableRow sx={{ background: COLORS.tableHeaderBg }}>
                    {["Name", "Code", "Color", "Quantity"].map((h, i, arr) => resultTh(h, i, arr))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.accessories.map((accessory) => (
                    <TableRow key={accessory._id}>
                      <TableCell>{accessory.name}</TableCell>
                      <TableCell>{accessory.code}</TableCell>
                      <TableCell>{accessory.color}</TableCell>
                      <TableCell>{accessory.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </div>
      )}

      {data?.glazzingValues?.length > 0 && (
        <div style={{ margin: "20px 0" }}>
          <Box sx={{ fontSize: "15px", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: COLORS.textPrimary, marginBottom: "12px" }}>
            Glazing
          </Box>
          <Grid container width={"100%"} justifyContent={"center"}>
            <TableContainer component={Paper} sx={{ ...cardSx, width: "850px" }}>
              <Table aria-label="glazing table">
                <TableHead>
                  <TableRow sx={{ background: COLORS.tableHeaderBg }}>
                    {["Code", "Quantity", "Width", "Height"].map((h, i, arr) => resultTh(h, i, arr))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.glazzingValues.map((glazzing) => (
                    <TableRow key={glazzing._id}>
                      <TableCell>{glazzing.code}</TableCell>
                      <TableCell>{glazzing.quantity}</TableCell>
                      <TableCell>{glazzing.width}</TableCell>
                      <TableCell>{glazzing.height}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </div>
      )}
      {data.profiles.length > 0 && (
        <Button
          sx={{ ...buttonSx.primary("44px"), margin: "20px 0" }}
          startIcon={<Save />}
          onClick={async () => {
            const resp = isNewSheet
              ? await addNewFrappeJS({
                  ...formData,
                  ...data,
                })
              : await updateFrappeJS({
                  ...formData,
                  ...data,
                });

            if (resp.status === 200) {
              toast.success("Job Sheet Saved");
            } else {
              toast.error(resp.data.message);
            }
          }}
        >
          Save Sheet
        </Button>
      )}
    </Box>
  );
};

export default JobSheetDetails;

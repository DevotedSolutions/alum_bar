import React, { useEffect, useState } from "react";
import {
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
  Typography,
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
import { ArrowLeftOutlined, Save } from "@mui/icons-material";

const textFieldStyles = { marginBottom: "16px" };

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
    <div style={{ padding: "16px" }}>
      <Button
        sx={{
          display: "flex",
          alignItems: "center",
        }}
        onClick={() => {
          navigate(-1);
        }}
      >
        <ArrowLeftOutlined /> Back
      </Button>
      <Typography variant="h4" gutterBottom>
        Job Sheet Details
      </Typography>
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
            {["PSP 1", "SO 1", "PE 2", "PF 1", "PF 2"]?.map((val) => {
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
            select
          >
            {[542, 775]?.map((val) => {
              return <MenuItem value={val}>{val}</MenuItem>;
            })}
          </TextField>
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
      <Button variant="contained" color="primary" onClick={handleGetSheet}>
        Get Sheet
      </Button>
      {data?.profiles?.length > 0 && (
        <div style={{ margin: "10px 0" }}>
          <Typography variant="h6" gutterBottom>
            Profiles
          </Typography>
          <Grid container width={"100%"} justifyContent={"center"}>
            <TableContainer component={Paper} style={{ width: "850px" }}>
              <Table aria-label="profiles table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Color</TableCell>
                    <TableCell>Param</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Length</TableCell>
                    <TableCell></TableCell>
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
        <div style={{ margin: "10px 0" }}>
          <Typography variant="h6" gutterBottom>
            Accessories
          </Typography>
          <Grid container width={"100%"} justifyContent={"center"}>
            <TableContainer component={Paper} style={{ width: "850px" }}>
              <Table aria-label="accessories table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Color</TableCell>
                    <TableCell>Quantity</TableCell>
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
        <div style={{ margin: "10px 0" }}>
          <Typography variant="h6" gutterBottom>
            Glazing
          </Typography>
          <Grid container width={"100%"} justifyContent={"center"}>
            <TableContainer component={Paper} style={{ width: "850px" }}>
              <Table aria-label="glazing table">
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Width</TableCell>
                    <TableCell>Height</TableCell>
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
          variant="contained"
          color="primary"
          style={{ margin: "20px 0" }}
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
    </div>
  );
};

export default JobSheetDetails;

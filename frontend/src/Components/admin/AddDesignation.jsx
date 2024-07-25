import {
  Modal,
  Box,
  Grid,
  FormControl,
  TextField,
  Typography,
  Button,
  IconButton, // Import IconButton component
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete'; // Import delete icon
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { updateDesignation } from "../../services/designation/updateDesignation";
import { addDesignation } from "../../services/designation/addDesignation";

const AddDesignation = ({ isOpen, onClose, isUpdate }) => {
  const [formData, setFormData] = useState({
    image: "",
    designation: "",
    vitrage: "",
    cermone: "",
    priceList: [],
  });

  const [showImg, setShowImg] = useState(`/assets/images/default-img.png`);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    setShowImg(`/assets/images/default-img.png`);
    setFormData({
      image: "",
      designation: "",
      vitrage: "",
      cermone: "",
      priceList: [],
    });
    setModalImage(null);
  }, [onClose, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setModalImage(e.target.files[0]);
    if (selectedImage) {
      const imagePreviewURL = URL.createObjectURL(selectedImage);
      setShowImg(imagePreviewURL);
      setFormData({
        ...formData,
        image: selectedImage,
      });
    }
  };

  const handleAddPriceEntry = () => {
    const newPriceList = [...formData.priceList, { width: "", height: "", price: "" }];
    setFormData({
      ...formData,
      priceList: newPriceList,
    });
  };

  const handlePriceInputChange = (index, e) => {
    const { name, value } = e.target;
    const newPriceList = [...formData.priceList];
    newPriceList[index][name] = value;
    setFormData({
      ...formData,
      priceList: newPriceList,
    });
  };

  const handleDeletePriceEntry = (index) => {
    const newPriceList = [...formData.priceList];
    newPriceList.splice(index, 1);
    setFormData({
      ...formData,
      priceList: newPriceList,
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!formData.designation) {
      toast.error("Fill the Designation");
      return;
    }

    const duplicateCombination = formData.priceList.some((entry, index) => {
      return formData.priceList.findIndex(
        (p, i) => i !== index && p.width === entry.width && p.height === entry.height
      ) !== -1 || entry.width === "" || entry.height === "";
    });
  
    if (duplicateCombination) {
      toast.error("Duplicate width and height combination found or empty width/height");
      return;
    }

    const formDataAppend = new FormData();
    formDataAppend.append("designation", formData.designation);
    formDataAppend.append("vitrage", formData.vitrage);
    formDataAppend.append("cermone", formData.cermone);
    formDataAppend.append("image", modalImage || formData.image);

    formData.priceList.forEach((priceEntry, index) => {
      formDataAppend.append(`priceList[${index}][width]`, priceEntry.width);
      formDataAppend.append(`priceList[${index}][height]`, priceEntry.height);
      formDataAppend.append(`priceList[${index}][price]`, priceEntry.price);
    });

    try {
      const resp = await addDesignation({ formDataAppend });
      if (resp && resp.status === 200) {
        toast.success(resp.data.message);
        isUpdate();
      } else if (resp && resp.status === 400) {
        toast.error(resp.data.message);
      } else {
        toast.error("Check network connection");
      }
      onClose();
    } catch (error) {
      toast.error("Server error");
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "row",
          borderRadius: "6px",
          maxHeight: "90vh", 
          overflowY: "auto", 
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h4">Add Product Data</Typography>
          </Grid>
          <Grid item xs={12}>
            <form onSubmit={handleAddProduct}>
              <Box sx={{ padding: "20px", borderRadius: "12px" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box>
                      {showImg && (
                        <img
                          src={showImg}
                          alt="Preview"
                          style={{
                            width: "100px",
                            height: "80px",
                            marginTop: "10px",
                          }}
                        />
                      )}
                      <br />
                      <input
                        type="file"
                        onChange={handleImageChange}
                        name="image"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <FormControl fullWidth>
                        <TextField
                          fullWidth
                          label="Product Designation"
                          name="designation"
                          value={formData.designation}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <FormControl fullWidth>
                        <TextField
                          fullWidth
                          label="Product Vitrage"
                          name="vitrage"
                          value={formData.vitrage}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <FormControl fullWidth>
                        <TextField
                          fullWidth
                          label="Product Cermone"
                          name="cermone"
                          value={formData.cermone}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </Box>
                  </Grid>

                  {/* Price List Section */}
                  <Box sx={{
                      p:2
                    }}>
                  {formData.priceList.map((priceEntry, index) => (
                    <Grid container spacing={2} key={index} sx={{alignItems:"center",pb:1}}>
                      <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                          <TextField
                          type="number"
                          size="medium"
                            fullWidth
                            label="Largeur (mm)"
                            name="width"
                            value={priceEntry.width}
                            onChange={(e) => handlePriceInputChange(index, e)}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                          <TextField
                            fullWidth
                            type="number"
                            label="Hauteur (mm)"
                            name="height"
                            value={priceEntry.height}
                            onChange={(e) => handlePriceInputChange(index, e)}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                          <TextField
                            fullWidth
                            type="number"
                            label="Price"
                            name="price"
                            value={priceEntry.price}
                            onChange={(e) => handlePriceInputChange(index, e)}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <IconButton onClick={() => handleDeletePriceEntry(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                  </Box>
                  <Grid item xs={12}>
                    <Button variant="contained" onClick={handleAddPriceEntry}>
                      Add Price
                    </Button>
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" gap="6px">
                      <Button
                        variant="contained"
                        sx={{
                          whiteSpace: "nowrap",
                        }}
                        type="submit"
                      >
                        Add Product
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleCancel}
                        sx={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </form>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default AddDesignation;

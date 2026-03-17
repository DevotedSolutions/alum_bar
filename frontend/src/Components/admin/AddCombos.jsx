import {
  Modal,
  Box,
  Grid,
  FormControl,
  TextField,
  Typography,
  Button,
  IconButton,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { addCombo } from "../../services/designation/addDesignation";
// Assuming you have a service for combos
// import { addCombo } from "../../services/combo/addCombo";

const AddCombo = ({ isOpen, onClose, isUpdate, availableProducts }) => {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    selectedProducts: [], // Array of objects: { id, name, category }
  });

  const [showImg, setShowImg] = useState(`/assets/images/default-img.png`);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setShowImg(`/assets/images/default-img.png`);
      setFormData({
        name: "",
        image: "",
        selectedProducts: [],
      });
      setModalImage(null);
    }
  }, [isOpen]);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setModalImage(selectedImage);
    if (selectedImage) {
      const imagePreviewURL = URL.createObjectURL(selectedImage);
      setShowImg(imagePreviewURL);
    }
  };

  const handleAddProductToCombo = (event, newValue) => {
    if (newValue) {
      setFormData({
        ...formData,
        selectedProducts: [...formData.selectedProducts, newValue],
      });
    }
  };

  const removeItem = (id) => {
    setFormData({
      ...formData,
      selectedProducts: formData.selectedProducts.filter((p) => p.id !== id),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || formData.selectedProducts.length === 0) {
      toast.error("Please provide a name and at least one designation");
      return;
    }

    const formDataAppend = new FormData();
    formDataAppend.append("name", formData.name);
    formDataAppend.append("image", modalImage);

    formDataAppend.append("list", JSON.stringify(formData.selectedProducts));

    try {
      // Replace with your actual service call
      const resp = await addCombo(formDataAppend);
      if (resp?.status === 200) {
        toast.success("Combo created successfully");
      }
      onClose();
      isUpdate();
    } catch (error) {
      toast.error("Server error");
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "6px",
          maxHeight: "90vh",
          overflowY: "auto",
          width: { xs: "90%", md: "600px" },
        }}
      >
        <Typography variant="h5" mb={3}>
          Create Product Combo
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Image Section */}
            <Grid item xs={12} display="flex" alignItems="center" gap={2}>
              <img
                src={showImg}
                alt="Preview"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "4px",
                  objectFit: "cover",
                }}
              />
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
              />
            </Grid>

            {/* Combo Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Combo Unique Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Grid>

            {/* Product Selector */}
            <Grid item xs={12}>
              <Autocomplete
                options={availableProducts || []}
                getOptionLabel={(option) =>
                  `${option.name} (${option.category})`
                }
                onChange={handleAddProductToCombo}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search & Add Designation"
                    variant="outlined"
                  />
                )}
              />
            </Grid>

            {/* Selected Designations List */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Selected list:
              </Typography>
              <Box sx={{ border: "1px solid #ddd", borderRadius: "4px", p: 1 }}>
                {formData.selectedProducts.length === 0 && (
                  <Typography variant="body2" color="textSecondary">
                    No products added yet.
                  </Typography>
                )}
                {formData.selectedProducts.map((product) => (
                  <Box
                    key={product.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1,
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <Typography>
                      {product.name} <small>({product.category})</small>
                    </Typography>
                    <IconButton
                      onClick={() => removeItem(product.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} display="flex" gap={2}>
              <Button variant="contained" type="submit" fullWidth>
                Create Combo
              </Button>
              <Button variant="outlined" onClick={onClose} fullWidth>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default AddCombo;

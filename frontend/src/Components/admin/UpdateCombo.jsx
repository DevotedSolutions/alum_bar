import {
  Modal,
  Box,
  Grid,
  FormControl,
  TextField,
  Typography,
  Button,
  IconButton,
  Autocomplete,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { updateCombo } from "../../services/designation/updateDesignation";
import { deleteCombo } from "../../services/designation/deleteDesignation";

const UpdateCombo = ({
  isOpen,
  onClose,
  isUpdate,
  availableProducts,
  comboInfo,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    selectedProducts: [],
  });

  const [showImg, setShowImg] = useState("");
  const [modalImage, setModalImage] = useState(null);

  // Pre-fill data when the modal opens or comboInfo changes
  useEffect(() => {
    if (isOpen && comboInfo) {
      setFormData({
        name: comboInfo.name || "",
        // Map the list to match our selection structure
        selectedProducts: comboInfo.list || [],
      });
      // Show the existing image from the database
      setShowImg(
        comboInfo.image
          ? `${process.env.REACT_APP_API_URL}/${comboInfo.image}`
          : `/assets/images/default-img.png`,
      );
      setModalImage(null);
    }
  }, [isOpen, comboInfo]);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setModalImage(selectedImage);
      setShowImg(URL.createObjectURL(selectedImage));
    }
  };

  const handleAddProduct = (event, newValue) => {
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

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || formData.selectedProducts.length === 0) {
      toast.error("Name and at least one product are required");
      return;
    }

    const formDataAppend = new FormData();
    formDataAppend.append("id", comboInfo._id); // Include the ID for the update query
    formDataAppend.append("name", formData.name);
    formDataAppend.append("list", JSON.stringify(formData.selectedProducts));

    // Only append image if a new one was actually picked
    if (modalImage) {
      formDataAppend.append("image", modalImage);
    }

    try {
      const resp = await updateCombo({ formDataAppend, id: comboInfo._id });
      if (resp && (resp.status === 200 || resp.status === 201)) {
        toast.success("Combo updated successfully");
        isUpdate(); // Trigger refresh in parent
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating combo");
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
          width: { xs: "90%", md: "650px" },
        }}
      >
        <Typography variant="h5" mb={2}>
          Update Combo
        </Typography>

        <form onSubmit={handleUpdateSubmit}>
          <Grid container spacing={2}>
            {/* Image Preview */}
            <Grid item xs={12} display="flex" alignItems="center" gap={2}>
              <img
                src={showImg}
                alt="Combo"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <input type="file" onChange={handleImageChange} />
            </Grid>

            {/* Name Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Combo Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Grid>

            {/* Add more products */}
            <Grid item xs={12}>
              <Autocomplete
                options={availableProducts || []}
                getOptionLabel={(option) =>
                  `${option.name} (${option.category || "N/A"})`
                }
                onChange={handleAddProduct}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search designations to add..."
                  />
                )}
              />
            </Grid>

            {/* List of current designations in combo */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Included Designations:
              </Typography>
              <Box sx={{ border: "1px solid #eee", borderRadius: "4px" }}>
                {formData.selectedProducts.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1,
                      borderBottom: "1px solid #f5f5f5",
                    }}
                  >
                    <Typography variant="body2">{item.name}</Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeItem(item.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} display="flex" gap={2} mt={2}>
              <Button
                variant="contained"
                type="submit"
                color="primary"
                fullWidth
              >
                Update Changes
              </Button>
              <Button variant="outlined" onClick={onClose} fullWidth>
                Cancel
              </Button>

              <Button
                variant="text"
                color="error"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this combo?",
                    )
                  ) {
                    deleteCombo(comboInfo._id);
                    onClose();
                    isUpdate(); // Refresh parent list after deletion
                  }
                }}
              >
                Delete Combo
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default UpdateCombo;

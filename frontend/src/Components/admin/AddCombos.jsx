import { Modal, Box, Button, IconButton, Autocomplete, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { addCombo } from "../../services/designation/addDesignation";
import { COLORS, buttonSx } from "../../theme/tokens";
import {
  Field,
  ModalHeader,
  fieldInputStyle,
  modalShellSx,
  modalFooterSx,
} from "../common/ModalKit";
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
      event.target.value = "";
    }
  };

  const removeItem = (index) => {
    setFormData({
      ...formData,
      selectedProducts: formData.selectedProducts.filter((_, i) => i !== index),
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
      <Box sx={modalShellSx(760)}>
        <ModalHeader title="Add Combo" subtitle="New product bundle" onClose={onClose} />

        <form onSubmit={handleSubmit}>
          <Box sx={{ padding: "22px", display: "grid", gridTemplateColumns: "210px minmax(0,1fr)", gap: "24px" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Box sx={{ fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.textMuted }}>
                Combo image
              </Box>
              <Box sx={{ width: 210, height: 150, border: `1px solid ${COLORS.cardBorder}`, borderRadius: "6px", background: "#F7F8F9", display: "flex", alignItems: "center", justifyContent: "center", padding: "14px", boxSizing: "border-box" }}>
                <img src={showImg} alt="Preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              </Box>
              <input type="file" name="image" onChange={handleImageChange} accept="image/*" />
              <Box sx={{ fontSize: "11.5px", color: COLORS.textFaint, lineHeight: 1.5 }}>
                PNG or JPG on a white background, 600px wide or more.
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <Field label="Combo unique name">
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={fieldInputStyle}
                />
              </Field>

              <Field label="Search & add designation">
                <Autocomplete
                  options={availableProducts || []}
                  getOptionLabel={(option) => `${option.name} (${option.category})`}
                  onChange={handleAddProductToCombo}
                  renderInput={(params) => <TextField {...params} size="small" />}
                />
              </Field>

              <Field label={`Selected list (${formData.selectedProducts.length})`}>
                <Box sx={{ border: `1px solid ${COLORS.cardBorder}`, borderRadius: "6px", maxHeight: "180px", overflowY: "auto" }}>
                  {formData.selectedProducts.length === 0 && (
                    <Box sx={{ padding: "12px", fontSize: "13px", color: COLORS.textFaint }}>
                      No products added yet.
                    </Box>
                  )}
                  {formData.selectedProducts.map((product, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 12px",
                        borderBottom: `1px solid ${COLORS.rowBorder}`,
                        "&:last-of-type": { borderBottom: "none" },
                      }}
                    >
                      <Box sx={{ fontSize: "13.5px", color: COLORS.textPrimary }}>
                        {product.name} <span style={{ color: COLORS.textFaint }}>({product.category})</span>
                      </Box>
                      <IconButton size="small" onClick={() => removeItem(index)} color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Field>
            </Box>
          </Box>

          <Box sx={modalFooterSx}>
            <Box sx={{ flex: 1 }} />
            <Button sx={buttonSx.neutral("44px")} onClick={onClose}>Cancel</Button>
            <Button type="submit" sx={{ ...buttonSx.primary(), fontWeight: 700 }}>Create Combo</Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddCombo;

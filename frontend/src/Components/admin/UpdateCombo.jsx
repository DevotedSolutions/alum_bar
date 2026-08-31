import { Modal, Box, Button, IconButton, Autocomplete, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { updateCombo } from "../../services/designation/updateDesignation";
import { deleteCombo } from "../../services/designation/deleteDesignation";
import { COLORS, buttonSx } from "../../theme/tokens";
import ConfirmDialog from "../common/ConfirmDialog";
import {
  Field,
  ModalHeader,
  fieldInputStyle,
  modalShellSx,
  modalFooterSx,
} from "../common/ModalKit";

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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

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
    <>
      <Modal open={isOpen} onClose={onClose}>
        <Box sx={modalShellSx(760)}>
          <ModalHeader title="Update Combo" subtitle={comboInfo?.name || ""} onClose={onClose} />

          <form onSubmit={handleUpdateSubmit}>
            <Box sx={{ padding: "22px", display: "grid", gridTemplateColumns: "210px minmax(0,1fr)", gap: "24px" }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Box sx={{ fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.textMuted }}>
                  Combo image
                </Box>
                <Box sx={{ width: 210, height: 150, border: `1px solid ${COLORS.cardBorder}`, borderRadius: "6px", background: "#F7F8F9", display: "flex", alignItems: "center", justifyContent: "center", padding: "14px", boxSizing: "border-box" }}>
                  <img src={showImg} alt="Combo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                </Box>
                <input type="file" onChange={handleImageChange} accept="image/*" />
                <Box sx={{ fontSize: "11.5px", color: COLORS.textFaint, lineHeight: 1.5 }}>
                  PNG or JPG on a white background, 600px wide or more.
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <Field label="Combo name">
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={fieldInputStyle}
                  />
                </Field>

                <Field label="Search designations to add">
                  <Autocomplete
                    options={availableProducts || []}
                    getOptionLabel={(option) => `${option.name} (${option.category || "N/A"})`}
                    onChange={handleAddProduct}
                    renderInput={(params) => <TextField {...params} size="small" />}
                  />
                </Field>

                <Field label={`Included designations (${formData.selectedProducts.length})`}>
                  <Box sx={{ border: `1px solid ${COLORS.cardBorder}`, borderRadius: "6px", maxHeight: "180px", overflowY: "auto" }}>
                    {formData.selectedProducts.length === 0 && (
                      <Box sx={{ padding: "12px", fontSize: "13px", color: COLORS.textFaint }}>
                        No products in this combo yet.
                      </Box>
                    )}
                    {formData.selectedProducts.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px 12px",
                          borderBottom: `1px solid ${COLORS.rowBorder}`,
                          "&:last-of-type": { borderBottom: "none" },
                        }}
                      >
                        <Box sx={{ fontSize: "13.5px", color: COLORS.textPrimary }}>{item.name}</Box>
                        <IconButton size="small" color="error" onClick={() => removeItem(item.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Field>
              </Box>
            </Box>

            <Box sx={modalFooterSx}>
              <Button sx={buttonSx.danger("44px")} onClick={() => setDeleteConfirmOpen(true)}>
                Delete Combo
              </Button>
              <Box sx={{ flex: 1 }} />
              <Button sx={buttonSx.neutral("44px")} onClick={onClose}>Cancel</Button>
              <Button type="submit" sx={{ ...buttonSx.primary(), fontWeight: 700 }}>Save Changes</Button>
            </Box>
          </form>
        </Box>
      </Modal>

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete combo"
        message={comboInfo ? `${comboInfo.name} will be permanently removed.` : ""}
        confirmLabel="Delete"
        cancelLabel="Keep it"
        onConfirm={() => {
          deleteCombo(comboInfo._id);
          setDeleteConfirmOpen(false);
          onClose();
          isUpdate();
        }}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </>
  );
};

export default UpdateCombo;

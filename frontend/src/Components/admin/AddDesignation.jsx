import {
  Modal,
  Box,
  Grid,
  FormControl,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { updateDesignation } from "../../services/designation/updateDesignation";
import { addDesignation } from "../../services/designation/addDesignation";
import { COLORS, buttonSx } from "../../theme/tokens";
import {
  Field,
  ModalHeader,
  fieldInputStyle,
  fieldSelectStyle,
  modalShellSx,
  modalFooterSx,
} from "../common/ModalKit";

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

  const categories = [
    "Jalousie",
    "Fenetre Coulissante",
    "Porte Coulissante",
    "Fixe",
    "Fenetre Frappe Francaise",
    "Fenetre Frappe Anglaise",
    "Porte Frappe",
    "Volet Roulant",
  ];

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
    const newPriceList = [
      ...formData.priceList,
      { width: "", height: "", price: "" },
    ];
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
      return (
        formData.priceList.findIndex(
          (p, i) =>
            i !== index && p.width === entry.width && p.height === entry.height
        ) !== -1 ||
        entry.width === "" ||
        entry.height === ""
      );
    });

    if (duplicateCombination) {
      toast.error(
        "Duplicate width and height combination found or empty width/height"
      );
      return;
    }

    const formDataAppend = new FormData();
    formDataAppend.append("designation", formData.designation);
    formDataAppend.append("vitrage", formData.vitrage);
    formDataAppend.append("cermone", formData.cermone);
    formDataAppend.append("category", formData.category);
    formDataAppend.append("image", modalImage || formData.image);

    formData.priceList.forEach((priceEntry, index) => {
      formDataAppend.append(`priceList[${index}][width]`, priceEntry.width);
      formDataAppend.append(`priceList[${index}][height]`, priceEntry.height);
      formDataAppend.append(`priceList[${index}][price]`, priceEntry.price);
      formDataAppend.append(
        `priceList[${index}][price_local]`,
        priceEntry.price_local ?? 0
      );
      formDataAppend.append(
        `priceList[${index}][price_may]`,
        priceEntry.price_may ?? 0
      );
      formDataAppend.append(
        `priceList[${index}][price_reu]`,
        priceEntry.price_reu ?? 0
      );
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
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={modalShellSx(1000)}>
        <ModalHeader title="Add Product Data" subtitle="New designation in the quotation catalogue" onClose={onClose} />

        <form onSubmit={handleAddProduct}>
          <Box sx={{ padding: "22px", display: "grid", gridTemplateColumns: "210px minmax(0,1fr)", gap: "24px" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Box sx={{ fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.textMuted }}>
                Product image
              </Box>
              <Box sx={{ width: 210, height: 150, border: `1px solid ${COLORS.cardBorder}`, borderRadius: "6px", background: "#F7F8F9", display: "flex", alignItems: "center", justifyContent: "center", padding: "14px", boxSizing: "border-box" }}>
                {showImg && (
                  <img src={showImg} alt="Preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                )}
              </Box>
              <input type="file" onChange={handleImageChange} name="image" />
              <Box sx={{ fontSize: "11.5px", color: COLORS.textFaint, lineHeight: 1.5 }}>
                PNG or JPG on a white background, 600px wide or more.
              </Box>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <Field label="Product designation">
                <input name="designation" value={formData.designation} onChange={handleInputChange} style={fieldInputStyle} />
              </Field>
              <Field label="Product vitrage">
                <input name="vitrage" value={formData.vitrage} onChange={handleInputChange} style={fieldInputStyle} />
              </Field>
              <Field label="Product category">
                <select name="category" value={formData.category || ""} onChange={handleInputChange} style={fieldSelectStyle}>
                  <option value="" disabled>Select category</option>
                  {categories.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </Field>
              <Field label="Product cermone">
                <input name="cermone" value={formData.cermone} onChange={handleInputChange} style={fieldInputStyle} />
              </Field>
            </Box>
          </Box>

          {/* Price list — kept as the existing MUI Grid/TextField rows (working
              feature, not part of this visual pass). */}
          <Box sx={{ padding: "0 22px 22px" }}>
            {formData.priceList.map((priceEntry, index) => (
              <Grid
                container
                spacing={2}
                key={index}
                sx={{ alignItems: "center", pb: 1 }}
              >
                <Grid item xs={12} sm={2}>
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
                <Grid item xs={12} sm={2}>
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
                <Grid item xs={12} sm={1.75}>
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

                <Grid item xs={12} sm={1.75}>
                  <FormControl fullWidth>
                    <TextField
                      fullWidth
                      type="number"
                      label="MRU Price"
                      name="price_local"
                      value={priceEntry.price_local}
                      onChange={(e) => handlePriceInputChange(index, e)}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={1.75}>
                  <FormControl fullWidth>
                    <TextField
                      fullWidth
                      type="number"
                      label="Price MAY"
                      name="price_may"
                      value={priceEntry.price_may}
                      onChange={(e) => handlePriceInputChange(index, e)}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={1.75}>
                  <FormControl fullWidth>
                    <TextField
                      fullWidth
                      type="number"
                      label="Price REU"
                      name="price_reu"
                      value={priceEntry.price_reu}
                      onChange={(e) => handlePriceInputChange(index, e)}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={1}>
                  <IconButton onClick={() => handleDeletePriceEntry(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

            <Button sx={{ ...buttonSx.outline(), marginTop: "6px" }} onClick={handleAddPriceEntry}>
              Add Price
            </Button>
          </Box>

          <Box sx={modalFooterSx}>
            <Box sx={{ flex: 1 }} />
            <Button sx={buttonSx.neutral("44px")} onClick={handleCancel}>Cancel</Button>
            <Button type="submit" sx={{ ...buttonSx.primary(), fontWeight: 700 }}>Add Product</Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddDesignation;

import {
  Modal,
  Box,
  Grid,
  FormControl,
  TextField,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { updateDesignation } from "../../services/designation/updateDesignation";
import { deleteDesignation } from "../../services/designation/deleteDesignation";

const UpdateDesignation = ({ isOpen, onClose, selectedProduct, isUpdate }) => {
  const [formData, setFormData] = useState({
    image: selectedProduct?.image ? selectedProduct?.image : "",
    designation: selectedProduct ? selectedProduct?.designation : "",
    vitrage: selectedProduct ? selectedProduct?.vitrage : "",
    cermone: selectedProduct ? selectedProduct?.cermone : "",
    priceList: selectedProduct ? selectedProduct?.priceList : [],
  });
  const [modalImage, setModalImage] = useState(null);
  const [id, setId] = useState(selectedProduct ? selectedProduct?._id : "");
  const [showImg, setShowImg] = useState(
    selectedProduct?.image
      ? `https://inventory.api.noutfermeture.com/${selectedProduct?.image}`
      : `/assets/images/default-img.png`
  );

  useEffect(() => {
    setShowImg(
      selectedProduct?.image
        ? `https://inventory.api.noutfermeture.com/${selectedProduct?.image}`
        : `/assets/images/default-img.png`
    );
    setFormData({
      image: selectedProduct?.image ? selectedProduct?.image : "",
      designation: selectedProduct ? selectedProduct?.designation : "",
      vitrage: selectedProduct ? selectedProduct?.vitrage : "",
      cermone: selectedProduct ? selectedProduct?.cermone : "",
      priceList: selectedProduct ? selectedProduct?.priceList : [],
    });
    setModalImage(null);
   
    setId(selectedProduct ? selectedProduct?._id : "");
  }, [selectedProduct, onClose, isOpen]);

 console.log(formData.priceList)
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

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    console.log(formData.priceList)

    const duplicateCombination = formData.priceList.some((entry, index) => {
      // Convert width and height to numbers
      const width = Number(entry.width);
      const height = Number(entry.height);
    
      // Check for duplicate width and height combinations or empty width/height
      return formData.priceList.findIndex(
        (p, i) => i !== index && Number(p.width) === width && Number(p.height) === height
      ) !== -1 || width === 0 || height === 0 || isNaN(width) || isNaN(height);
    });
    
    if (duplicateCombination) {
      toast.error("Duplicate width and height combination found or empty width/height");
      return;
    }
    

    const formDataAppend = new FormData();
    formDataAppend.append("designation", formData.designation);
    formDataAppend.append("vitrage", formData.vitrage);
    formDataAppend.append("cermone", formData.cermone);

    if (modalImage !== null) {
      formDataAppend.append("image", modalImage);
    } else {
     
      formDataAppend.append("image", formData.image);
    }
  
    formData.priceList.forEach((priceEntry, index) => {
      formDataAppend.append(`priceList[${index}][width]`, priceEntry.width);
      formDataAppend.append(`priceList[${index}][height]`, priceEntry.height);
      formDataAppend.append(`priceList[${index}][price]`, priceEntry.price);
    });

    console.log(formData.priceList)
    try {
      const resp = await updateDesignation({ formDataAppend, id });
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

  const handleDelete = async () => {
    const deleteResp = await deleteDesignation({ id });
    if (deleteResp?.status === 200) {
      toast.success(deleteResp.data.message)
      isUpdate();
    } else if (deleteResp?.status === 404) {
      toast.error(deleteResp.data.message)
    } else {
      toast.error("Error in Deleting Designation")
    }
    onClose();
  }
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

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
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
          width: {xs:'90%',md:"auto"},
          display: "flex",
          flexDirection: "row",
          borderRadius: "6px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h4">Update Product Data</Typography>
          </Grid>
          <Grid item xs={12}>
            <form onSubmit={handleUpdateProduct}>
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
                  <Box sx={{ p:2 }}>
                    {formData.priceList.length > 0 &&  formData.priceList.map((priceEntry, index) => (
                      <Grid container spacing={2} key={index} sx={{ alignItems: "center", pb: 2 }}>
                        <Grid item xs={12} sm={3}>
                          <FormControl fullWidth>
                            <TextField
                              size="medium"
                              type="number"
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
                    <Box display="flex" sx={{flexDirection:{xs:"column",md:"row"}}} gap="6px">
                      <Box display="flex" gap="6px">
                      <Button
                        variant="contained"
                        sx={{
                          whiteSpace: "nowrap",
                        }}
                        type="submit"
                      >
                        Update Product
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
                      <Button
                        variant="contained"
                        onClick={handleDelete}
                        sx={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        Delete Product
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

export default UpdateDesignation;

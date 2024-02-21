import {
  Modal,
  Box,
  Grid,
  FormControl,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import React,{useState,useEffect} from "react";
import {toast} from 'react-toastify';
import { updateDesignation } from "../../services/designation/updateDesignation";


const UpdateDesignation = ({ isOpen, onClose,selectedProduct,isUpdate }) => {
  const [formData, setFormData] = useState({
    image: selectedProduct?.image ? selectedProduct?.image : '',
    designation: selectedProduct ? selectedProduct?.designation : '',
    vitrage: selectedProduct ? selectedProduct?.vitrage : '',
    cermone: selectedProduct ?selectedProduct?.cermone :"",
  });
  const [id , setId] = useState(selectedProduct ? selectedProduct?._id : "") 
  const [showImg, setShowImg] = useState(selectedProduct?.image ? `https://inventory.api.noutfermeture.com/${selectedProduct?.image}` : `/assets/images/default-img.png`);


  useEffect(() => {
    setShowImg(selectedProduct?.image ?  `https://inventory.api.noutfermeture.com/${selectedProduct?.image}` : `/assets/images/default-img.png`);
    setFormData({
        image: selectedProduct?.image ? selectedProduct?.image : '',
    designation: selectedProduct ? selectedProduct?.designation : '',
    vitrage: selectedProduct ? selectedProduct?.vitrage : '',
    cermone: selectedProduct ?selectedProduct?.cermone :"",

    })

    setId(selectedProduct ? selectedProduct?._id : "")
  }, [selectedProduct,onClose,isOpen]);


  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [modalImage, setModalImage] = useState(null);

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

  const handleUpdateProduct = async(e) => {
   
    e.preventDefault();

    
    const formDataAppend = new FormData();
    // if (formData.image instanceof File) {
    //   formDataAppend.append("image", formData.image);
    // }
    formDataAppend.append("designation", formData.designation);
    formDataAppend.append("vitrage", formData.vitrage);
    formDataAppend.append("cermone", formData.cermone);

    if (modalImage) {
      formDataAppend.append("image", modalImage);
    } else {
      formDataAppend.append("image", formData.image);
    }
    
    try {
      const resp = await updateDesignation({formDataAppend,id});
      if (resp && resp.status === 200) {
        toast.success(resp.data.message);
        isUpdate();
        
      } else if (resp) {
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
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          // width: isMobile ? "80%" : 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "row",
          borderRadius: "6px",
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

                  <Grid item xs={12}>
                    <Box display="flex" gap="6px">
                      <Button  variant="contained"
                      sx={{
                       
                        whiteSpace: "nowrap",
                       
                      }} type="submit">
                        Update Product
                      </Button>
                      <Button variant="contained"
                      onClick={handleCancel}
                      sx={{
                       
                        whiteSpace: "nowrap",
                       
                      }}>Cancel</Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </form>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default UpdateDesignation

import React, { useState, useEffect } from "react";
import { Button, Typography, FormControl, Box, Grid,MenuItem } from "@mui/material";
import { deleteProducts } from "../../services/products/deleteProduct";
import { getAllProducts } from "../../services/products/getAllProducts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import { addProducts } from "../../services/products/addProducts";

import { UpdateProducts } from "../../services/products/UpdateProduct";
import { cermoneData, vitrageData } from "../../Utility/data";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const AllProducts = () => {
  const token = localStorage.getItem("tokenDevoted");

  const [Data, setData] = useState(null);
  const [image, setImage] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [modalData, setModalData] = useState({});
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [showImg, setShowImg] = useState({});
  const [showModalImg, setShowModalImg] = useState({});
  const [loading, setLoading] = useState(true);
  // add modal state
  const [AddData, setAddData] = useState({
    productName: "",
    productDescription: "",
    quantity: "",
    productcode: "",
    productCermone:"",
    productVitrage:"",
    price:""
  });

  // this state is basically for update modal which store the privious data of inputs
  const [modalFormdata, setModalFormData] = useState({});
  const cermone = cermoneData;
  const vitrage = vitrageData;

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);

      // Preview the selected image

      const imagePreviewURL = URL.createObjectURL(selectedImage);
      setShowImg({ imagePreview: imagePreviewURL });
    } else {
      setAddData({ ...AddData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(token, "get token");
    const formData = new FormData();
    formData.append("productName", AddData.productName);
    formData.append("productDescription", AddData.productDescription);
    formData.append("quantity", AddData.quantity);
    formData.append("productcode", AddData.productcode);
    formData.append("price", AddData.price);
    formData.append("productCermone",AddData.productCermone)
    formData.append("productVitrage",AddData.productVitrage)
    formData.append("image", image);

    try {
      const resp = await addProducts(formData);

      if (resp && resp.status === 200) {
        toast.success(resp.data.message);
        getAllData();
        handleCloseAdd();
        setAddData({
          productName: "",
          productDescription: "",
          quantity: "",
          productcode: "",
          productcermone:"",
          productVitrage:"",
          price:""
        });
        setShowImg({});
      } else if (resp) {
        toast.error(resp.data.message);
      } else {
        toast.error("Check network connection");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  const handleOpenAdd = () => {
    setAddModalOpen(true);
  };

  const handleCloseAdd = () => {
    setAddModalOpen(false);
  };

  async function getAllData() {
    let resp = await getAllProducts();
    if (resp) {
      if (resp.status === 200) {
        setData(resp.data.getdata);
        setLoading(false)

        // toast.success(resp.data.message);
      } else {
        toast.error(resp.data.message);
      }
    } else {
      toast.error("Check network connection");
    }
  }

  useEffect(() => {
    getAllData();
  }, []);

  async function DeleteProduct(id) {
    try {
      let resp = await deleteProducts(id);
      if (resp) {
        if (resp.status === 200) {
          toast.success(resp.data.message);
        } else {
          toast.error(resp.data.message);
        }
      } else {
        toast.error("Data not found");
      }
      getAllData();
    } catch (error) {
      toast.error("Check your network connection.");
    }
  }

  // edit /update modal  functions data

  const handleModalChange = (e) => {
    if (e.target.name === "image") {
      const selectedImage = e.target.files[0];
      setModalImage(e.target.files[0]);

      // Preview the selected image, or use the existing image if no new image is selected
      if (selectedImage) {
        const imgPreviewURL = URL.createObjectURL(selectedImage);
        setShowModalImg({ imagePreview: imgPreviewURL });
      } else {
        setShowModalImg({
          imagePreview: `https://inventory.api.noutfermeture.com/${modalData.image}`,
        });
      }
    } else {
      setModalFormData({ ...modalFormdata, [e.target.name]: e.target.value });
    }
  };

  const handleOpenUpdate = (data) => {
    setOpen(true);
    setModalData(data);

    setModalFormData({
      productName: data.productName,
      productDescription: data.productDescription,
      quantity: data.quantity,
      productcode: data.productcode,
      productCermone:data.productCermone,
      productVitrage:data.productVitrage,
      price: data.price,
    });
    if (data.image) {
      setShowModalImg({ imagePreview: `https://inventory.api.noutfermeture.com/${data.image}` });
      setModalImage(data.image);
      console.log(data.image, "imggggggg");
    } else {
      setShowModalImg({});
    }
  };

  const handleCloseUpdate = () => {
    setOpen(false);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", modalFormdata.productName);
    formData.append("productDescription", modalFormdata.productDescription);
    formData.append("quantity", modalFormdata.quantity);
    formData.append("productcode", modalFormdata.productcode);
    formData.append("price", modalFormdata.price);
    formData.append("productCermone",modalFormdata.productCermone);
    formData.append("productVitrage",modalFormdata.productVitrage)

    if (modalImage) {
      formData.append("image", modalImage);
    } else {
      formData.append("image", modalData.image);
    }
    console.log(modalData.image, "imgggggggggg");

    try {
      const resp = await UpdateProducts(modalData._id, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (resp && resp.status === 200) {
        toast.success(resp.data.message);
        setModalImage(null);
        getAllData();
        handleCloseUpdate();
        setShowModalImg({});
      } else if (resp) {
        toast.error(resp.data.message);
      } else {
        toast.error("Check network connection");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  return (
    <Box sx={{ width: "100%", padding: "0 20px", boxSizing: "border-box" }}>
      <ToastContainer />
      <Box>
        <Typography
          textAlign="center"
          variant="h2"
          sx={{ fontSize: "24px", fontWeight: "700", margin: "20px 0" }}
        >
          ALL Products
        </Typography>
      </Box>

      <Box sx={{ padding: "0 8px", boxSizing: "border-box" }}>
        {" "}
        <Button
          onClick={handleOpenAdd}
          sx={{
            padding: "10px 15px",
            textTransform: "capitalize",
          }}
          variant="contained"
          color="primary"
        >
          Add Product
        </Button>
      </Box>

      <Box sx={{ marginBottom: "10px" }}>
        {/*for add product MODAL */}
        <Modal
          open={addModalOpen}
          onClose={handleCloseAdd}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box
            sx={{
              ...style,
              width: "70%",
              height: "auto",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h4">Add Product Data</Typography>
              </Grid>

              <Grid item xs={12}>
                <form onSubmit={handleSubmit}>
                  <Box sx={{ padding: "20px", borderRadius: "12px" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box display={"flex"} flexDirection={"column"}>
                          {/* Image preview */}
                          {showImg.imagePreview && (
                            <img
                              src={showImg.imagePreview}
                              alt="Preview"
                              style={{
                                width: "100px",
                                height: "50px",
                                marginTop: "10px",
                                border: "0.5px solid gray",
                                padding: "5px",
                              }}
                            />
                          )}
                          <br />
                          <input
                            type="file"
                            placeholder="upload image"
                            onChange={handleChange}
                            name="image"
                            required
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box>
                          <FormControl fullWidth>
                            <TextField
                              fullWidth
                              label="Product Name"
                              name="productName"
                              onChange={handleChange}
                              value={AddData.productName}
                            />
                          </FormControl>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <FormControl fullWidth>
                            <TextField
                              fullWidth
                              label="Product Code"
                              name="productcode"
                              onChange={handleChange}
                              value={AddData.productcode}
                            />
                          </FormControl>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <FormControl fullWidth>
                            <TextField
                              type="number"
                              fullWidth
                              label="Quantity"
                              name="quantity"
                              onChange={handleChange}
                              value={AddData.quantity}
                            />
                          </FormControl>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <FormControl fullWidth>
                            <TextField
                              type="number"
                              fullWidth
                              label="$Price"
                              name="price"
                              onChange={handleChange}
                              value={AddData.price}
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
                              name="productCermone"
                              select
                              onChange={handleChange}
                              value={AddData.productCermone}
                            >
                                {cermone.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>) ) }
                            </TextField>
                          </FormControl>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <FormControl fullWidth>
                            <TextField
                              fullWidth
                              select
                              label="Product Vitrage"
                              name="productVitrage"
                              onChange={handleChange}
                              value={AddData.productVitrage}
                            >
                              {vitrage.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
                            </TextField>
                          </FormControl>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box>
                          <FormControl fullWidth>
                            <TextField
                              fullWidth
                              multiline
                              rows={4}
                              label="Description"
                              name="productDescription"
                              onChange={handleChange}
                              value={AddData.productDescription}
                            />
                          </FormControl>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box display="flex" gap="6px">
                          <Button variant="contained" type="submit">
                            Add Product
                          </Button>
                          <Button variant="contained" onClick={handleCloseAdd}>
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
      </Box>

      {/* for update product modal */}
      <Modal
        open={open}
        onClose={handleCloseUpdate}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box
          sx={{
            ...style,
            width: "70%",
            height: "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h4">Update Product Data</Typography>
            </Grid>
            <Grid item xs={12}>
              <form onSubmit={handleModalSubmit}>
                <Box sx={{ padding: "20px", borderRadius: "12px" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box>
                        {showModalImg.imagePreview && (
                          <img
                            src={showModalImg.imagePreview}
                            alt="Preview"
                            style={{
                              width: "100px",
                              height: "50px",
                              marginTop: "10px",
                            }}
                          />
                        )}
                        <br />
                        <input
                          type="file"
                          onChange={handleModalChange}
                          name="image"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <FormControl fullWidth>
                          <TextField
                            fullWidth
                            label="Product Name"
                            name="productName"
                            onChange={handleModalChange}
                            value={modalFormdata.productName}
                          />
                        </FormControl>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <FormControl fullWidth>
                          <TextField
                            fullWidth
                            label="Product Code"
                            name="productcode"
                            onChange={handleModalChange}
                            value={modalFormdata.productcode}
                          />
                        </FormControl>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <FormControl fullWidth>
                          <TextField
                            fullWidth
                            type="number"
                            label="Quantity"
                            name="quantity"
                            onChange={handleModalChange}
                            value={modalFormdata.quantity}
                          />
                        </FormControl>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <FormControl fullWidth>
                          <TextField
                            fullWidth
                            type="number"
                            label="Price"
                            name="price"
                            onChange={handleModalChange}
                            value={modalFormdata.price}
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
                              name="productCermone"
                              select
                              onChange={handleModalChange}
                              value={modalFormdata.productCermone}
                            >
                                {cermone.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>) ) }
                            </TextField>
                          </FormControl>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <FormControl fullWidth>
                            <TextField
                              fullWidth
                              select
                              label="Product Vitrage"
                              name="productVitrage"
                              onChange={handleModalChange}
                              value={modalFormdata.productVitrage}
                            >
                              {vitrage.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
                            </TextField>
                          </FormControl>
                        </Box>
                      </Grid>
                    <Grid item xs={12}>
                      <Box>
                        <FormControl fullWidth>
                          <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Description"
                            name="productDescription"
                            onChange={handleModalChange}
                            value={modalFormdata.productDescription}
                          />
                        </FormControl>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box display="flex" gap="6px">
                        <Button variant="contained" type="submit">
                          Update Product
                        </Button>
                        <Button variant="contained" onClick={handleCloseUpdate}>
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
      {/* END update modal  */}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "14px",
          rowGap: "20px", // Adjust for smaller screens
        }}
      >
      
        {loading?     <p>Loading...</p>:   Data ? (
          Data.map((item, index) => {
            return (
              <Box
                key={index}
                sx={{
                  width: "230px",
                  overflow: "hidden",

                  padding: "20px",
                  borderRadius: "12px",
                  background: "#FFFFFF",
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        maxWidth: "300px",
                        width: "100%",
                        height: "130px",
                        overflow: "hidden",
                      }}
                    >

                      <img
                        // src={`http://localhost:1000/${item.image}`}
                        src={`https://inventory.api.noutfermeture.com/${item.image}`}
                        // src={`./assets/${item.image}`}
                        style={{
                          borderRadius: "8px",
                          width: "100%",
                          height: "100%",
                        }}
                        alt="Product"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Box display={{display:"flex",justifyContent:"space-between"}}>
                        <Typography
                          textAlign="left"
                          sx={{
                            color: "black",
                            fontWeight: "400",
                            fontSize:"14px",
                            lineHeight: "143%",
                          }}
                        >
                          {item.productName}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#141414",
                            fontSize: "14px",
                            fontWeight: "900",
                            lineHeight: "143%",
                          }}
                        >
                          ${item.price}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography
                          textAlign="left"
                          sx={{
                            color: "black",
                            fontWeight: "500",
                            lineHeight: "143%",
                            fontSize:"14px",
                          }}
                        >
                          Description
                        </Typography>
                        <Typography
                          sx={{
                            color: "#545454",
                            fontSize: "12px",
                            fontWeight: "400",
                            lineHeight: "143%",
                          }}
                        >
                          {item.productDescription}
                        </Typography>
                      </Box>
                      {/* <Box>
                        <Typography
                          textAlign="left"
                          sx={{
                            color: "black",
                            fontWeight: "500",
                            lineHeight: "143%",
                          }}
                        >
                          Price
                        </Typography>
                        <Typography
                          sx={{
                            color: "#545454",
                            fontSize: "12px",
                            fontWeight: "400",
                            lineHeight: "143%",
                          }}
                        >
                          ${item.price}
                        </Typography>
                      </Box> */}
                      <Box>
                        <Typography
                          textAlign="left"
                          sx={{
                            color: "black",
                            fontWeight: "400",
                            lineHeight: "normal", fontSize:"14px",
                          }}
                        >
                          {item.productcode}
                        </Typography>
                      </Box>
                      <Box display="flex" gap="10px" alignItems="center">
                        <Typography
                          textAlign="left"
                          sx={{
                            color: "black",
                            fontWeight: "300",
                            lineHeight: "200%", fontSize:"14px",
                          }}
                        >
                          Product Quantity
                        </Typography>
                        <Typography sx={{ fontSize:"14px",}}>{item.quantity}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} display="flex" gap="6px">
                    <Button
                      sx={{ textTransform: "capitalize" }}
                      variant="outlined"
                      onClick={() => handleOpenUpdate(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      sx={{ textTransform: "capitalize" }}
                      variant="contained"
                      onClick={() => DeleteProduct(item._id)}
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            );
          })
        ) : (
          <div>Not found</div>
        )}
      </Box>
    </Box>
  );
};

export default AllProducts;

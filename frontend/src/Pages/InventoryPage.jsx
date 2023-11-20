import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Typography, Table, TableBody, TableCell, TableHead, TableRow, FormControl, TextField } from '@mui/material';
import { getAllProducts, getOneProduct } from '../services/products/getAllProducts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '@mui/material/Modal';
import ClearIcon from '@mui/icons-material/Clear';
import { getQrcode } from '../services/products/getAllProducts';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import { UpdateQuantity } from '../services/products/updateQuantity';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  pt: 2,
  px: 4,
  pb: 3,
};

const InventoryPage = () => {
  let navigate = useNavigate();
  const [qrCodeUrlSell, setQRCodeUrlSell] = useState('');
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSell, setOpenSell] = useState(false);
  const [searchData, setSearchData] = useState('');
  const [page, setPage] = useState(1);
  const [Size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuantity, setTotalQuantity] = useState(0);
  // update quantity
  let [oneProduct, setOneProduct] = useState(null);
  const [priviousQuantity, setPriviousQuantity] = useState(0);
  const [newQuantity, setNewQuantity] = useState();

  // Function to handle the new quantity input
  function handleNewQuantity(e) {
    let inputValue = parseInt(e.target.value);

    if (!isNaN(inputValue) && inputValue >= 0) {
      setNewQuantity(inputValue);
      setTotalQuantity(inputValue);
    } else {
      setNewQuantity(0);
    }
  }

  // Function to handle quantity submission
  async function handleQuantitySubmit(e) {
    e.preventDefault();
    let newData = { newQuantity: newQuantity };
    try {
      let response = await UpdateQuantity(oneProduct._id, newData);
      if (response.status === 200) {
        console.log(response.data.message);
        toast.success(response.data);
        toast.success(response.data.message);

        handleClose();
        getData();
        setNewQuantity(" ");
      } else {
        toast.error();
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Function to handle the search input
  function searchFun(e) {
    setSearchData(e.target.value);
  }

  // Function to clear the search input
  function clearSearch(e) {
    setSearchData('');
  }

  // Function to open the update quantity modal
  const handleOpen = async (id) => {
    setOpen(true);

    try {
      let resp = await getOneProduct(id);
      if (resp.status === 200) {
        setPriviousQuantity(resp.data.data.quantity);
        setOneProduct(resp.data.data);
        console.log(oneProduct._id, "one product");
      } else {
        console.log(resp.data.message);
      }
    } catch (error) {
      console.error('Failed to make the request', error);
    }
  };

  // Function to close the update quantity modal
  const handleClose = () => {
    setOpen(false);
  };

  // Function to close the sell modal
  const handleCloseSellModal = async () => {
    setOpenSell(false);
  };

  // Function to open the sell modal
  const handleOpenSellModal = async (id) => {
    setOpenSell(true);

    try {
      const response = await getQrcode(id);
      if (response.status === 200) {
        setQRCodeUrlSell(response.data.qrCodeUrl);
      } else {
        console.error('Failed to generate QR code');
      }
    } catch (error) {
      console.error('Failed to make the request', error);
    }
  };

  // Function to fetch data from the server
  async function getData() {
    try {
      const resp = await getAllProducts(page, Size);
      if (resp.status === 200) {
        setData(resp.data.getdata);
        setTotalPages(resp.data.totalPages);
      } else {
        toast.error(resp.data.message);
      }
    } catch (error) {
      toast.error('Check network connection');
    }
  }

  // Fetch data on component when page/Size changes
  useEffect(() => {
    getData();
  }, [page, Size]);

  return (
    <Box sx={{ width: { xs: 'auto', sm: "auto" }, padding: "0 10px" }}>
      <ToastContainer />
      {/* Update Quantity Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: "30%" }}>
          <div>
            <Typography variant='h5' sx={{ textAlign: "center" }}>Update Quantity</Typography>
            <div>
              <form onSubmit={handleQuantitySubmit}>
                <Box sx={{ padding: '20px', borderRadius: '12px' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box>
                        <FormControl fullWidth>
                          <TextField
                            type='number'
                            fullWidth
                            label="Previous Quantity"
                            disabled
                            name="quantity" value={priviousQuantity} />
                        </FormControl>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box>
                        <FormControl fullWidth>
                          <TextField
                            type='number'
                            fullWidth
                            label="Add Quantity"
                            required
                            value={newQuantity}
                            onChange={handleNewQuantity}
                          />
                        </FormControl>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ margin: "6px 0", color: "#707070" }}>Total Quantity = {parseInt(priviousQuantity) + parseInt(totalQuantity)}</Box>
                      <Box display="flex" gap="6px">
                        <Button variant="outlined" sx={{ textTransform: "capitalize" }} type="submit">
                          Update Quantity
                        </Button>
                        <Button variant='contained' sx={{ textTransform: "capitalize" }} onClick={handleClose}>Cancel</Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </form>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Sell Modal */}
      <Modal
        open={openSell}
        onClose={handleCloseSellModal}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: "30%" }}>
          <div>
            {qrCodeUrlSell && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h3>QR Code:</h3>
                <img src={qrCodeUrlSell} alt="QR Code" /><br />
                <a href={qrCodeUrlSell} download="qrcode.png">Download</a>
                <Button sx={{ margin: "4px 0" }} variant='contained' onClick={handleCloseSellModal}>Cancel</Button>
              </div>
            )}
            {/* <Button onClick={() => { navigate("/open-scanner") }}>Open Scanner</Button> */}
           
          </div>
        </Box>
      </Modal>

      <Grid container>
        <Grid item xs={12}>
          <Box sx={{ borderRadius: "12px" }}>
            <Typography sx={{ fontSize: "30px" }} variant='1'>Welcome to the inventory page</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ borderRadius: "12px", display: "flex", gap: "5px" }}>
            <Box sx={{ display: "flex", border: "0.5px solid gray", alignItems: "center", borderRadius: "8px", padding: "3px 10px" }}>
              <input type='text' onChange={searchFun} placeholder='Search product..' value={searchData} style={{ outline: "none", border: "none" }} />
              {searchData.length > 0 && (
                <span onClick={clearSearch}><ClearIcon /></span>
              )}
            </Box>
            <Box>
              <Button sx={{ borderRadius: "8px", padding: "7px 20px", textTransform: "capitalize" }} variant='contained'>Search</Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ borderRadius: "12px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Product Description</TableCell>
                  <TableCell>Product Code</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length > 0 ? (
                  data.filter((item) => {
                    const productName = item.productName.toLowerCase();
                    const productDescription = item.productDescription.toLowerCase();
                    const productcode = item.productcode.toLowerCase();
                    const searchDataLowerCase = searchData.toLowerCase();
                    return productName.includes(searchDataLowerCase) || productDescription.includes(searchDataLowerCase) || productcode.includes(searchDataLowerCase);
                  }).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box sx={{ width: "100px" }}>
                          <img
                            src={`http://localhost:1000/${item.image}`}
                            style={{ width: '100%', height: '70px' }}
                            alt="Product"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.productDescription}</TableCell>
                      <TableCell>{item.productcode}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: "6px" }}>
                          <Button variant='contained' sx={{ textTransform: "capitalize" }} onClick={() => { handleOpen(item._id) }}>Add more Quantity</Button>
                          <Button variant='contained' sx={{ textTransform: "capitalize" }} onClick={() => { handleOpenSellModal(item._id) }}>Generate Sell QR code</Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell>Data not found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => {
                  setPage(value);
                }}
                renderItem={(item) => {
                  return (
                    <PaginationItem
                      component={Button}
                      {...item}
                    />
                  )
                }}
              />
            </Stack>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InventoryPage;

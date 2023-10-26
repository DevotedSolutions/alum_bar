import React, { useState, useEffect } from 'react'
import { Box, Button, Grid, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { getAllProducts } from '../services/products/getAllProducts'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '@mui/material/Modal';
import ClearIcon from '@mui/icons-material/Clear';
import { getQrcode } from '../services/products/getAllProducts';
// import { DecrementProduct } from '../services/products/DecrementProduct';
import { QrReader } from "react-qr-reader";


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
    const [productId, setProductId] = useState('');
    // console.log(productId);
    const [qrCodeUrl, setQRCodeUrl] = useState('');
    const [qrCodeUrlSell, setQRCodeUrlSell] = useState('');
    const [data, setData] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [openSell, setOpenSell] = React.useState(false);
    const [searchData, setSearchData] = useState('');




    // search functionality
    function searchFun(e) {

        setSearchData(e.target.value)

    }


    function clearSearch(e) {

        setSearchData("")

    }
    
    //  functionality

   



    const handleOpen = async (id) => {
        console.log(id);
        setOpen(true);
        setProductId(id)

        try {


            const response = await getQrcode(id);
            // console.log(response, "response");
            if (response.status === 200) {
                setQRCodeUrl(response.data.qrCodeUrl);
                console.log(qrCodeUrl,"qrcode urlllllllllll");

            } else {
                console.error('Failed to generate QR code');
            }
        } catch (error) {
            console.error('Failed to make the request', error);
        }
   

    };
    const handleClose = () => {
        setOpen(false);
    };



    // modal 2 functions
    const handleCloseSellModal = async () => {
        setOpenSell(false);

    };


    const handleOpenSellModal = async (id) => {
        setOpenSell(true);

        try {


            const response = await getQrcode(id);
            console.log(response, "response");
            if (response.status === 200) {

                setQRCodeUrlSell(response.data.qrCodeUrl);
                console.log(qrCodeUrlSell, "qrcodeurllllll   ");
            } else {
                console.error('Failed to generate QR code');
            }
        } catch (error) {
            console.error('Failed to make the request', error);
        }


    };

    // async function Decrement(id) {
    //     const resp = await DecrementProduct(id);
    //     console.log(resp);
    // }


    async function getData() {
        try {
            const resp = await getAllProducts();
            if (resp.status === 200) {
                setData(resp.data.getdata);
            } else {
                toast.error(resp.data.message);
            }
        } catch (error) {
            toast.error('Check network connection');
        }
    }

    useEffect(() => {
        getData();
    }, []);

function handleScan(){
    console.log("hi");
}




    return (
        <Box sx={{ width: { xs: "100%", sm: "100%" }, padding: "0 10px" }}>

            <ToastContainer />
            {/* modal 1 */}
            <div >

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                >
                    <Box sx={{ ...style, width: "30%" }}>

                        <div>
                            <div>

                                <div>


                                </div>
                                {qrCodeUrl && (
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <h3>QR Code</h3>
                                        <img src={qrCodeUrl} alt="QR Code" onScan={handleScan}  /><br />
                                        <a href={qrCodeUrl} download="qrcode.png">Download</a>
                                    </div>
                                )}

                            </div>


                         




                        </div>
                        <Button variant='contained' onClick={handleClose}>Cancel</Button>
                    </Box>
                </Modal>
            </div>




            {/* sell modal */}
            <div >

                <Modal
                    open={openSell}
                    onClose={handleCloseSellModal}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                >
                    <Box sx={{ ...style, width: "30%" }}>

                        <div>

                            <div>

                                <div>


                                </div>
                                {qrCodeUrlSell && (
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <h3>QR Code:</h3>
                                        <img src={qrCodeUrlSell} alt="QR Code" /><br />
                                        <a href={qrCodeUrlSell} download="qrcode.png">Download</a>
                                    </div>
                                )}

                            </div>



                        </div>

                        <Button sx={{ margin: "4px 0" }} variant='contained' onClick={handleCloseSellModal}>Cancell</Button>
                    </Box>
                </Modal>
            </div>
















            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Box sx={{ borderRadius: "12px" }}>
                        <Typography sx={{ fontSize: "30px" }} variant='1'>Welcome to inventory page</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ borderRadius: "12px", display: "flex", gap: "5px" }}>

                        <Box sx={{ display: "flex", border: "0.5px solid gray", alignItems: "center", borderRadius: "8px", padding: "3px 10px" }}>

                            <input type='text' onChange={searchFun} value={searchData} style={{ outline: "none", border: "none" }} />
                            {searchData.length > 0 && (
                                <span onClick={clearSearch}><ClearIcon /></span>
                            )}


                        </Box><Box> <Button sx={{ borderRadius: "8px", padding: "7px 20px", textTransform: "capitalize" }} variant='contained'>Serarch</Button></Box>

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
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody >
                                {data.length > 0 ? (
                                    data.map((item, index) => (
                                        <TableRow key={index} >
                                            <TableCell>
                                                <Box sx={{ width: "100px" }}> <img
                                                    src={`http://localhost:1000/${item.image}`}
                                                    style={{ width: '100%', height: '70px' }}
                                                    alt="Product"
                                                /></Box>
                                            </TableCell>
                                            <TableCell>{item.productName}</TableCell>
                                            <TableCell>{item.productDescription}</TableCell>
                                            <TableCell>{item.productcode}</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: "flex", gap: "6px" }}>
                                                    <Button variant='contained'
                                                        sx={{ textTransform: "capitalize" }}
                                                        onClick={() => { handleOpen(item._id) }}>Generate Buy QRcode</Button>
                                                    <Button variant='contained'
                                                        sx={{ textTransform: "capitalize" }}
                                                        onClick={() => { handleOpenSellModal(item._id) }}>Generate Sell QRcode</Button></Box>

                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell >Data not found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {/* <Box sx="border 1px solid black">
                            <Box display={"flex"} sx={{width:"100%", alignItems:"center",justifyContent:"space-between"}}>
                                <Box>image</Box>  <Box> productName</Box>  <Box>productDescription</Box>  <Box>productcode</Box>  <Box>quantity</Box>
                                <Box> action</Box>  </Box>
                            {data.length > 0 ? (data.map((item, index) => {

                                return <Box key={index} sx={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                                    <Box sx={{ width: "100px" }}> <img
                                        src={`http://localhost:1000/${item.image}`}
                                        style={{ width: '100%', height: '70px' }}
                                        alt="Product"
                                    /></Box>
                                    <Box>{item.productName}</Box>
                                    <Box>{item.productDescription}</Box>
                                    <Box>{item.productcode}</Box>
                                    <Box>{item.quantity}</Box>
                                    
                                    <Box><Button>edit</Button><Button>delete</Button></Box>

                                </Box>


                            })) : (<h1>data not found</h1>)}

                        </Box>


 */}




                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default InventoryPage;














// const GenerateQRCode = () => {
//     QRCode.toDataURL(url, {
//         width: 200,
//         margin: 2,
//         color: {
//             dark: '#335383FF',
//             light: '#EEEEEEFF'
//         }
//     }, (err, url) => {
//         if (err) return console.error(err)

//         console.log(url)
//         setQr(url)
//     })
// }

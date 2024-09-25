import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  useMediaQuery,
  Drawer,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
//import QrReader from "react-qr-scanner";
import { Modal } from "@mui/material";
import { Add, Close, Remove, ShoppingCart } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getOneProduct,
  sellProduct,
} from "../services/products/getAllProducts";
import Html5QrcodePlugin from "../Components/HTML5QRCode";
import "../Utility/scanner.css";

const containerStyle = {
  display: "flex",
  justifyContent: "space-around",
  width: "100%",
  margin: "16px",
};

const OpenScanner = () => {
  const modalRef = useRef(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [scanResultWebCam, setScanResultWebCam] = useState("");
  const [products, setProducts] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const boxStyle = {
    position: "relative",
    width: isSmallScreen ? "100%" : "50%", // Adjusted for mobile responsiveness
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    pt: 2,
    px: 4,
    pb: 3,
  };

  const navigate = useNavigate();

  const handleErrorWebCam = (error) => {
    console.error(error);
  };

  const handleScanWebCam = async (result) => {
    if (result) {
      setScanResultWebCam(result);

      const response = await getOneProduct(result);
      const toadd = response?.data?.data;

      if (toadd) {
        // Use functional form of setProducts to ensure we have the latest products
        setProducts((prevProducts) => {
          const isexisting = prevProducts.find(
            (product) => product?._id === toadd?._id
          );

          if (isexisting) {
            toast?.info("Product already present in the cart!");
            return prevProducts; // Return the current state without adding the product
          }

          // Add the new product to the list if it doesn't exist
          return [...prevProducts, { ...toadd, quantity: 1 }];
        });
      }

      handleOpenModal();
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setScanResultWebCam("");
  };

  const printList = () => {
    window.print();
  };

  // const handleSell = async () => {
  //   const id = scanResultWebCam;
  //   console.log(id);
  //   const response = await sellProduct(id, quantity);
  //   if (response.status === 200) {
  //     handleCloseModal();
  //     toast.success("Successfully sold Product");
  //     navigate("/inventory");
  //     setScanResultWebCam("");
  //   } else {
  //     toast.error("An Error Occured in Solding Product");
  //     handleCloseModal();
  //   }
  // };
  const handleSell = async () => {
    try {
      for (const product of products) {
        const { quantity } = product;
        const id = product?._id;

        const response = await sellProduct(id, quantity);

        if (response.status === 200) {
          console.log(`Successfully sold product with id: ${id}`);
        } else {
          // If an error occurs for a specific product, show a toast but continue with others
          toast.error(`An error occurred while selling product with id: ${id}`);
        }
      }

      // After all products are processed, close modal, show success message, and navigate
      handleCloseModal();
      setProducts([]);
      toast.success("Successfully sold all products");
      navigate("/inventory");
      setScanResultWebCam("");
    } catch (error) {
      // In case of any general error during the operation, log and notify the user
      console.error("An error occurred while processing the sale:", error);
      toast.error("An error occurred during the sale process");
      handleCloseModal();
    }
  };

  // useEffect(() => {
  //   const handleClickOutsideModal = (event) => {
  //     if (
  //       isModalOpen &&
  //       modalRef.current &&
  //       !modalRef.current.contains(event.target)
  //     ) {
  //       window.location.reload();
  //       handleCloseModal();
  //     }
  //   };

  //   document.addEventListener("click", handleClickOutsideModal);

  //   return () => {
  //     document.removeEventListener("click", handleClickOutsideModal);
  //   };
  // }, [isModalOpen]);

  const cameraFacingMode = isSmallScreen ? "environment" : "user";

  return (
    <div style={containerStyle}>
      <Box sx={boxStyle}>
        {products?.length > 0 ? (
          <IconButton>
            <ShoppingCart
              onClick={() => {
                setModalOpen(true);
              }}
            />
          </IconButton>
        ) : null}
        <ToastContainer />
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "330px",
              height: "400px",
            }}
          >
            <Typography variant="h6">QR Scanner</Typography>

            {navigator.getUserMedia ? (
              <Html5QrcodePlugin
                fps={10}
                qrbox={{ width: 175, height: 175 }}
                disableFlip={false}
                qrCodeSuccessCallback={handleScanWebCam}
              />
            ) : (
              // <QrReader
              //   key={cameraFacingMode}
              //   constraints={{
              //     audio: false,
              //     video: { facingMode: cameraFacingMode },
              //   }}
              //   delay={3000}
              //   style={{
              //     width: "100%",
              //     borderWidth: 2,
              //     borderColor: "#00FF00",
              //     backgroundColor: "transparent",
              //   }}
              //   onError={handleErrorWebCam}
              //   onScan={handleScanWebCam}
              // />
              <p>http does not support camera</p>
            )}

            <Drawer
              open={isModalOpen}
              onClose={handleCloseModal}
              aria-labelledby="child-modal-title"
              aria-describedby="child-modal-description"
              anchor="right"
            >
              <Box
                sx={{
                  minWidth: "300px",
                }}
              >
                <Grid
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: "5px",
                  }}
                >
                  <Close
                    onClick={() => {
                      handleCloseModal();
                    }}
                  />
                </Grid>

                <Box
                  className="printable-content"
                  ref={modalRef}
                  sx={{
                    ...boxStyle,
                    margin: "12px",
                    display: "flex",
                    justifyContent: "center",
                    width: "90%",
                  }}
                >
                  {[...products]?.map((product, index) => {
                    return (
                      <div className="product-item" key={index}>
                        <Typography variant="h6" sx={{ textAlign: "center" }}>
                          Item {index + 1}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ textAlign: "center" }}
                        >
                          {product?.productcode} {product?.productDescription}
                        </Typography>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "2px",
                          }}
                        >
                          <Typography variant="body1">Quantity:</Typography>
                          <IconButton
                            onClick={() => {
                              setProducts((prevProducts) => {
                                let newProduct = {
                                  ...product,
                                  quantity: Math.max(0, product?.quantity - 1),
                                };

                                return newProduct?.quantity === 0
                                  ? prevProducts?.filter(
                                      (product) =>
                                        product?._id !== newProduct?._id
                                    )
                                  : prevProducts.map((product, index1) =>
                                      index === index1 ? newProduct : product
                                    );
                              });
                            }}
                            size="small"
                          >
                            <Remove />
                          </IconButton>
                          <input
                            type="text"
                            value={product?.quantity}
                            onChange={(e) => {
                              const quantity = Math.max(
                                1,
                                parseInt(e.target.value) || 1
                              );
                              setProducts((prevProducts) => {
                                return prevProducts.map((product, index1) =>
                                  index === index1
                                    ? { ...product, quantity: quantity }
                                    : product
                                );
                              });
                            }}
                            style={{
                              width: "40px",
                              textAlign: "center",
                              margin: "5px",
                            }}
                          />
                          <IconButton
                            onClick={() => {
                              setProducts((prevProducts) => {
                                return prevProducts.map((product, index1) =>
                                  index === index1
                                    ? {
                                        ...product,
                                        quantity: product?.quantity + 1,
                                      }
                                    : product
                                );
                              });
                            }}
                            size="small"
                          >
                            <Add />
                          </IconButton>
                        </div>
                      </div>
                    );
                  })}

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSell}
                    style={{ marginTop: "10px", marginLeft: "25px" }}
                  >
                    Confirm Sell
                  </Button>

                  {/* Print Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={printList}
                    style={{ marginTop: "10px", marginLeft: "25px" }}
                  >
                    Print
                  </Button>
                </Box>
              </Box>
            </Drawer>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default OpenScanner;

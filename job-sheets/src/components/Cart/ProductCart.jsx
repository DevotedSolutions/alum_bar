import React, { useState } from "react";
import { Add, Delete, Remove } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Box,
  IconButton,
  TextField,
  FormControlLabel,
  Checkbox,
  Modal,
  useMediaQuery,
} from "@mui/material";
import default_img from "../../assets/default-img.png";
import PdfDocument from "./PdfDocument";
import { PDFDownloadLink } from "@react-pdf/renderer";
import clearcart from "../../assets/clear-cart.png";

const ProductCart = ({ cartItems, setCartItems }) => {
  const [openModal, setOpenModal] = useState(false);
  const [clientDetails, setClientDetails] = useState({
    nomClient: "",
    tel: "",
    email: "",
    mesureFinale: false,
  });

  const handleExportAsPDF = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setClientDetails({
      nomClient: "",
      tel: "",
      email: "",
      mesureFinale: false,
    });
    setOpenModal(false);
  };

  console.log(clientDetails.mesureFinale);

  const isMobile = useMediaQuery("(max-width:800px)");

  const updateQuantity = (index, newQuantity, newPrice) => {
    newQuantity = Math.max(1, newQuantity);
    const updatedCartItems = [...cartItems];
    updatedCartItems[index].quantity = newQuantity;
    updatedCartItems[index].price = newPrice;
    const tax =
      (updatedCartItems[index].largeur / 1000 +
        updatedCartItems[index].hauteur / 1000) *
      2 *
      16 *
      newQuantity;
    updatedCartItems[index].tax = tax;
    setCartItems(updatedCartItems);
  };

  const deleteItemFromCart = (index) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems.splice(index, 1);
    setCartItems(updatedCartItems);
  };

  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach((product) => {
      total += product.price * product.quantity;
    });
    return total.toFixed(2);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const generateRandomQuotation = () => {
    return Math.floor(Math.random() * 9000) + 1000;
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          alignItems: "center",
          pb: "30px",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
            width: "80%",
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "16px",
              textAlign: "center",
              mt: 2,
            }}
          >
            {cartItems.length === 1
              ? `${cartItems.length} article(s) ajoutés au panier`
              : `${cartItems.length} items ajoutés au panier`}
          </Typography>
          <IconButton onClick={clearCart}>
            <img src={clearcart} width="30px" />
          </IconButton>
        </Box>
        {cartItems?.map((product, index) => (
          <Card sx={{ width: 280, margin: "12px", display: "flex", p: 1 }}>
            <CardMedia
              component="img"
              alt={product?.designation}
              height="100"
              // image={`https://app.noutfermeture.com/api/${product?.image}`}
              image={
                product?.image
                  ? `https://app.noutfermeture.com/api/${product?.image}`
                  : default_img
              }
              //image={default_img}
              sx={{ objectFit: "contain", width: "100px" }}
            />
            <CardContent
              sx={{
                p: 0,
                ml: 2,
                "&:last-child": {
                  paddingBottom: 0,
                },
              }}
            >
              <Typography
                variant="h6"
                nowrap="true"
                sx={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  //whiteSpace: "nowrap",
                }}
              >
                {product?.designation && product?.designation.length > 20
                  ? `${product.designation.substring(
                      0,
                      product.designation.length / 2
                    )}...`
                  : product?.designation}
              </Typography>
              <Box sx={{ display: "flex", mt: 1 }}>
                <Typography variant="body1" sx={{ fontSize: "12px" }}>
                  Quantity:
                </Typography>
                <IconButton
                  onClick={() =>
                    updateQuantity(index, product.quantity - 1, product.price)
                  }
                  size="small"
                  sx={{
                    p: 0,
                    width: "8px",
                    ml: 2,
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <Remove sx={{ width: "20px" }} />
                </IconButton>
                <TextField
                  size="small"
                  value={product?.quantity}
                  inputProps={{
                    style: {
                      padding: 0,
                      textAlign: "center",
                    },
                  }}
                  onChange={(e) =>
                    updateQuantity(
                      index,
                      Math.max(1, e.target.value, product.price)
                    )
                  }
                  sx={{ width: 30, mx: 1, p: 0 }}
                />
                <IconButton
                  onClick={() =>
                    updateQuantity(index, product.quantity + 1, product.price)
                  }
                  size="small"
                  sx={{
                    p: 0,
                    width: "8px",
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <Add sx={{ width: "20px" }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => deleteItemFromCart(index)}
                  sx={{
                    p: 0,
                    ml: 2,
                    width: "8px",
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <Delete sx={{ width: "20px" }} />
                </IconButton>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "12px", whiteSpace: "nowrap" }}
              >
                <span style={{ fontWeight: "bold" }}>Color:</span>
                {product.color}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "12px", whiteSpace: "nowrap" }}
              >
                <span style={{ fontWeight: "bold" }}>Price:</span>{" "}
                {product.price * product.quantity} €
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Box
        sx={{
          backgroundColor: "#08999D",
          width: "100%",
          position: "sticky",
          boxSizing: "border-box",
          bottom: 0,
          //left:0,
          //right:0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1,
        }}
      >
        <Typography variant="h6" color="white">
          Total: {calculateTotal()} €
        </Typography>

        <Button
          variant="contained"
          sx={{
            fontSize: "12px",
            textTransform: "none",
          }}
          onClick={handleExportAsPDF}
        >
          Export as PDF
        </Button>
      </Box>
      <Modal open={openModal} onClose={handleCloseModal} closeAfterTransition>
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 4,
            boxShadow: 24,
            padding: 4,
            maxWidth: 400,
            margin: "auto",
            marginTop: "10vh",
          }}
        >
          <Typography variant="h6" mb={2}>
            Enter Client Details
          </Typography>
          <TextField
            label="Nom Client"
            value={clientDetails.nomClient}
            onChange={(e) =>
              setClientDetails({ ...clientDetails, nomClient: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Tel"
            value={clientDetails.tel}
            onChange={(e) =>
              setClientDetails({ ...clientDetails, tel: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={clientDetails.email}
            onChange={(e) =>
              setClientDetails({ ...clientDetails, email: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <Box mt={2}>
            <Typography variant="body1" mb={1}>
              Mesure finale:
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={clientDetails.mesureFinale}
                  onChange={(e) =>
                    setClientDetails({
                      ...clientDetails,
                      mesureFinale: e.target.checked,
                    })
                  }
                  color="primary"
                />
              }
              label="OUI"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={!clientDetails.mesureFinale}
                  onChange={(e) =>
                    setClientDetails({
                      ...clientDetails,
                      mesureFinale: !e.target.checked,
                    })
                  }
                  color="primary"
                />
              }
              label="NON"
            />
          </Box>
          <Box mt={2} textAlign="right">
            <Button
              onClick={handleCloseModal}
              sx={{ marginRight: 1, textTransform: "none" }}
            >
              Cancel
            </Button>
            <PDFDownloadLink
              document={
                <PdfDocument
                  cartItems={cartItems}
                  clientDetails={clientDetails}
                  quotation={generateRandomQuotation()}
                />
              }
              filename="FORM"
            >
              {({ loading }) =>
                loading ? (
                  <Button
                    disabled={
                      !(
                        clientDetails.nomClient &&
                        clientDetails.tel &&
                        clientDetails.email &&
                        (clientDetails.mesureFinale === true ||
                          clientDetails.mesureFinale === false)
                      )
                    }
                    variant="contained"
                    color="primary"
                    // onClick={handleDownloadImages}
                    //sx={{ml:7  }}
                  >
                    loading
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      fontSize: "12px",
                      textTransform: "none",
                    }}
                    disabled={
                      !(
                        clientDetails.nomClient &&
                        clientDetails.tel &&
                        clientDetails.email &&
                        (clientDetails.mesureFinale === true ||
                          clientDetails.mesureFinale === false)
                      )
                    }
                    // onClick={handleDownloadImages}
                    //sx={{ml:7  }}
                  >
                    Download quotation
                  </Button>
                )
              }
            </PDFDownloadLink>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ProductCart;

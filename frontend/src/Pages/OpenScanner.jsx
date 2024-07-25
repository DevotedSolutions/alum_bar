import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import QrReader from "react-qr-scanner";
import { Modal } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getOneProduct,
  sellProduct,
} from "../services/products/getAllProducts";

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
  const [product, setProduct] = useState(null);
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
      const response = await getOneProduct(result?.text);
      if (response?.data?.data) {
        setProduct(response?.data?.data);
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

  const handleSell = async () => {
    const id = scanResultWebCam.text;
    console.log(id);
    const response = await sellProduct(id, quantity);
    if (response.status === 200) {
      handleCloseModal();
      toast.success("Successfully sold Product");
      navigate("/inventory");
      setScanResultWebCam("");
    } else {
      toast.error("An Error Occured in Solding Product");
      handleCloseModal();
    }
  };

  useEffect(() => {
    const handleClickOutsideModal = (event) => {
      if (
        isModalOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        window.location.reload();
        handleCloseModal();
      }
    };

    document.addEventListener("click", handleClickOutsideModal);

    return () => {
      document.removeEventListener("click", handleClickOutsideModal);
    };
  }, [isModalOpen]);

  const cameraFacingMode = isSmallScreen ? "environment" : "user";

  return (
    <div style={containerStyle}>
      <Box sx={boxStyle}>
        <ToastContainer />
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">QR Scanner</Typography>
            {navigator.getUserMedia ? (
              <QrReader
                key={cameraFacingMode}
                constraints={{
                  audio: false,
                  video: { facingMode: cameraFacingMode },
                }}
                delay={300}
                style={{ width: "100%" }}
                onError={handleErrorWebCam}
                onScan={handleScanWebCam}
              />
            ) : (
              <p>http does not support camera</p>
            )}

            <Modal
              open={isModalOpen}
              onClose={handleCloseModal}
              aria-labelledby="child-modal-title"
              aria-describedby="child-modal-description"
            >
              <Box
                ref={modalRef}
                sx={{
                  ...boxStyle,
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: isSmallScreen ? "80%" : "30%", // Adjusted for mobile responsiveness
                }}
              >
                <div>
                  <Typography variant="h6" sx={{ textAlign: "center" }}>
                    Sell Items
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: "center" }}>
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
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      size="small"
                    >
                      <Remove />
                    </IconButton>
                    <input
                      type="text"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      style={{
                        width: "40px",
                        textAlign: "center",
                        margin: "5px",
                      }}
                    />
                    <IconButton
                      onClick={() => setQuantity(quantity + 1)}
                      size="small"
                    >
                      <Add />
                    </IconButton>
                  </div>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSell}
                    style={{ marginTop: "10px", marginLeft: "25px" }}
                  >
                    Confirm Sell
                  </Button>
                </div>
              </Box>
            </Modal>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default OpenScanner;

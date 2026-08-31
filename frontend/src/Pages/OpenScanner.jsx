import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, IconButton, Drawer } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  getOneProduct,
  sellProduct,
} from "../services/products/getAllProducts";
import Html5QrcodePlugin from "../Components/HTML5QRCode";
import "../Utility/scanner.css";
import { COLORS, buttonSx } from "../theme/tokens";

const OpenScanner = () => {
  const modalRef = useRef(null);
  const [isModalOpen, setModalOpen] = useState(false);
  // Tracked for parity with the previous implementation (cleared on
  // close/sell) even though its value isn't rendered anywhere.
  const [, setScanResultWebCam] = useState("");
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  const handleScanWebCam = async (result) => {
    if (result) {
      setScanResultWebCam(result);

      const response = await getOneProduct(result);
      const toadd = response?.data?.data;

      if (toadd) {
        setProducts((prevProducts) => {
          const isexisting = prevProducts.find(
            (product) => product?._id === toadd?._id
          );

          if (isexisting) {
            toast?.info("Product already present in the cart!");
            return prevProducts;
          }

          return [...prevProducts, { ...toadd, quantity: 1 }];
        });
      }

      handleOpenModal();
    }
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    setScanResultWebCam("");
  };

  const printList = () => window.print();

  const handleSell = async () => {
    try {
      for (const product of products) {
        const { quantity } = product;
        const id = product?._id;
        const response = await sellProduct(id, quantity);

        if (response.status !== 200) {
          toast.error(`An error occurred while selling product with id: ${id}`);
        }
      }

      handleCloseModal();
      setProducts([]);
      toast.success("Successfully sold all products");
      navigate("/inventory");
      setScanResultWebCam("");
    } catch (error) {
      toast.error("An error occurred during the sale process");
      handleCloseModal();
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box sx={{ width: "100%", maxWidth: "560px" }}>
        <Box
          sx={{
            background: "#fff",
            border: `1px solid ${COLORS.cardBorder}`,
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(20,26,32,0.05)",
          }}
        >
          <Box
            sx={{
              background: COLORS.tableHeaderBg,
              padding: "15px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>
              Scanner
            </span>
            {products.length > 0 && (
              <IconButton onClick={() => setModalOpen(true)} sx={{ color: "#fff" }}>
                <Box sx={{ position: "relative", display: "flex" }}>
                  <ShoppingCart fontSize="small" />
                  <Box
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      minWidth: 16,
                      height: 16,
                      borderRadius: "8px",
                      background: COLORS.brandRed,
                      color: "#fff",
                      fontSize: "10px",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 3px",
                    }}
                  >
                    {products.length}
                  </Box>
                </Box>
              </IconButton>
            )}
          </Box>

          <Box sx={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {navigator.getUserMedia ? (
              <Box sx={{ width: "100%", maxWidth: "330px" }}>
                <Html5QrcodePlugin
                  fps={10}
                  qrbox={{ width: 175, height: 175 }}
                  disableFlip={false}
                  qrCodeSuccessCallback={handleScanWebCam}
                />
              </Box>
            ) : (
              <Box sx={{ color: COLORS.textFaint, fontSize: "14px" }}>
                http does not support camera
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Drawer open={isModalOpen} onClose={handleCloseModal} anchor="right">
        <Box sx={{ minWidth: "340px", maxWidth: "400px", height: "100%", display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              background: COLORS.tableHeaderBg,
              padding: "15px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ color: "#fff", fontSize: 15, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Sell cart
            </span>
            <Box
              onClick={handleCloseModal}
              sx={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", color: "#C7CBD1", cursor: "pointer", "&:hover": { background: "rgba(255,255,255,0.1)", color: "#fff" } }}
            >
              ✕
            </Box>
          </Box>

          <Box className="printable-content" ref={modalRef} sx={{ flex: 1, overflow: "auto" }}>
            {products.length === 0 ? (
              <Box sx={{ padding: "40px 20px", textAlign: "center", color: COLORS.textFaint, fontSize: "13.5px" }}>
                No product scanned yet.
              </Box>
            ) : (
              [...products].map((product, index) => (
                <Box
                  key={product._id || index}
                  className="product-item"
                  sx={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 20px", borderBottom: `1px solid ${COLORS.rowBorder}` }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ fontSize: "13px", fontWeight: 700, color: COLORS.textPrimary }}>
                      {product?.productDescription}
                    </Box>
                    <Box sx={{ fontSize: "11.5px", color: COLORS.textFaint, marginTop: "2px" }}>
                      {product?.productcode}
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", border: `1px solid ${COLORS.inputBorder}`, borderRadius: "6px", overflow: "hidden" }}>
                    <Box
                      onClick={() =>
                        setProducts((prevProducts) => {
                          let newProduct = { ...product, quantity: Math.max(0, product?.quantity - 1) };
                          return newProduct?.quantity === 0
                            ? prevProducts?.filter((p) => p?._id !== newProduct?._id)
                            : prevProducts.map((p, i1) => (index === i1 ? newProduct : p));
                        })
                      }
                      sx={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#3A4150", cursor: "pointer", userSelect: "none", "&:hover": { background: "#F1F3F5" } }}
                    >
                      −
                    </Box>
                    <input
                      type="text"
                      value={product?.quantity}
                      onChange={(e) => {
                        const quantity = Math.max(1, parseInt(e.target.value) || 1);
                        setProducts((prevProducts) =>
                          prevProducts.map((p, i1) => (index === i1 ? { ...p, quantity } : p))
                        );
                      }}
                      style={{ width: 34, textAlign: "center", fontSize: 13, fontWeight: 700, color: COLORS.textPrimary, border: "none", outline: "none" }}
                    />
                    <Box
                      onClick={() =>
                        setProducts((prevProducts) =>
                          prevProducts.map((p, i1) => (index === i1 ? { ...p, quantity: p?.quantity + 1 } : p))
                        )
                      }
                      sx={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#3A4150", cursor: "pointer", userSelect: "none", "&:hover": { background: "#F1F3F5" } }}
                    >
                      +
                    </Box>
                  </Box>
                </Box>
              ))
            )}
          </Box>

          <Box sx={{ display: "flex", gap: "10px", padding: "16px 20px", borderTop: `1px solid ${COLORS.rowBorder}`, background: "#FAFBFC" }}>
            <Button sx={buttonSx.neutral("44px")} onClick={printList}>Print</Button>
            <Button sx={{ ...buttonSx.primary("44px"), flex: 1 }} onClick={handleSell} disabled={products.length === 0}>
              Confirm Sell
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default OpenScanner;

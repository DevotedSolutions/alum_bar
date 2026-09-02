import React, { useState, useEffect } from "react";
import { Box, Button, Modal } from "@mui/material";
import {
  getAllProducts,
  sortProducts,
  getQrcode,
} from "../services/products/getAllProducts";
import { toast } from "react-toastify";
import { UpdateQuantity } from "../services/products/updateQuantity";
import ExportOptions from "../Components/ExportOptions";
import { COLORS, badgeStyle, productStockBand, buttonSx, inputSx as inputSxBase } from "../theme/tokens";

const colorDot = (productColor) => {
  const c = (productColor || "").toUpperCase();
  if (c === "BLANC") return { bg: "#fff", border: "1px solid #C7CBD1" };
  if (c === "NOIR") return { bg: "#2B303A", border: "1px solid #2B303A" };
  if (c === "AS") return { bg: "#9AA1A9", border: "1px solid #9AA1A9" };
  return { bg: COLORS.headerTeal, border: `1px solid ${COLORS.headerTeal}` };
};

const inputSx = { ...inputSxBase, width: "290px" };
const primaryBtnSx = buttonSx.primary();
const outlineBtnSx = buttonSx.outline();
const neutralBtnSx = buttonSx.neutral();

const InventoryPage = () => {
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [loading, setLoading] = useState(false);

  // Inline quantity editing
  const [qtyEditId, setQtyEditId] = useState(null);
  const [qtyEditValue, setQtyEditValue] = useState(0);

  // Sell QR modal
  const [openSell, setOpenSell] = useState(false);
  const [qrCodeUrlSell, setQRCodeUrlSell] = useState("");
  const [sellQrItem, setSellQrItem] = useState(null);

  async function getData() {
    try {
      setLoading(true);
      const resp = await getAllProducts();
      setLoading(false);
      if (resp.status === 200) {
        setData(sortProducts(resp.data.getdata));
      } else {
        toast.error(resp.data.message);
      }
    } catch (error) {
      toast.error("Check network connection");
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const openQtyEdit = (item) => {
    setQtyEditId(item._id);
    setQtyEditValue(item.quantity);
  };
  const closeQtyEdit = () => setQtyEditId(null);
  const decQty = () => setQtyEditValue((v) => Math.max(0, (Number(v) || 0) - 1));
  const incQty = () => setQtyEditValue((v) => (Number(v) || 0) + 1);
  const onQtyInputChange = (e) =>
    setQtyEditValue(Math.max(0, parseInt(e.target.value, 10) || 0));

  const submitQtyEdit = async (item) => {
    const delta = Number(qtyEditValue) - Number(item.quantity);
    if (delta === 0) {
      closeQtyEdit();
      return;
    }
    try {
      const response = await UpdateQuantity(item._id, { newQuantity: delta });
      if (response.status === 200) {
        toast.success(response.data.message || "Quantity updated");
        closeQtyEdit();
        getData();
      } else {
        toast.error("Failed to update quantity");
      }
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleOpenSellModal = async (item) => {
    setSellQrItem(item);
    setOpenSell(true);
    try {
      const response = await getQrcode(item._id);
      if (response.status === 200) {
        setQRCodeUrlSell(response.data.qrCodeUrl);
      } else {
        toast.error("Failed to generate QR code");
      }
    } catch (error) {
      toast.error("Failed to generate QR code");
    }
  };
  const handleCloseSellModal = () => {
    setOpenSell(false);
    setQRCodeUrlSell("");
    setSellQrItem(null);
  };

  const q = searchData.trim().toLowerCase();
  const filtered = data.filter((item) => {
    const productName = (item.productName || "").toLowerCase();
    const productDescription = (item.productDescription || "").toLowerCase();
    const productcode = (item.productcode || "").toLowerCase();
    return (
      !q ||
      productName.includes(q) ||
      productDescription.includes(q) ||
      productcode.includes(q)
    );
  });

  return (
    <Box>
      {/* Search + export toolbar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "14px" }}>
        <input
          placeholder="Search products..."
          value={searchData}
          onChange={(e) => setSearchData(e.target.value)}
          style={inputSx}
        />
        <Button sx={primaryBtnSx}>Search</Button>
        <ExportOptions data={data} />
      </Box>

      <Box sx={{ fontSize: "14px", fontWeight: 600, color: "#3A4150", marginBottom: "12px" }}>
        {filtered.length} products
      </Box>

      {loading ? (
        <Box sx={{ padding: "48px", textAlign: "center", color: COLORS.textFaint, fontSize: "14px" }}>
          Loading...
        </Box>
      ) : (
        <Box
          sx={{
            background: "#fff",
            border: `1px solid ${COLORS.cardBorder}`,
            borderRadius: "8px",
            overflowX: "auto",
            boxShadow: "0 1px 3px rgba(20,26,32,0.05)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: COLORS.tableHeaderBg }}>
                {["Image", "Product name", "Product description", "Product code", "Quantity", "Action"].map(
                  (h, i) => (
                    <th
                      key={h}
                      style={{
                        padding: "16px 18px",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: 700,
                        letterSpacing: "0.07em",
                        textTransform: "uppercase",
                        textAlign: "center",
                        borderRight: i < 5 ? "1px solid rgba(255,255,255,0.12)" : "none",
                        width: h === "Image" ? 110 : h === "Product code" ? 170 : h === "Quantity" ? 150 : h === "Action" ? 330 : undefined,
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "48px", textAlign: "center", color: COLORS.textFaint, fontSize: "14px" }}>
                    No product matches &ldquo;{searchData}&rdquo;
                  </td>
                </tr>
              ) : (
                filtered.map((item, index) => {
                  const showGroupHeader =
                    index === 0 || item.productCategory !== filtered[index - 1].productCategory;
                  const groupCount = filtered.filter((p) => p.productCategory === item.productCategory).length;
                  const band = productStockBand(item.quantity, item);
                  const dot = colorDot(item.productColor);
                  const editing = qtyEditId === item._id;

                  return (
                    <React.Fragment key={item._id}>
                      {showGroupHeader && (
                        <tr>
                          <td colSpan={6} style={{ padding: 0, borderBottom: `1px solid ${COLORS.cardBorder}` }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: "14px", background: COLORS.groupRowBg, padding: "13px 18px" }}>
                              <span style={{ width: 4, height: 18, background: COLORS.headerTeal, borderRadius: 2 }} />
                              <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: COLORS.groupRowFg }}>
                                {item.productCategory}
                              </span>
                              <span style={{ fontSize: 12.5, color: COLORS.textFaint }}>{groupCount} items</span>
                            </Box>
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td style={{ padding: "10px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, textAlign: "center" }}>
                          <img
                            src={`https://app.noutfermeture.com/api/${item.image}`}
                            alt={item.productName}
                            style={{ width: 66, height: 44, objectFit: "contain", mixBlendMode: "multiply" }}
                          />
                        </td>
                        <td style={{ padding: "10px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, fontSize: 14, fontWeight: 700, color: COLORS.textPrimary }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span
                              title={item.productColor}
                              style={{ width: 10, height: 10, minWidth: 10, borderRadius: "50%", background: dot.bg, border: dot.border }}
                            />
                            {item.productName}
                          </Box>
                        </td>
                        <td style={{ padding: "10px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, fontSize: 14, color: COLORS.textSecondary }}>
                          {item.productDescription}
                        </td>
                        <td style={{ padding: "10px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, textAlign: "center" }}>
                          <span style={{ display: "inline-block", background: COLORS.neutralChipBg, color: COLORS.neutralChipFg, fontSize: 13, padding: "6px 14px", borderRadius: 5 }}>
                            {item.productcode}
                          </span>
                        </td>
                        <td style={{ padding: "10px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, textAlign: "center" }}>
                          <span style={badgeStyle(band)}>{item.quantity}</span>
                        </td>
                        <td style={{ padding: "10px 18px", borderBottom: `1px solid ${COLORS.rowBorder}` }}>
                          {editing ? (
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                              <Box sx={{ display: "flex", alignItems: "center", border: `1px solid ${COLORS.inputBorder}`, borderRadius: "6px", overflow: "hidden", background: "#fff" }}>
                                <Box
                                  onClick={decQty}
                                  sx={{ width: 38, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#3A4150", cursor: "pointer", userSelect: "none", "&:hover": { background: "#F1F3F5" } }}
                                >
                                  −
                                </Box>
                                <input
                                  type="number"
                                  value={qtyEditValue}
                                  onChange={onQtyInputChange}
                                  style={{ width: 56, height: 36, border: "none", borderLeft: `1px solid ${COLORS.cardBorder}`, borderRight: `1px solid ${COLORS.cardBorder}`, textAlign: "center", fontSize: 14, fontWeight: 700, color: COLORS.textPrimary, outline: "none" }}
                                />
                                <Box
                                  onClick={incQty}
                                  sx={{ width: 38, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#3A4150", cursor: "pointer", userSelect: "none", "&:hover": { background: "#F1F3F5" } }}
                                >
                                  +
                                </Box>
                              </Box>
                              <Button sx={{ ...primaryBtnSx, height: "36px", padding: "0 16px", fontSize: "13px" }} onClick={() => submitQtyEdit(item)}>
                                Done
                              </Button>
                            </Box>
                          ) : (
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                              <Button sx={outlineBtnSx} onClick={() => openQtyEdit(item)}>
                                + / - Quantity
                              </Button>
                              <Button sx={neutralBtnSx} onClick={() => handleOpenSellModal(item)}>
                                Generate Sell QR Code
                              </Button>
                            </Box>
                          )}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </Box>
      )}

      {/* Sell QR modal */}
      <Modal open={openSell} onClose={handleCloseSellModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            borderRadius: "8px",
            width: 400,
            maxWidth: "92vw",
            boxShadow: "0 26px 60px rgba(0,0,0,0.3)",
            overflow: "hidden",
          }}
        >
          <Box sx={{ background: COLORS.tableHeaderBg, padding: "15px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "#fff", fontSize: 15, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Sell QR code
            </span>
          </Box>
          <Box sx={{ padding: "22px", textAlign: "center" }}>
            {sellQrItem && (
              <>
                <Box sx={{ fontSize: "15px", fontWeight: 700, color: COLORS.textPrimary }}>{sellQrItem.productName}</Box>
                <Box sx={{ fontSize: "13px", color: COLORS.textMuted, marginTop: "4px" }}>
                  {sellQrItem.productDescription} · {sellQrItem.productcode}
                </Box>
              </>
            )}
            <Box sx={{ margin: "18px auto 0", width: 190, minHeight: 190, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {qrCodeUrlSell ? (
                <img src={qrCodeUrlSell} alt="QR Code" style={{ width: "100%" }} />
              ) : (
                <Box sx={{ color: COLORS.textFaint, fontSize: "13px" }}>Generating…</Box>
              )}
            </Box>
            <Box sx={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <Button sx={{ ...neutralBtnSx, flex: 1, height: "44px" }} onClick={handleCloseSellModal}>
                Close
              </Button>
              {qrCodeUrlSell && (
                <Button sx={{ ...primaryBtnSx, flex: 1 }} href={qrCodeUrlSell} download="qrcode.png" component="a">
                  Download
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default InventoryPage;

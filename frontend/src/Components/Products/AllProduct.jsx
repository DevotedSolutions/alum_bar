import React, { useState, useEffect } from "react";
import { Button, Box, Modal } from "@mui/material";
import { deleteProducts } from "../../services/products/deleteProduct";
import { getAllProducts } from "../../services/products/getAllProducts";
import { toast } from "react-toastify";
import { addProducts } from "../../services/products/addProducts";
import { sortProducts } from "../../services/products/getAllProducts";

import { UpdateProducts } from "../../services/products/UpdateProduct";
import {
  cermoneData,
  vitrageData,
  categoryData,
  colorData,
} from "../../Utility/data";
import { COLORS, buttonSx, badgeStyle, stockBand } from "../../theme/tokens";
import { AddIcon } from "../common/navIcons";
import ConfirmDialog from "../common/ConfirmDialog";

const fieldLabelSx = {
  fontSize: "11.5px",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: COLORS.textMuted,
  marginBottom: "6px",
};

const fieldInputStyle = {
  width: "100%",
  boxSizing: "border-box",
  height: "42px",
  border: `1px solid ${COLORS.inputBorder}`,
  borderRadius: "6px",
  padding: "0 13px",
  fontSize: "14px",
  color: COLORS.textPrimary,
  outline: "none",
};

const fieldSelectStyle = { ...fieldInputStyle, padding: "0 11px", background: "#fff", cursor: "pointer" };

const Field = ({ label, children }) => (
  <Box>
    <Box sx={fieldLabelSx}>{label}</Box>
    {children}
  </Box>
);

const AllProducts = () => {
  const [Data, setData] = useState(null);
  const [image, setImage] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [modalData, setModalData] = useState({});
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [showImg, setShowImg] = useState({});
  const [showModalImg, setShowModalImg] = useState({});
  const [loading, setLoading] = useState(true);

  // Products screen search + category filter (frontend-only, over already-fetched data)
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All categories");

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [AddData, setAddData] = useState({
    productName: "",
    productDescription: "",
    quantity: "",
    productcode: "",
    productCermone: "",
    productVitrage: "",
    price: "",
  });

  const [modalFormdata, setModalFormData] = useState({});
  const cermone = cermoneData;
  const vitrage = vitrageData;

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      const imagePreviewURL = URL.createObjectURL(selectedImage);
      setShowImg({ imagePreview: imagePreviewURL });
    } else {
      setAddData({ ...AddData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", AddData.productName);
    formData.append("productDescription", AddData.productDescription);
    formData.append("quantity", AddData.quantity);
    formData.append("productcode", AddData.productcode);
    formData.append("price", AddData.price);
    formData.append("productCermone", AddData.productCermone);
    formData.append("productVitrage", AddData.productVitrage);
    formData.append("productColor", AddData.productColor);
    formData.append("productCategory", AddData.productCategory);
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
          productcermone: "",
          productVitrage: "",
          price: "",
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

  const handleOpenAdd = () => setAddModalOpen(true);
  const handleCloseAdd = () => setAddModalOpen(false);

  async function getAllData() {
    let resp = await getAllProducts();
    if (resp) {
      if (resp.status === 200) {
        const sortedProduct = sortProducts(resp.data.getdata);
        setData(sortedProduct);
        setLoading(false);
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

  const askDelete = (item) => setDeleteTarget(item);
  const cancelDelete = () => setDeleteTarget(null);
  const confirmDelete = () => {
    if (deleteTarget) DeleteProduct(deleteTarget._id);
    setDeleteTarget(null);
  };

  const handleModalChange = (e) => {
    if (e.target.name === "image") {
      const selectedImage = e.target.files[0];
      setModalImage(e.target.files[0]);
      if (selectedImage) {
        const imgPreviewURL = URL.createObjectURL(selectedImage);
        setShowModalImg({ imagePreview: imgPreviewURL });
      } else {
        setShowModalImg({
          imagePreview: `https://app.noutfermeture.com/api/${modalData.image}`,
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
      productCermone: data.productCermone,
      productVitrage: data.productVitrage,
      price: data.price,
      productCategory: data.productCategory,
      productColor: data.productColor,
    });
    if (data.image) {
      setShowModalImg({
        imagePreview: `https://app.noutfermeture.com/api/${data.image}`,
      });
      setModalImage(data.image);
    } else {
      setShowModalImg({});
    }
  };

  const handleCloseUpdate = () => setOpen(false);

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", modalFormdata.productName);
    formData.append("productDescription", modalFormdata.productDescription);
    formData.append("quantity", modalFormdata.quantity);
    formData.append("productcode", modalFormdata.productcode);
    formData.append("productColor", modalFormdata.productColor);
    formData.append("productCategory", modalFormdata.productCategory);
    formData.append("price", modalFormdata.price);
    formData.append("productCermone", modalFormdata.productCermone);
    formData.append("productVitrage", modalFormdata.productVitrage);

    if (modalImage) {
      formData.append("image", modalImage);
    } else {
      formData.append("image", modalData.image);
    }

    try {
      const resp = await UpdateProducts(modalData._id, formData, {
        headers: { "Content-Type": "multipart/form-data" },
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

  // ---- filtering + grouping for display ----
  const q = search.trim().toLowerCase();
  const filtered = (Data || []).filter((p) => {
    const matchesSearch =
      !q ||
      [p.productName, p.productDescription, p.productcode].some((v) =>
        (v || "").toLowerCase().includes(q)
      );
    const matchesCat = catFilter === "All categories" || p.productCategory === catFilter;
    return matchesSearch && matchesCat;
  });

  const groups = [];
  const groupIndex = {};
  filtered.forEach((item) => {
    const cat = item.productCategory || "Uncategorized";
    if (!(cat in groupIndex)) {
      groupIndex[cat] = groups.length;
      groups.push({ label: cat, items: [] });
    }
    groups[groupIndex[cat]].items.push(item);
  });

  const modalHeader = (title, subtitle, onClose) => (
    <Box sx={{ background: COLORS.tableHeaderBg, padding: "16px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Box>
        <Box sx={{ color: "#fff", fontSize: "16px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {title}
        </Box>
        {subtitle && (
          <Box sx={{ color: "#9AA1A9", fontSize: "12.5px", marginTop: "3px" }}>{subtitle}</Box>
        )}
      </Box>
      <Box
        onClick={onClose}
        sx={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", color: "#C7CBD1", cursor: "pointer", "&:hover": { background: "rgba(255,255,255,0.1)", color: "#fff" } }}
      >
        ✕
      </Box>
    </Box>
  );

  return (
    <Box>
      {/* Toolbar */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginBottom: "16px" }}>
        <Button
          onClick={handleOpenAdd}
          sx={{ ...buttonSx.primary(), display: "flex", alignItems: "center", gap: "10px", fontWeight: 700, letterSpacing: "0.04em" }}
        >
          <AddIcon size={17} />
          ADD PRODUCT
        </Button>
        <Box sx={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px", background: "#fff", border: `1px solid ${COLORS.inputBorder}`, borderRadius: "6px", height: "44px", padding: "0 14px", width: "270px", boxSizing: "border-box" }}>
            <input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: "none", outline: "none", fontSize: "14px", flex: 1, minWidth: 0, color: COLORS.textPrimary, background: "transparent" }}
            />
          </Box>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            style={{ height: "44px", border: `1px solid ${COLORS.inputBorder}`, borderRadius: "6px", background: "#fff", fontSize: "14px", color: COLORS.textPrimary, padding: "0 14px", width: "200px", cursor: "pointer" }}
          >
            <option value="All categories">All categories</option>
            {categoryData.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Box>
      </Box>

      {/* Product groups */}
      {!loading && groups.length === 0 && (
        <Box sx={{ background: "#fff", border: `1px solid ${COLORS.cardBorder}`, borderRadius: "8px", padding: "52px", textAlign: "center", color: COLORS.textFaint, fontSize: "14px" }}>
          No product matches this search.
        </Box>
      )}

      {groups.map((g) => (
        <Box key={g.label} sx={{ background: "#fff", border: `1px solid ${COLORS.cardBorder}`, borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 3px rgba(20,26,32,0.05)", marginBottom: "20px" }}>
          <Box sx={{ background: COLORS.tableHeaderBg, padding: "15px 22px", display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ color: "#fff", fontSize: 15, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>{g.label}</span>
            <span style={{ color: "#9AA1A9", fontSize: 12.5 }}>{g.items.length} products</span>
          </Box>
          <Box sx={{ padding: "18px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(206px, 1fr))", gap: "16px" }}>
            {g.items.map((item) => {
              const band = stockBand(item.quantity);
              return (
                <Box
                  key={item._id}
                  sx={{
                    border: `1px solid ${COLORS.cardBorder}`,
                    borderRadius: "8px",
                    padding: "13px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "9px",
                    background: "#fff",
                    "&:hover": { borderColor: COLORS.accentTealBorder, boxShadow: "0 3px 10px rgba(20,26,32,0.07)" },
                  }}
                >
                  <Box sx={{ position: "relative", background: "#F7F8F9", borderRadius: "6px", height: "96px", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px" }}>
                    <img
                      src={`https://app.noutfermeture.com/api/${item.image}`}
                      alt={item.productName}
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", mixBlendMode: "multiply" }}
                    />
                    <span style={{ position: "absolute", top: 7, right: 9, color: COLORS.headerTeal, fontSize: 13, fontWeight: 700 }}>
                      ${item.price}
                    </span>
                  </Box>
                  <Box sx={{ fontSize: "13.5px", fontWeight: 700, color: COLORS.textPrimary, lineHeight: 1.3 }}>
                    {item.productName}
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: 11.5, color: COLORS.textFaint }}>Description</span>
                    <span style={{ fontSize: 12.5, color: COLORS.textSecondary }}>{item.productDescription}</span>
                    <span style={{ fontSize: 12.5, color: COLORS.textSecondary }}>{item.productcode}</span>
                    <span style={{ fontSize: 12.5, color: COLORS.textSecondary, textTransform: "uppercase" }}>{item.productCategory}</span>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: 12.5, color: COLORS.textSecondary }}>Quantity</span>
                    <span style={badgeStyle(band)}>{item.quantity}</span>
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9px", marginTop: "2px" }}>
                    <Button sx={buttonSx.outline("34px")} onClick={() => handleOpenUpdate(item)}>Edit</Button>
                    <Button sx={buttonSx.danger()} onClick={() => askDelete(item)}>Delete</Button>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      ))}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete product"
        message={
          deleteTarget
            ? `${deleteTarget.productName} (${deleteTarget.productDescription}) will be removed from the catalogue and from inventory.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Keep it"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {/* Add product modal */}
      <Modal open={addModalOpen} onClose={handleCloseAdd}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "#fff", borderRadius: "8px", width: 840, maxWidth: "94vw", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 26px 60px rgba(0,0,0,0.3)" }}>
          {modalHeader("Add product", "New entry in the catalogue", handleCloseAdd)}
          <form onSubmit={handleSubmit}>
            <Box sx={{ padding: "22px", display: "grid", gridTemplateColumns: "210px minmax(0,1fr)", gap: "24px" }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Box sx={fieldLabelSx}>Product image</Box>
                <Box sx={{ width: 210, height: 150, border: `1px solid ${COLORS.cardBorder}`, borderRadius: "6px", background: "#F7F8F9", display: "flex", alignItems: "center", justifyContent: "center", padding: "14px", boxSizing: "border-box" }}>
                  {showImg.imagePreview ? (
                    <img src={showImg.imagePreview} alt="Preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                  ) : (
                    <Box sx={{ color: COLORS.textFaint, fontSize: "12.5px", textAlign: "center" }}>No image yet</Box>
                  )}
                </Box>
                <input type="file" name="image" onChange={handleChange} required />
                <Box sx={{ fontSize: "11.5px", color: COLORS.textFaint, lineHeight: 1.5 }}>
                  PNG or JPG on a white background, 600px wide or more.
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <Field label="Product name">
                    <input name="productName" value={AddData.productName} onChange={handleChange} style={fieldInputStyle} />
                  </Field>
                  <Field label="Product code">
                    <input name="productcode" value={AddData.productcode} onChange={handleChange} style={fieldInputStyle} />
                  </Field>
                  <Field label="Category">
                    <select name="productCategory" value={AddData.productCategory || ""} onChange={handleChange} style={fieldSelectStyle}>
                      <option value="" disabled>Select category</option>
                      {categoryData.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Color">
                    <select name="productColor" value={AddData.productColor || ""} onChange={handleChange} style={fieldSelectStyle}>
                      <option value="" disabled>Select color</option>
                      {colorData.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Cermone">
                    <select name="productCermone" value={AddData.productCermone || ""} onChange={handleChange} style={fieldSelectStyle}>
                      <option value="" disabled>Select cermone</option>
                      {cermone.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Vitrage">
                    <select name="productVitrage" value={AddData.productVitrage || ""} onChange={handleChange} style={fieldSelectStyle}>
                      <option value="" disabled>Select vitrage</option>
                      {vitrage.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Unit price $">
                    <input type="number" name="price" value={AddData.price} onChange={handleChange} style={fieldInputStyle} />
                  </Field>
                  <Field label="Quantity in stock">
                    <input type="number" name="quantity" value={AddData.quantity} onChange={handleChange} style={fieldInputStyle} />
                  </Field>
                  <Box sx={{ gridColumn: "span 2" }}>
                    <Field label="Description">
                      <textarea name="productDescription" value={AddData.productDescription} onChange={handleChange} rows={3} style={{ ...fieldInputStyle, height: "auto", padding: "11px 13px", resize: "vertical" }} />
                    </Field>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 22px", borderTop: `1px solid ${COLORS.rowBorder}`, background: "#FAFBFC" }}>
              <Box sx={{ flex: 1 }} />
              <Button sx={buttonSx.neutral("44px")} onClick={handleCloseAdd}>Cancel</Button>
              <Button type="submit" sx={{ ...buttonSx.primary(), fontWeight: 700 }}>ADD PRODUCT</Button>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* Update product modal */}
      <Modal open={open} onClose={handleCloseUpdate}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "#fff", borderRadius: "8px", width: 840, maxWidth: "94vw", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 26px 60px rgba(0,0,0,0.3)" }}>
          {modalHeader("Edit product", modalData.productcode ? `${modalData.productcode} · ${modalData.productCategory || ""}` : "", handleCloseUpdate)}
          <form onSubmit={handleModalSubmit}>
            <Box sx={{ padding: "22px", display: "grid", gridTemplateColumns: "210px minmax(0,1fr)", gap: "24px" }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Box sx={fieldLabelSx}>Product image</Box>
                <Box sx={{ width: 210, height: 150, border: `1px solid ${COLORS.cardBorder}`, borderRadius: "6px", background: "#F7F8F9", display: "flex", alignItems: "center", justifyContent: "center", padding: "14px", boxSizing: "border-box" }}>
                  {showModalImg.imagePreview ? (
                    <img src={showModalImg.imagePreview} alt="Preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                  ) : (
                    <Box sx={{ color: COLORS.textFaint, fontSize: "12.5px", textAlign: "center" }}>No image</Box>
                  )}
                </Box>
                <input type="file" name="image" onChange={handleModalChange} />
                <Box sx={{ fontSize: "11.5px", color: COLORS.textFaint, lineHeight: 1.5 }}>
                  PNG or JPG on a white background, 600px wide or more.
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <Field label="Product name">
                    <input name="productName" value={modalFormdata.productName || ""} onChange={handleModalChange} style={fieldInputStyle} />
                  </Field>
                  <Field label="Product code">
                    <input name="productcode" value={modalFormdata.productcode || ""} onChange={handleModalChange} style={fieldInputStyle} />
                  </Field>
                  <Field label="Category">
                    <select name="productCategory" value={modalFormdata.productCategory || ""} onChange={handleModalChange} style={fieldSelectStyle}>
                      {categoryData.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Color">
                    <select name="productColor" value={modalFormdata.productColor || ""} onChange={handleModalChange} style={fieldSelectStyle}>
                      {colorData.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Cermone">
                    <select name="productCermone" value={modalFormdata.productCermone || ""} onChange={handleModalChange} style={fieldSelectStyle}>
                      {cermone.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Vitrage">
                    <select name="productVitrage" value={modalFormdata.productVitrage || ""} onChange={handleModalChange} style={fieldSelectStyle}>
                      {vitrage.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Price">
                    <input type="number" name="price" value={modalFormdata.price || ""} onChange={handleModalChange} style={fieldInputStyle} />
                  </Field>
                  <Field label="Quantity">
                    <input type="number" name="quantity" value={modalFormdata.quantity || ""} onChange={handleModalChange} style={fieldInputStyle} />
                  </Field>
                  <Box sx={{ gridColumn: "span 2" }}>
                    <Field label="Description">
                      <textarea name="productDescription" value={modalFormdata.productDescription || ""} onChange={handleModalChange} rows={3} style={{ ...fieldInputStyle, height: "auto", padding: "11px 13px", resize: "vertical" }} />
                    </Field>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 22px", borderTop: `1px solid ${COLORS.rowBorder}`, background: "#FAFBFC" }}>
              <Button
                sx={buttonSx.danger("44px")}
                onClick={() => {
                  handleCloseUpdate();
                  askDelete(modalData);
                }}
              >
                Delete product
              </Button>
              <Box sx={{ flex: 1 }} />
              <Button sx={buttonSx.neutral("44px")} onClick={handleCloseUpdate}>Cancel</Button>
              <Button type="submit" sx={{ ...buttonSx.primary(), fontWeight: 700 }}>SAVE CHANGES</Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default AllProducts;

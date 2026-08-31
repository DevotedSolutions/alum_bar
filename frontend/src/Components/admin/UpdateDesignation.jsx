import {
  Modal,
  Box,
  Grid,
  FormControl,
  TextField,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState, useEffect } from "react";
import PriceDeltaRow from "./PriceDeltaRow";
import { toast } from "react-toastify";
import { updateDesignation } from "../../services/designation/updateDesignation";
import { deleteDesignation } from "../../services/designation/deleteDesignation";
import Papa from "papaparse";
import { COLORS, buttonSx } from "../../theme/tokens";
import {
  Field,
  ModalHeader,
  fieldInputStyle,
  fieldSelectStyle,
  modalShellSx,
  modalFooterSx,
} from "../common/ModalKit";

const UpdateDesignation = ({ isOpen, onClose, selectedProduct, isUpdate }) => {
  const [formData, setFormData] = useState({
    image: selectedProduct?.image ? selectedProduct?.image : "",
    designation: selectedProduct ? selectedProduct?.designation : "",
    vitrage: selectedProduct ? selectedProduct?.vitrage : "",
    cermone: selectedProduct ? selectedProduct?.cermone : "",
    priceList: selectedProduct
      ? [...selectedProduct?.priceList].sort((a, b) =>
          a.width === b.width ? a.height - b.height : a.width - b.width,
        )
      : [],
    category: selectedProduct ? selectedProduct?.category : "",
  });
  const [modalImage, setModalImage] = useState(null);
  const [discount, setDiscount] = useState({
    mru: 0,
    may: 0,
    reu: 0,
    others: 0,
  });
  const [id, setId] = useState(selectedProduct ? selectedProduct?._id : "");
  const [showImg, setShowImg] = useState(
    selectedProduct?.image
      ? `https://app.noutfermeture.com/api/${selectedProduct?.image}`
      : `/assets/images/default-img.png`,
  );

  // Euro-conversion tool: converts the current MRU reference price to Euro,
  // then bumps MAY/REU/Others each by their own %. Does NOT touch MRU itself
  // — MRU only moves via "MRU Direct Increase %" below.
  const [priceFactor, setPriceFactor] = useState({
    euro: 45,
    may: 0,
    reu: 0,
    others: 0,
  });

  useEffect(() => {
    if (selectedProduct?.priceFactor) {
      setPriceFactor({
        euro: selectedProduct.priceFactor.euro ?? 45,
        may: selectedProduct.priceFactor.may ?? 0,
        reu: selectedProduct.priceFactor.reu ?? 0,
        others: selectedProduct.priceFactor.others ?? 0,
      });
    } else {
      setPriceFactor({ euro: 45, may: 0, reu: 0, others: 0 });
    }
  }, [selectedProduct?._id]);

  const applyPercentage = () => {
    if (formData.priceList?.length > 0) {
      const updatedPriceList = formData.priceList.map((priceEntry) => {
        if (!priceEntry?.isSelected) return priceEntry;

        // reference is the fixed pre-increase MRU price — never the
        // already-bumped price_local — so re-applying the same % is idempotent
        const referencePrice = Number(
          priceEntry.price_old || priceEntry.price_local,
        );
        const euroPrice = referencePrice / Number(priceFactor.euro);

        return {
          ...priceEntry,
          price_old: priceEntry.price_old || referencePrice,
          price_default_old: priceEntry.price_default_old || priceEntry.price,
          price_may_old: priceEntry.price_may_old || priceEntry.price_may,
          price_reu_old: priceEntry.price_reu_old || priceEntry.price_reu,
          // price_local intentionally untouched by this Apply
          price: Math.round(euroPrice * (1 + Number(priceFactor.others) / 100)),
          price_may: Math.round(euroPrice * (1 + Number(priceFactor.may) / 100)),
          price_reu: Math.round(euroPrice * (1 + Number(priceFactor.reu) / 100)),
        };
      });

      setFormData({
        ...formData,
        priceList: updatedPriceList.sort((a, b) =>
          a.width === b.width ? a.height - b.height : a.width - b.width,
        ),
      });
    }
  };

  // Independent per-country increase — each applies directly to that one
  // country's own previous price (own reference, direct %, idempotent capture
  // of the pre-increase value on first Apply); none of these touch each other.
  const [directPercent, setDirectPercent] = useState({
    mru: 0,
    may: 0,
    reu: 0,
    others: 0,
  });

  const applyDirectPercentage = () => {
    if (formData.priceList?.length > 0) {
      const updatedPriceList = formData.priceList.map((priceEntry) => {
        if (!priceEntry?.isSelected) return priceEntry;

        const mruReference = Number(
          priceEntry.price_old || priceEntry.price_local,
        );
        const mayReference = Number(
          priceEntry.price_may_old || priceEntry.price_may,
        );
        const reuReference = Number(
          priceEntry.price_reu_old || priceEntry.price_reu,
        );
        const priceReference = Number(
          priceEntry.price_default_old || priceEntry.price,
        );

        return {
          ...priceEntry,
          price_old: priceEntry.price_old || mruReference,
          price_may_old: priceEntry.price_may_old || mayReference,
          price_reu_old: priceEntry.price_reu_old || reuReference,
          price_default_old: priceEntry.price_default_old || priceReference,
          price_local: Math.round(
            mruReference * (1 + Number(directPercent.mru) / 100),
          ),
          price_may: Math.round(
            mayReference * (1 + Number(directPercent.may) / 100),
          ),
          price_reu: Math.round(
            reuReference * (1 + Number(directPercent.reu) / 100),
          ),
          price: Math.round(
            priceReference * (1 + Number(directPercent.others) / 100),
          ),
        };
      });

      setFormData({
        ...formData,
        priceList: updatedPriceList.sort((a, b) =>
          a.width === b.width ? a.height - b.height : a.width - b.width,
        ),
      });
    }
  };

  const applyDiscount = () => {
    if (formData.priceList?.length > 0) {
      const updatedPriceList = formData.priceList.map((priceEntry) => {
        return {
          ...priceEntry,
          price_local: priceEntry?.isSelected
            ? Math.round(
                priceEntry?.price_local * (1 - Number(discount.mru) / 100),
              )
            : priceEntry.price_local,
          price: priceEntry?.isSelected
            ? Math.round(priceEntry.price * (1 - Number(discount.others) / 100))
            : priceEntry.price,
          price_may: priceEntry?.isSelected
            ? Math.round(
                priceEntry.price_may * (1 - Number(discount.may) / 100),
              )
            : priceEntry.price_may,
          price_reu: priceEntry?.isSelected
            ? Math.round(
                priceEntry.price_reu * (1 - Number(discount.reu) / 100),
              )
            : priceEntry.price_reu,
        };
      });

      setFormData({
        ...formData,
        priceList: updatedPriceList.sort((a, b) =>
          a.width === b.width ? a.height - b.height : a.width - b.width,
        ),
      });
      setDiscount({
        mru: 0,
        may: 0,
        reu: 0,
        others: 0,
      });
    }
  };

  const categories = [
    "Jalousie",
    "Fenetre Coulissante",
    "Porte Coulissante",
    "Fixe",
    "Fenetre Frappe Francaise",
    "Fenetre Frappe Anglaise",
    "Porte Frappe",
    "Volet Roulant",
  ];

  useEffect(() => {
    setShowImg(
      selectedProduct?.image
        ? `https://app.noutfermeture.com/api/${selectedProduct?.image}`
        : `/assets/images/default-img.png`,
    );

    setFormData({
      image: selectedProduct?.image ? selectedProduct?.image : "",
      designation: selectedProduct ? selectedProduct?.designation : "",
      vitrage: selectedProduct ? selectedProduct?.vitrage : "",
      cermone: selectedProduct ? selectedProduct?.cermone : "",
      priceList: selectedProduct
        ? [...selectedProduct?.priceList].sort((a, b) =>
            a.width === b.width ? a.height - b.height : a.width - b.width,
          )
        : [],
      category: selectedProduct ? selectedProduct?.category : "",
    });
    setModalImage(null);

    setId(selectedProduct ? selectedProduct?._id : "");
  }, [selectedProduct, onClose, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    const duplicateCombination = formData.priceList.some((entry, index) => {
      // Convert width and height to numbers
      const width = Number(entry.width);
      const height = Number(entry.height);

      // Check for duplicate width and height combinations or empty width/height
      return (
        formData.priceList.findIndex(
          (p, i) =>
            i !== index &&
            Number(p.width) === width &&
            Number(p.height) === height,
        ) !== -1 ||
        width === 0 ||
        height === 0 ||
        isNaN(width) ||
        isNaN(height)
      );
    });

    if (duplicateCombination) {
      toast.error(
        "Duplicate width and height combination found or empty width/height",
      );
      return;
    }

    const formDataAppend = new FormData();
    formDataAppend.append("designation", formData.designation);
    formDataAppend.append("vitrage", formData.vitrage);
    formDataAppend.append("cermone", formData.cermone);
    formDataAppend.append("category", formData.category);

    if (modalImage !== null) {
      formDataAppend.append("image", modalImage);
    } else {
      formDataAppend.append("image", formData.image);
    }

    formDataAppend.append("priceFactor[euro]", priceFactor.euro);
    formDataAppend.append("priceFactor[may]", priceFactor.may);
    formDataAppend.append("priceFactor[reu]", priceFactor.reu);
    formDataAppend.append("priceFactor[others]", priceFactor.others);

    formData.priceList.forEach((priceEntry, index) => {
      formDataAppend.append(`priceList[${index}][width]`, priceEntry.width);
      formDataAppend.append(`priceList[${index}][height]`, priceEntry.height);
      formDataAppend.append(`priceList[${index}][price]`, priceEntry.price);
      formDataAppend.append(
        `priceList[${index}][price_local]`,
        priceEntry.price_local ?? 0,
      );
      formDataAppend.append(
        `priceList[${index}][price_old]`,
        priceEntry.price_old ?? 0,
      );
      formDataAppend.append(
        `priceList[${index}][price_default_old]`,
        priceEntry.price_default_old ?? 0,
      );
      formDataAppend.append(
        `priceList[${index}][price_may]`,
        priceEntry.price_may ?? 0,
      );
      formDataAppend.append(
        `priceList[${index}][price_may_old]`,
        priceEntry.price_may_old ?? 0,
      );
      formDataAppend.append(
        `priceList[${index}][price_reu]`,
        priceEntry.price_reu ?? 0,
      );
      formDataAppend.append(
        `priceList[${index}][price_reu_old]`,
        priceEntry.price_reu_old ?? 0,
      );
    });

    try {
      const resp = await updateDesignation({ formDataAppend, id });
      if (resp && resp.status === 200) {
        toast.success(resp.data.message);
        isUpdate();
      } else if (resp && resp.status === 400) {
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

  const handleDelete = async () => {
    const deleteResp = await deleteDesignation({ id });
    if (deleteResp?.status === 200) {
      toast.success(deleteResp.data.message);
      isUpdate();
    } else if (deleteResp?.status === 404) {
      toast.error(deleteResp.data.message);
    } else {
      toast.error("Error in Deleting Designation");
    }
    onClose();
  };
  const handleAddPriceEntry = () => {
    const newPriceList = [
      ...formData.priceList,
      {
        width: "",
        height: "",
        price: "",
        price_local: 0,
        price_old: 0,
        price_default_old: 0,
        price_may: 0,
        price_may_old: 0,
        price_reu: 0,
        price_reu_old: 0,
      },
    ];
    setFormData({
      ...formData,
      priceList: newPriceList,
    });
  };

  const handlePriceInputChange = (index, e) => {
    const { name, value } = e.target;
    const newPriceList = [...formData.priceList];
    newPriceList[index][name] = value;
    setFormData({
      ...formData,
      priceList: newPriceList,
    });
  };

  const handleDeletePriceEntry = (index) => {
    const newPriceList = [...formData.priceList];
    newPriceList.splice(index, 1);
    setFormData({
      ...formData,
      priceList: newPriceList,
    });
  };

  function exportPrices() {
    const reorderedPriceList = formData.priceList.map((priceEntry) => ({
      width: priceEntry.width,
      height: priceEntry.height,
      price_local: priceEntry.price_local,
      price_old: priceEntry.price_old,
      price_may: priceEntry.price_may,
      price_may_old: priceEntry.price_may_old,
      price_reu: priceEntry.price_reu,
      price_reu_old: priceEntry.price_reu_old,
      price: priceEntry.price,
      price_default_old: priceEntry.price_default_old,
    }));

    const csv = Papa.unparse(reorderedPriceList);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.designation}_prices.csv`;
    a.click();
  }

  function importPrices(event) {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        console.log("Parsed CSV:", results.data);
        const parsedPrices = results.data
          .filter(
            (row) =>
              !isNaN(parseFloat(row.width)) && !isNaN(parseFloat(row.height)),
          )
          .map((row) => ({
            width: parseFloat(row.width),
            height: parseFloat(row.height),
            price_local: isNaN(parseFloat(row.price_local))
              ? 0
              : parseFloat(row.price_local),
            price_old: isNaN(parseFloat(row.price_old))
              ? 0
              : parseFloat(row.price_old),
            price_may: isNaN(parseFloat(row.price_may))
              ? 0
              : parseFloat(row.price_may),
            price_may_old: isNaN(parseFloat(row.price_may_old))
              ? 0
              : parseFloat(row.price_may_old),
            price_reu: isNaN(parseFloat(row.price_reu))
              ? 0
              : parseFloat(row.price_reu),
            price_reu_old: isNaN(parseFloat(row.price_reu_old))
              ? 0
              : parseFloat(row.price_reu_old),
            price: isNaN(parseFloat(row.price)) ? 0 : parseFloat(row.price),
            price_default_old: isNaN(parseFloat(row.price_default_old))
              ? 0
              : parseFloat(row.price_default_old),
            _id: row._id, // Optional if you need it
          }));

        try {
          setFormData({
            ...formData,
            priceList: parsedPrices,
          });
        } catch (error) {
          console.error("Error updating prices:", error);
        }
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
      },
    });
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={modalShellSx(1000)}>
        <ModalHeader
          title="Update Product Data"
          subtitle={formData.designation || ""}
          onClose={onClose}
        />
        <form onSubmit={handleUpdateProduct}>
          <Box sx={{ padding: "20px", borderRadius: "12px" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Field label="Product image">
                  <Box sx={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    {showImg && (
                      <img
                        src={showImg}
                        alt="Preview"
                        style={{
                          width: 90,
                          height: 72,
                          objectFit: "contain",
                          border: `1px solid ${COLORS.cardBorder}`,
                          borderRadius: "6px",
                          background: "#F7F8F9",
                        }}
                      />
                    )}
                    <input type="file" onChange={handleImageChange} name="image" />
                  </Box>
                </Field>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field label="Product designation">
                  <input
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    style={fieldInputStyle}
                  />
                </Field>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field label="Product vitrage">
                  <input
                    name="vitrage"
                    value={formData.vitrage}
                    onChange={handleInputChange}
                    style={fieldInputStyle}
                  />
                </Field>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field label="Product category">
                  <select
                    name="category"
                    value={formData.category || ""}
                    onChange={handleInputChange}
                    style={fieldSelectStyle}
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </Field>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field label="Product cermone">
                  <input
                    name="cermone"
                    value={formData.cermone}
                    onChange={handleInputChange}
                    style={fieldInputStyle}
                  />
                </Field>
              </Grid>

              {/* Euro-conversion tool: reads the current MRU reference price,
                      converts to Euro, bumps MAY/REU/Others by their own %.
                      Leaves MRU itself untouched. */}
                  <Box
                    sx={{
                      p: 2,
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <TextField
                      size="medium"
                      type="number"
                      label="Euro Price"
                      value={priceFactor.euro}
                      onChange={(e) =>
                        setPriceFactor({
                          ...priceFactor,
                          euro: e.target.value,
                        })
                      }
                      sx={{ width: "140px" }}
                    />

                    <TextField
                      size="medium"
                      type="number"
                      label="MAY %"
                      value={priceFactor.may}
                      onChange={(e) =>
                        setPriceFactor({
                          ...priceFactor,
                          may: e.target.value,
                        })
                      }
                      sx={{ width: "140px" }}
                    />

                    <TextField
                      size="medium"
                      type="number"
                      label="REU %"
                      value={priceFactor.reu}
                      onChange={(e) =>
                        setPriceFactor({
                          ...priceFactor,
                          reu: e.target.value,
                        })
                      }
                      sx={{ width: "140px" }}
                    />

                    <TextField
                      size="medium"
                      type="number"
                      label="Others %"
                      value={priceFactor.others}
                      onChange={(e) =>
                        setPriceFactor({
                          ...priceFactor,
                          others: e.target.value,
                        })
                      }
                      sx={{ width: "140px" }}
                    />

                    <Button
                      color="primary"
                      onClick={applyPercentage}
                      variant="contained"
                      disabled={formData.priceList.length === 0}
                    >
                      Apply
                    </Button>
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <Button
                      color="primary"
                      onClick={() => {
                        const newPriceList = formData.priceList.map(
                          (entry) => ({
                            ...entry,
                            isSelected: true,
                          }),
                        );
                        setFormData({
                          ...formData,
                          priceList: newPriceList,
                        });
                      }}
                      variant="contained"
                      disabled={formData.priceList.length === 0}
                    >
                      Select All
                    </Button>

                    <Button
                      color="primary"
                      onClick={() => {
                        const newPriceList = formData.priceList.map(
                          (entry) => ({
                            ...entry,
                            isSelected: false,
                          }),
                        );
                        setFormData({
                          ...formData,
                          priceList: newPriceList,
                        });
                      }}
                      variant="contained"
                      disabled={formData.priceList.length === 0}
                    >
                      UnSelect
                    </Button>

                    {/* Discount % inputs (mru/may/reu/others) are intentionally
                        hidden; this Apply still applies whatever is in `discount`
                        state, which currently only "AllDesignation"'s catalog-wide
                        panel sets — left as-is, not part of this change. */}
                    <Button
                      color="primary"
                      onClick={applyDiscount}
                      variant="contained"
                      disabled={formData.priceList.length === 0}
                    >
                      Apply Discount
                    </Button>
                  </Box>

                  {/* Independent per-country price increase — each field applies
                      only to that one country's own column, off its own previous
                      price, with no cross-country dependency. */}
                  <Box sx={{ p: 2 }}>
                    <Grid
                      container
                      spacing={2}
                      sx={{ alignItems: "center", pb: 1, width: "100%" }}
                    >
                      <Grid item xs={12} sm={2}>
                        <TextField
                          size="medium"
                          type="number"
                          fullWidth
                          label="MRU Direct Increase %"
                          value={directPercent.mru}
                          onChange={(e) =>
                            setDirectPercent({
                              ...directPercent,
                              mru: e.target.value,
                            })
                          }
                        />
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <TextField
                          size="medium"
                          type="number"
                          fullWidth
                          label="MAY Direct Increase %"
                          value={directPercent.may}
                          onChange={(e) =>
                            setDirectPercent({
                              ...directPercent,
                              may: e.target.value,
                            })
                          }
                        />
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <TextField
                          size="medium"
                          type="number"
                          fullWidth
                          label="REU Direct Increase %"
                          value={directPercent.reu}
                          onChange={(e) =>
                            setDirectPercent({
                              ...directPercent,
                              reu: e.target.value,
                            })
                          }
                        />
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <TextField
                          size="medium"
                          type="number"
                          fullWidth
                          label="Price Direct Increase %"
                          value={directPercent.others}
                          onChange={(e) =>
                            setDirectPercent({
                              ...directPercent,
                              others: e.target.value,
                            })
                          }
                        />
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <Button
                          color="primary"
                          onClick={applyDirectPercentage}
                          variant="contained"
                          disabled={formData.priceList.length === 0}
                        >
                          Apply
                        </Button>
                      </Grid>
                    </Grid>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", pt: 1 }}>
                      Check the dimension rows you want to change below, set a % for the countries you
                      want to move, then click Apply. Each field increases only its own column directly
                      off that country's own previous price — MRU, MAY, REU and Price never affect each
                      other. A comparison row appears below each price row so you can review before
                      hitting Update Product.
                    </Typography>
                  </Box>

                  {/* Price List Section */}
                  <Box sx={{ p: 2 }}>
                    {formData.priceList.length > 0 &&
                      formData.priceList.map((priceEntry, index) => (
                        <Grid
                          container
                          spacing={2}
                          key={index}
                          sx={{ alignItems: "center", pb: 2 }}
                        >
                          <Grid item xs={12} sm={1.5}>
                            <FormControl fullWidth>
                              <TextField
                                size="medium"
                                type="number"
                                fullWidth
                                label="Largeur (mm)"
                                name="width"
                                value={priceEntry.width}
                                onChange={(e) =>
                                  handlePriceInputChange(index, e)
                                }
                                sx={{
                                  "& input[type=number]": {
                                    "-moz-appearance": "textfield",
                                  },
                                  "& input[type=number]::-webkit-outer-spin-button":
                                    {
                                      "-webkit-appearance": "none",
                                      margin: 0,
                                    },
                                  "& input[type=number]::-webkit-inner-spin-button":
                                    {
                                      "-webkit-appearance": "none",
                                      margin: 0,
                                    },
                                }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={1.5}>
                            <FormControl fullWidth>
                              <TextField
                                fullWidth
                                type="number"
                                label="Hauteur (mm)"
                                name="height"
                                value={priceEntry.height}
                                onChange={(e) =>
                                  handlePriceInputChange(index, e)
                                }
                                sx={{
                                  "& input[type=number]": {
                                    "-moz-appearance": "textfield",
                                  },
                                  "& input[type=number]::-webkit-outer-spin-button":
                                    {
                                      "-webkit-appearance": "none",
                                      margin: 0,
                                    },
                                  "& input[type=number]::-webkit-inner-spin-button":
                                    {
                                      "-webkit-appearance": "none",
                                      margin: 0,
                                    },
                                }}
                              />
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} sm={2}>
                            <FormControl fullWidth>
                              <TextField
                                fullWidth
                                type="number"
                                label="Price MRU"
                                name="price_local"
                                value={priceEntry.price_local ?? 0}
                                onChange={(e) =>
                                  handlePriceInputChange(index, e)
                                }
                                sx={{
                                  "& input[type=number]": {
                                    "-moz-appearance": "textfield",
                                  },
                                  "& input[type=number]::-webkit-outer-spin-button":
                                    {
                                      "-webkit-appearance": "none",
                                      margin: 0,
                                    },
                                  "& input[type=number]::-webkit-inner-spin-button":
                                    {
                                      "-webkit-appearance": "none",
                                      margin: 0,
                                    },
                                }}
                              />
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} sm={2}>
                            <FormControl fullWidth>
                              <TextField
                                fullWidth
                                type="number"
                                label="Price MAY"
                                name="price_may"
                                value={priceEntry.price_may ?? 0}
                                onChange={(e) =>
                                  handlePriceInputChange(index, e)
                                }
                                sx={{
                                  "& input[type=number]": {
                                    "-moz-appearance": "textfield",
                                  },
                                  "& input[type=number]::-webkit-outer-spin-button":
                                    {
                                      "-webkit-appearance": "none",
                                      margin: 0,
                                    },
                                  "& input[type=number]::-webkit-inner-spin-button":
                                    {
                                      "-webkit-appearance": "none",
                                      margin: 0,
                                    },
                                }}
                              />
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} sm={2}>
                            <FormControl fullWidth>
                              <TextField
                                fullWidth
                                type="number"
                                label="Price REU"
                                name="price_reu"
                                value={priceEntry.price_reu ?? 0}
                                onChange={(e) =>
                                  handlePriceInputChange(index, e)
                                }
                                sx={{
                                  "& input[type=number]": {
                                    "-moz-appearance": "textfield",
                                  },
                                  "& input[type=number]::-webkit-outer-spin-button":
                                    {
                                      "-webkit-appearance": "none",
                                      margin: 0,
                                    },
                                  "& input[type=number]::-webkit-inner-spin-button":
                                    {
                                      "-webkit-appearance": "none",
                                      margin: 0,
                                    },
                                }}
                              />
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} sm={2}>
                            <FormControl fullWidth>
                              <TextField
                                fullWidth
                                type="number"
                                label="Price"
                                name="price"
                                value={priceEntry.price}
                                onChange={(e) =>
                                  handlePriceInputChange(index, e)
                                }
                                sx={{
                                  "& input[type=number]": {
                                    "-moz-appearance": "textfield",
                                  },
                                  "& input[type=number]::-webkit-outer-spin-button":
                                    {
                                      "-webkit-appearance": "none",
                                      margin: 0,
                                    },
                                  "& input[type=number]::-webkit-inner-spin-button":
                                    {
                                      "-webkit-appearance": "none",
                                      margin: 0,
                                    },
                                }}
                              />
                            </FormControl>
                          </Grid>

                          <Grid
                            item
                            xs={12}
                            sm={1}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={
                                  formData.priceList[index].isSelected || false
                                }
                                onChange={(e) => {
                                  const newPriceList = [...formData.priceList];
                                  newPriceList[index].isSelected =
                                    e.target.checked;
                                  setFormData({
                                    ...formData,
                                    priceList: newPriceList,
                                  });
                                }}
                              />
                            </FormControl>
                            <IconButton
                              onClick={() => handleDeletePriceEntry(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>

                          <PriceDeltaRow priceEntry={priceEntry} />
                        </Grid>
                      ))}
                  </Box>
                  <Grid item xs={12}>
                    <Box
                      display="flex"
                      sx={{
                        flexDirection: {
                          xs: "column",
                          md: "row",
                          alignItems: "center",
                        },
                      }}
                      gap="6px"
                    >
                      <Button variant="contained" onClick={handleAddPriceEntry}>
                        Add Price
                      </Button>
                      <Button
                        variant="contained"
                        onClick={exportPrices}
                        sx={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        Export Prices
                      </Button>

                      <input
                        name="Import"
                        type="file"
                        accept=".csv"
                        onChange={(e) => importPrices(e)}
                      />
                    </Box>
                  </Grid>

                </Grid>
              </Box>

              <Box sx={modalFooterSx}>
                <Button sx={buttonSx.danger("44px")} onClick={handleDelete}>
                  Delete Product
                </Button>
                <Box sx={{ flex: 1 }} />
                <Button sx={buttonSx.neutral("44px")} onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" sx={{ ...buttonSx.primary(), fontWeight: 700 }}>
                  Update Product
                </Button>
              </Box>
            </form>
      </Box>
    </Modal>
  );
};

export default UpdateDesignation;

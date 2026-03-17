import {
  Modal,
  Box,
  Grid,
  FormControl,
  TextField,
  Typography,
  Button,
  IconButton,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { updateDesignation } from "../../services/designation/updateDesignation";
import { deleteDesignation } from "../../services/designation/deleteDesignation";
import Papa from "papaparse";

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

  const [priceFactor, setPriceFactor] = useState({
    euro: 45,
    may: 0,
    reu: 0,
    others: 0,
  });

  useEffect(() => {
    if (selectedProduct?.priceFactor) {
      setPriceFactor({
        ...selectedProduct?.priceFactor,
      });
    } else {
      setPriceFactor({
        euro: 45,
        may: 0,
        reu: 0,
        others: 0,
      });
    }
  }, [selectedProduct?._id]);

  const applyPercentage = () => {
    if (formData.priceList?.length > 0) {
      const updatedPriceList = formData.priceList.map((priceEntry) => {
        const price_local = Number(priceEntry.price_local);
        const euroPrice = price_local / Number(priceFactor.euro);

        return {
          ...priceEntry,
          price: priceEntry?.isSelected
            ? Math.round(euroPrice * (1 + Number(priceFactor.others) / 100))
            : priceEntry.price,
          price_may: priceEntry?.isSelected
            ? Math.round(euroPrice * (1 + Number(priceFactor.may) / 100))
            : priceEntry.price_may,
          price_reu: priceEntry?.isSelected
            ? Math.round(euroPrice * (1 + Number(priceFactor.reu) / 100))
            : priceEntry.price_reu,
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
        `priceList[${index}][price_may]`,
        priceEntry.price_may ?? 0,
      );
      formDataAppend.append(
        `priceList[${index}][price_reu]`,
        priceEntry.price_reu ?? 0,
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
        price_may: 0,
        price_reu: 0,
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
      price_may: priceEntry.price_may,
      price_reu: priceEntry.price_reu,
      price: priceEntry.price,
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
            price_may: isNaN(parseFloat(row.price_may))
              ? 0
              : parseFloat(row.price_may),
            price_reu: isNaN(parseFloat(row.price_reu))
              ? 0
              : parseFloat(row.price_reu),
            price: isNaN(parseFloat(row.price)) ? 0 : parseFloat(row.price),
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
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          width: { xs: "90%", md: "auto" },
          minWidth: { xs: "90%", md: "90%", lg: "1000px" },
          display: "flex",
          flexDirection: "row",
          borderRadius: "6px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h4">Update Product Data</Typography>
          </Grid>
          <Grid item xs={12}>
            <form onSubmit={handleUpdateProduct}>
              <Box sx={{ padding: "20px", borderRadius: "12px" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box>
                      {showImg && (
                        <img
                          src={showImg}
                          alt="Preview"
                          style={{
                            width: "100px",
                            height: "80px",
                            marginTop: "10px",
                          }}
                        />
                      )}
                      <br />
                      <input
                        type="file"
                        onChange={handleImageChange}
                        name="image"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <FormControl fullWidth>
                        <TextField
                          fullWidth
                          label="Product Designation"
                          name="designation"
                          value={formData.designation}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <FormControl fullWidth>
                        <TextField
                          fullWidth
                          label="Product Vitrage"
                          name="vitrage"
                          value={formData.vitrage}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <FormControl fullWidth>
                        <TextField
                          fullWidth
                          label="Product Category"
                          name="category"
                          select
                          value={formData.category}
                          onChange={handleInputChange}
                        >
                          {categories.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      </FormControl>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box>
                      <FormControl fullWidth>
                        <TextField
                          fullWidth
                          label="Product Cermone"
                          name="cermone"
                          value={formData.cermone}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </Box>
                  </Grid>

                  <Box sx={{ p: 2 }}>
                    <Grid
                      container
                      spacing={2}
                      sx={{ alignItems: "center", pb: 2, width: "100%" }}
                    >
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <TextField
                          size="medium"
                          type="number"
                          fullWidth
                          label="Euro Price"
                          value={priceFactor.euro}
                          onChange={(e) =>
                            setPriceFactor({
                              ...priceFactor,
                              euro: e.target.value,
                            })
                          }
                        />
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <TextField
                          size="medium"
                          type="number"
                          fullWidth
                          label="MAY %"
                          value={priceFactor.may}
                          onChange={(e) =>
                            setPriceFactor({
                              ...priceFactor,
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
                          label="REU %"
                          value={priceFactor.reu}
                          onChange={(e) =>
                            setPriceFactor({
                              ...priceFactor,
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
                          label="Others %"
                          value={priceFactor.others}
                          onChange={(e) =>
                            setPriceFactor({
                              ...priceFactor,
                              others: e.target.value,
                            })
                          }
                        />
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <Button
                          color="primary"
                          onClick={applyPercentage}
                          variant="contained"
                          disabled={formData.priceList.length === 0}
                        >
                          Apply
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={2}>
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
                      </Grid>

                      <Grid item xs={12} sm={2}>
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
                      </Grid>

                      <Grid item xs={12} sm={1.5}>
                        <TextField
                          size="medium"
                          type="number"
                          fullWidth
                          value={discount.mru}
                          label="MRU Discount %"
                          onChange={(e) =>
                            setDiscount({
                              ...discount,
                              mru: e.target.value,
                            })
                          }
                        />
                      </Grid>

                      <Grid item xs={12} sm={1.5}>
                        <TextField
                          size="medium"
                          type="number"
                          fullWidth
                          value={discount.may}
                          label="MAY Discount %"
                          onChange={(e) =>
                            setDiscount({
                              ...discount,
                              may: e.target.value,
                            })
                          }
                        />
                      </Grid>

                      <Grid item xs={12} sm={1.5}>
                        <TextField
                          size="medium"
                          type="number"
                          fullWidth
                          value={discount.reu}
                          label="REU Discount %"
                          onChange={(e) =>
                            setDiscount({
                              ...discount,
                              reu: e.target.value,
                            })
                          }
                        />
                      </Grid>

                      <Grid item xs={12} sm={1.5}>
                        <TextField
                          size="medium"
                          type="number"
                          fullWidth
                          value={discount.others}
                          label="Other Discount %"
                          onChange={(e) =>
                            setDiscount({
                              ...discount,
                              others: e.target.value,
                            })
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Button
                          color="primary"
                          onClick={applyDiscount}
                          variant="contained"
                          disabled={formData.priceList.length === 0}
                        >
                          Apply
                        </Button>
                      </Grid>
                    </Grid>
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
                          <Grid item xs={12} sm={2}>
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
                          <Grid item xs={12} sm={2}>
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

                          <Grid item xs={12} sm={1.75}>
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

                          <Grid item xs={12} sm={1.75}>
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

                          <Grid item xs={12} sm={1.75}>
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

                          <Grid item xs={12} sm={1.75}>
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

                  <Grid item xs={12}>
                    <Box
                      display="flex"
                      sx={{ flexDirection: { xs: "column", md: "row" } }}
                      gap="6px"
                    >
                      <Box display="flex" gap="6px">
                        <Button
                          variant="contained"
                          sx={{
                            whiteSpace: "nowrap",
                          }}
                          type="submit"
                        >
                          Update Product
                        </Button>
                        <Button
                          variant="contained"
                          onClick={handleCancel}
                          sx={{
                            whiteSpace: "nowrap",
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                      <Button
                        variant="contained"
                        onClick={handleDelete}
                        sx={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        Delete Product
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
  );
};

export default UpdateDesignation;

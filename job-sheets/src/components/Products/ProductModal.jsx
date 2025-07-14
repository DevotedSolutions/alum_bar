import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  Select,
  MenuItem,
  TextField,
  useMediaQuery,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import { Add, Remove, Close, ResetTvOutlined } from "@mui/icons-material";
import { getGamme } from "../../api/Products-apis/getGamme";
import { toast } from "react-toastify";
import default_img from "../../assets/default-img.png";
import tube from "../../utility/tube";
import BBD from "../../utility/bbdData";
import {
  HLOOKUP,
  NUMBERVALUE,
  RIGHT,
  ROUND,
  ROUNDDOWN,
  ROUNDUP,
  VLOOKUP,
  VLOOKUPBBD,
} from "../../utility/priceFormula";
import { getPrice } from "../../api/Products-apis/getPrice";
import { getMinMaxDimension } from "../../api/Products-apis/getMinMaxDimension";

const ProductModal = ({
  isOpen,
  onClose,
  selectedProduct,
  quantity,
  selectedColor,
  setQuantity,
  setSelectedColor,
  onAddToCart,
  setTax,
  price,
  setPrice,
  rep,
  setRep,
  setLargeur,
  largeur,
  hauteur,
  setHauteur,
}) => {
  const colorArray = ["ALU BLANC", "ALU NOIRE GRANITE", "ALU GRIS DESERT"];
  const [gamme, setGamme] = useState([]);
  const [minHeight, setMinHeight] = useState();
  const [maxHeight, setMaxHeight] = useState();
  const [minWidth, setMinWidth] = useState();
  const [maxWidth, setMaxWidth] = useState();

  // const PriceCalculation = () => {
  //   let calculatedPrice = 0;
  //   let designationValue;
  //   let roundedDimensionsSum;

  //   const firstLookupValue = selectedProduct?.priceList;
  //   const color = selectedColor === "ALU BLANC" ? "Blanc" : "Noir";

  //   if (selectedProduct?.designation === "Tube de liason") {
  //     const dimensionsSum = parseInt(largeur) + parseInt(hauteur);

  //     roundedDimensionsSum =
  //       dimensionsSum % 100 >= 20
  //         ? Math.ceil(dimensionsSum / 100) * 100
  //         : Math.floor(dimensionsSum / 100) * 100;
  //   } else {
  //     const hauteurNumber = parseInt(hauteur);

  //     roundedDimensionsSum =
  //       hauteurNumber % 100 >= 20
  //         ? Math.ceil(hauteurNumber / 100) * 100
  //         : Math.floor(hauteurNumber / 100) * 100;
  //   }

  //   if (firstLookupValue && color) {
  //     designationValue = firstLookupValue + color + roundedDimensionsSum;
  //   }

  //   console.log(designationValue);
  //   var firstPriceValue;
  //   if (selectedProduct?.designation === "Tube de liason") {
  //     firstPriceValue = VLOOKUP(designationValue, tube, true);
  //   } else if (selectedProduct?.designation === "Jalousie 2 Div") {
  //     const larguerNumber = parseInt(largeur);
  //     const largeurDivide = larguerNumber / 2;

  //     var lookupValue = RIGHT(largeurDivide);
  //     firstPriceValue =
  //       VLOOKUPBBD(designationValue, BBD, lookupValue, true) * 2;
  //   } else if (selectedProduct?.designation === "Jalousie 3 Div") {
  //     const larguerNumber = parseInt(largeur);
  //     const largeurDivide = larguerNumber / 3;

  //     var lookupValue = RIGHT(largeurDivide);
  //     firstPriceValue =
  //       VLOOKUPBBD(designationValue, BBD, lookupValue, true) * 3;
  //   } else {
  //     const larguerNumber = parseInt(largeur);
  //     const largeurDivide = larguerNumber;

  //     var lookupValue = RIGHT(largeurDivide);
  //     firstPriceValue = VLOOKUPBBD(designationValue, BBD, lookupValue, true);
  //   }

  //   var secondPriceValue;

  //   if (selectedProduct?.cermone?.toLowerCase() === "serrure 1 pt") {
  //     secondPriceValue = 100;
  //   } else if (selectedProduct?.cermone?.toLowerCase() === "telecommande") {
  //     secondPriceValue = 250;
  //   } else if (selectedProduct?.cermone?.toLowerCase() === "boitier a clef") {
  //     secondPriceValue = 150;
  //   } else {
  //     secondPriceValue = 0.0;
  //   }

  //   const MValue = (largeur * hauteur) / 1000000;
  //   var thirdPriceValue;

  //   if (
  //     selectedProduct?.vitrage === "6 mm Tintee" ||
  //     selectedProduct?.vitrage === "8 mm Tintee"
  //   ) {
  //     thirdPriceValue = MValue * 30;
  //   } else if (selectedProduct?.vitrage === "33,1 Opale") {
  //     thirdPriceValue = MValue * 70;
  //   } else if (
  //     selectedProduct?.vitrage === "33,1 Claire" ||
  //     selectedProduct?.vitrage === "33,1 Tintee"
  //   ) {
  //     thirdPriceValue = MValue * 30;
  //   } else if (selectedProduct?.vitrage === "44,2 Claire") {
  //     thirdPriceValue = MValue * 50;
  //   } else if (selectedProduct?.vitrage === "44,2 Tintee") {
  //     thirdPriceValue = MValue * 80;
  //   } else {
  //     thirdPriceValue = 0.0;
  //   }

  //   if (isNaN(firstPriceValue)) {
  //     firstPriceValue = 0;
  //   }

  //   console.log(firstPriceValue, secondPriceValue, thirdPriceValue);

  //   const firstValue = parseInt(firstPriceValue) || 0;
  //   const secondValue = parseInt(secondPriceValue);
  //   const thirdValue = parseInt(thirdPriceValue);
  //   const sumPrice = firstValue + secondValue + thirdValue;
  //   console.log(sumPrice);
  //   calculatedPrice = ROUND(sumPrice, 0);
  //   console.log(calculatedPrice);

  //   if (largeur > 0 && hauteur > 0) {
  //     setPrice(calculatedPrice);
  //   }
  // };

  console.log(selectedProduct?._id);

  useEffect(() => {
    const getDimension = async () => {
      const response = await getMinMaxDimension(selectedProduct?._id);

      if (response?.status === 200) {
        setMaxHeight(response?.data?.maxHeight);
        setMinHeight(response?.data?.minHeight);
        setMaxWidth(response?.data?.maxWidth);
        setMinWidth(response?.data?.minWidth);
      } else {
        toast.error("Cannot get Min Max Dimension");
      }
    };
    if (selectedProduct?._id) {
      getDimension();
    }
  }, [selectedProduct?._id]);

  const PriceCalculation = async () => {
    const roundedLargeur = Math.floor(largeur / 100) * 100;
    const roundedHauteur = Math.floor(hauteur / 100) * 100;

    if (roundedLargeur > 0 && roundedHauteur > 0) {
      const response = await getPrice(
        selectedProduct?._id,
        roundedLargeur,
        roundedHauteur
      );

      if (response?.status === 200) {
        if (response?.data?.price === null) {
          setPrice(0);
        } else {
          setPrice(response?.data?.price);
        }
      } else {
        toast.error("Les dimensions ne sont pas valides pour ce produit");
        setPrice(0);
      }
    } else {
      setPrice(0);
    }
  };

  const handleHauteurKeyPress = (event) => {
    if (event.key === "Enter") {
      PriceCalculation();
    }
  };

  const handleLargeurKeyPress = (event) => {
    if (event.key === "Enter") {
      PriceCalculation();
    }
  };

  useEffect(() => {
    PriceCalculation();
  }, [selectedColor, selectedProduct]);

  useEffect(() => {
    let tax;
    tax = (largeur / 1000 + hauteur / 1000) * 2 * 16 * quantity;
    setTax(tax);
  }, [quantity, largeur, hauteur]);

  useEffect(() => {
    const setAllGamme = async () => {
      const resp = await getGamme();
      console.log(resp);
      if (resp?.status === 200) {
        setGamme(resp?.data.getAllGamme);
      } else {
        toast.error("Cannot fetch Colors");
      }
    };
    setAllGamme();
  }, []);

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  const isMobile = useMediaQuery("(max-width:800px)");

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "80%" : 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "6px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <IconButton
            onClick={() => {
              onClose();
              setQuantity(1);
              setSelectedColor("");
            }}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              color: "#08999D",
            }}
          >
            <Close />
          </IconButton>

          {/* Left Side - Product Details */}
          <Box sx={{ flex: 1, paddingRight: 2, width: "40%" }}>
            <Typography variant="h5">{selectedProduct?.designation}</Typography>

            <Typography variant="body1" sx={{ mb: 2, mt: 2 }}>
              <span style={{ fontWeight: "bold" }}> Serr/Cermone:</span>{" "}
              {selectedProduct?.cermone
                ? selectedProduct?.cermone === "undefined"
                  ? "-"
                  : selectedProduct?.cermone
                : "-"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <span style={{ fontWeight: "bold" }}> Vitrage: </span>
              {selectedProduct?.vitrage ? selectedProduct?.vitrage : "-"}
            </Typography>
            {/* Other product details */}
            <FormControl fullWidth>
              <InputLabel htmlFor="color-select">
                Sélectionner la Couleur
              </InputLabel>
              <Select
                size="medium"
                value={selectedColor}
                onChange={handleColorChange}
                label="Sélectionner la Couleur"
                inputProps={{
                  id: "color-select",
                }}
              >
                {gamme.map((item) => (
                  <MenuItem value={item?.gamme} key={item._id}>
                    {item?.gamme}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Repère"
              size="medium"
              fullWidth
              value={rep}
              onChange={(e) => setRep(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Typography sx={{ fontWeight: "bold", mt: 2 }}>
              Dimensions (mm):
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 1,
              }}
            >
              <Box sx={{ mr: 1 }}>
                <Typography sx={{ fontSize: "10px", color: "red" }}>
                  {`minimum: ${minWidth}mm`}
                </Typography>
                <Typography sx={{ fontSize: "10px", mb: 1, color: "red" }}>
                  {`maximum: ${maxWidth}mm`}
                </Typography>
                <TextField
                  size="medium"
                  type="number"
                  value={largeur}
                  onChange={(e) => setLargeur(e.target.value)}
                  error={largeur < minWidth || largeur > maxWidth}
                  fullWidth
                  onKeyDown={handleLargeurKeyPress}
                  onBlur={(e) => {
                    PriceCalculation();
                  }}
                  label="Largeur (mm)"
                  sx={{ mr: 1 }}
                />
              </Box>
              <Box>
                <Typography sx={{ fontSize: "10px", color: "red" }}>
                  {`minimun: ${minHeight}mm`}
                </Typography>
                <Typography sx={{ fontSize: "10px", mb: 1, color: "red" }}>
                  {`maximum: ${maxHeight}mm`}
                </Typography>
                <TextField
                  size="medium"
                  fullWidth
                  value={hauteur}
                  onChange={(e) => setHauteur(e.target.value)}
                  onKeyDown={handleHauteurKeyPress}
                  error={hauteur < minHeight || hauteur > maxHeight}
                  onBlur={(e) => {
                    PriceCalculation();
                  }}
                  type="number"
                  label="Hauteur (mm)"
                />
              </Box>
            </Box>
          </Box>

          {/* Right Side - Price, Quantity, and Add to Cart */}
          <Box sx={{ flex: 1, width: "40%", mx: 1 }}>
            <div style={{ width: "20%" }}>
              <img
                // src={`https://app.noutfermeture.com/api/${selectedProduct?.image}`}
                src={
                  selectedProduct?.image
                    ? `https://app.noutfermeture.com/api/${selectedProduct?.image}`
                    : default_img
                }
                //src={default_img}
                alt="product"
                width={isMobile ? "150px" : "150px"}
              />
            </div>
            {/* <Typography variant="h6" sx={{ mt: 1 }}>
            <span style={{ fontWeight: "bold" }}>Price:</span>{" "}
            {selectedProduct?.price} €
          </Typography> */}
            <TextField
              disabled
              size="medium"
              label="Prix"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Quantité:
              </Typography>
              <IconButton
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                size="small"
                sx={{ p: 0 }}
              >
                <Remove />
              </IconButton>
              <TextField
                size="small"
                inputProps={{
                  style: {
                    padding: 0,
                    textAlign: "center",
                  },
                }}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, e.target.value))}
                sx={{
                  width: isMobile ? "100px" : 40,
                  p: 0,
                }}
              />
              <IconButton
                onClick={() => setQuantity(quantity + 1)}
                size="small"
                sx={{ p: 0 }}
              >
                <Add />
              </IconButton>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
              Total: {price * quantity} €
            </Typography>
            <Button
              variant="contained"
              onClick={() => onAddToCart(selectedProduct)}
              sx={{
                mt: 2,
                bgcolor: "#08999D",
                "&:hover": {
                  bgcolor: "#08999D",
                },
              }}
            >
              Ajouter au panier
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            mt: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "10px",
              fontStyle: "italic",
            }}
          >
            Pour un autre type de vitrage, envoyez-nous un mail avec le devis en
            pièce jointe. Si le calculateur ne prend pas vos dimensions,
            contactez-nous à{" "}
            <a href="mailto:contact@noutfermeture.com">
              contact@noutfermeture.com
            </a>
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProductModal;

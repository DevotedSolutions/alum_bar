import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../api/Products-apis/getAllProducts";
import { toast } from "react-toastify";
import { Box, Button } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import ProductModal from "./ProductModal";
import { CardActionArea, useMediaQuery } from "@mui/material";
// import { Pagination } from "@mui/material";
import ProductCart from "../Cart/ProductCart";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LayoutPage from "../../pages/LayoutPage";
import Badge from "@mui/material/Badge";
import { getAllDesignation } from "../../api/Products-apis/getAllDesignation";
import default_img from "../../assets/default-img.png";

const AllProducts = () => {
  const storedCartItems = localStorage.getItem("cartItems");
  const [allProducts, setAllProducts] = useState([]);
  // const [page, setPage] = useState(1);
  // const [page, setPage] = useState(() => {
  //   const savedPage = localStorage.getItem("lastVisitedPage");
  //   return savedPage ? parseInt(savedPage, 10) : 1;
  // });
  // const [pageSize, setPageSize] = useState(12);
  //const [totalPages, setTotalPages] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [rep, setRep] = useState("");
  const [largeur, setLargeur] = useState();
  const [hauteur, setHauteur] = useState();
  const [selectedColor, setSelectedColor] = useState("");
  const [cartItems, setCartItems] = useState(
    storedCartItems ? JSON.parse(storedCartItems) : []
  );
  const isMobile = useMediaQuery("(max-width:800px)");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const increaseCartSize = useMediaQuery(
    "(min-width: 800px) and (max-width: 1270px)"
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [cartBadgeCount, setCartBadgeCount] = useState(cartItems.length);
  const [tax, setTax] = useState();

  useEffect(() => {
    setCartBadgeCount(cartItems.length);
  }, [cartItems]);

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setQuantity(1);
    setPrice(0);
    setHauteur();
    setLargeur();
    setTax(0);
    setRep("");
    setSelectedColor("");
  };

  const handleAddToCart = (product) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === product._id
    );
    if (selectedColor.trim() === "") {
      toast.error("Please select a color before adding to the cart.");
      return;
    }
    if (price === 0) {
      toast.error("Dimensions are not valid for this product");
      return;
    }

    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity = quantity;
      updatedCartItems[existingItemIndex].color = selectedColor;
      updatedCartItems[existingItemIndex].price = price;
      updatedCartItems[existingItemIndex].rep = rep;
      updatedCartItems[existingItemIndex].largeur = largeur;
      updatedCartItems[existingItemIndex].hauteur = hauteur;
      updatedCartItems[existingItemIndex].tax = tax;

      setCartItems(updatedCartItems);
      toast.success(
        `${quantity} ${product.productName}(s) updated in the cart!`
      );
    } else {
      const newItem = {
        id: product._id,
        image: product.image,
        designation: product.designation,
        cermone: product?.cermone,
        vitrage: product?.vitrage,
        rep: rep,
        largeur: largeur,
        hauteur: hauteur,
        price: price,
        quantity: quantity,
        color: selectedColor,
        tax: tax,
      };
      setCartItems([...cartItems, newItem]);
      toast.success(`${quantity} ${product.designation}(s) added to the cart!`);
    }

    setPrice(0);
    setHauteur();
    setLargeur();
    setRep("");
    setTax(0);
    setSelectedColor("");
    handleModalClose();
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await getAllDesignation();
        if (response?.status === 200) {
          setAllProducts(response?.data?.getdata);
          // setTotalPages(response?.data?.totalPages);
          // setPage(response?.data?.currentPage);

          //  localStorage.setItem("lastVisitedPage", response?.data?.currentPage);
        } else {
          toast.error("Error in fetching the Products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Error in fetching the Products");
      }
    };

    getProducts();
  }, []);

  // const handlePageChange = (event, newPage) => {
  //   setPage(newPage);
  // };

  return (
    <LayoutPage>
      <>
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          selectedProduct={selectedProduct}
          quantity={quantity}
          tax={tax}
          setTax={setTax}
          price={price}
          rep={rep}
          largeur={largeur}
          hauteur={hauteur}
          setRep={setRep}
          setLargeur={setLargeur}
          setHauteur={setHauteur}
          setPrice={setPrice}
          selectedColor={selectedColor}
          setQuantity={setQuantity}
          setSelectedColor={setSelectedColor}
          onAddToCart={handleAddToCart}
        />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            margin: isMobile ? "" : "10px 0px",
            padding: "8px 0px",
            width:
              cartItems.length > 0
                ? isMobile
                  ? "100%"
                  : increaseCartSize
                  ? "60%"
                  : "75%"
                : "100%",
          }}
        >
          {allProducts?.map((item, index) => (
            <Card
              sx={{
                width: "299px",
                margin: "10px",
                backgroundColor: "transparent",
                boxShadow: "none",
              }}
              key={index}
              onClick={() => {
                handleCardClick(item);
              }}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="250"
                  // image={`https://app.noutfermeture.com/api/${item?.image}`}
                  image={
                    item?.image
                      ? `https://app.noutfermeture.com/api/${item?.image}`
                      : default_img
                  }
                  alt="product image"
                  sx={{ objectFit: "contain" }}
                />
                <CardContent sx={{ p: 0 }}>
                  <div style={{ width: "100%" }}>
                    <Button
                      variant="contained"
                      sx={{
                        width: "100%",
                        bgcolor: "#08999D",
                        whiteSpace: "nowrap",
                        fontSize: "10px",
                        "&:hover": {
                          bgcolor: "#08999D",
                        },
                      }}
                    >
                      {/* {item?.designation && item?.designation.length > 30
                        ? `${item.designation.substring(
                            0,
                            item.designation.length / 2
                          )}...`
                        : item?.designation} */}
                      {item?.designation}
                    </Button>
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
        {/* <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            margin: isMobile ? "" : "10px 0px",
            padding: "8px 0px",
            width:
              cartItems.length > 0
                ? isMobile
                  ? "100%"
                  : increaseCartSize
                  ? "60%"
                  : "75%"
                : "100%",
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            sx={{ mt: 2, display: "flex", justifyContent: "center" }}
          />
        </Box> */}

        <IconButton
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            display: { xs: "block", md: "none" },
          }}
          onClick={() => {
            setIsDrawerOpen(!isDrawerOpen);
          }}
        >
          <Badge badgeContent={cartBadgeCount} color="error" overlap="circular">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        <Drawer
          anchor="bottom"
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: "100%",
              maxHeight: "70%",
              //pb: "30px",
              overflowY: "auto",
              backgroundColor: "whitesmoke",
              justifyContent: "space-between",
            },
          }}
        >
          <ProductCart
            cartItems={cartItems}
            setCartItems={setCartItems}
            setQuantity={setQuantity}
          />
        </Drawer>
        {!isMobile && cartItems.length > 0 && (
          <Box
            sx={{
              width: increaseCartSize ? "40%" : "25%",
              //marginTop:"10vh",
              paddingTop: "14vh",
              position: "fixed",
              top: 0,
              bottom: 0,
              right: 0,
              overflow: "hidden",
              maxHeight: "100%",
              overflowY: "auto",
              backgroundColor: "whitesmoke",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              //paddingBottom: "30px",
            }}
          >
            <ProductCart
              cartItems={cartItems}
              setCartItems={setCartItems}
              setQuantity={setQuantity}
            />
          </Box>
        )}
      </>
    </LayoutPage>
  );
};

export default AllProducts;

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Button,
  useMediaQuery,
  Grid,
  TextField,
} from "@mui/material";
import {
  getAllDesignation,
  getCombos,
} from "../../services/designation/getAllDesignation";
import {
  saveDiscount,
  getDiscount,
} from "../../services/designation/saveDiscount";
import { toast } from "react-toastify";
import UpdateDesignation from "./UpdateDesignation";
import AddDesignation from "./AddDesignation";
import AddCombo from "./AddCombos";
import UpdateCombo from "./UpdateCombo";

const AllDesignation = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [allCombos, setAllCombos] = useState([]);
  //   const [page, setPage] = useState(1);
  //   const [pageSize, setPageSize] = useState(12);
  //   const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState();
  const [onUpdate, setOnUpdate] = useState(false);
  const [discount, setDiscount] = useState({
    mru: 0,
    may: 0,
    reu: 0,
    others: 0,
  });
  const isMobile = useMediaQuery("(max-width:800px)");
  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddModalOpen = () => {
    setIsAddModalOpen(true);
  };
  const groupedProducts = allProducts.reduce((acc, item) => {
    const category = item.category || "Others";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const response = await getDiscount();
        if (response?.status === 200) {
          setDiscount({
            mru: response?.data?.discount?.mru || 0,
            may: response?.data?.discount?.may || 0,
            reu: response?.data?.discount?.reu || 0,
            others: response?.data?.discount?.others || 0,
          });
        } else {
          toast.error("Error in fetching the discount");
        }
      } catch (error) {
        console.error("Error fetching discount:", error);
        toast.error("Error in fetching the discount");
      }
    };

    fetchDiscount();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await getAllDesignation();
        if (response?.status === 200) {
          setAllProducts(response?.data?.getdata);
          //   setTotalPages(response?.data?.totalPages);
          //   setPage(response?.data?.currentPage);

          //  localStorage.setItem("lastVisitedPage", response?.data?.currentPage);
        } else {
          toast.error("Error in fetching the Products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Error in fetching the Products");
      }
    };

    const getCombosList = async () => {
      try {
        const response = await getCombos();
        console.log("Combos response:", response);
        if (response?.status === 200) {
          setAllCombos(response?.data?.combos);
        } else {
          toast.error("Error in fetching the Combos");
        }
      } catch (error) {
        console.error("Error fetching combos:", error);
        toast.error("Error in fetching the Combos");
      }
    };

    getProducts();
    getCombosList();
  }, [onUpdate]);

  //   const handlePageChange = (event, newPage) => {
  //     setPage(newPage);
  //   };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const isUpdate = () => {
    setOnUpdate(!onUpdate);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };
  const { Others, ...mainCategories } = groupedProducts;

  return (
    <>
      <UpdateDesignation
        isOpen={isModalOpen}
        onClose={handleModalClose}
        selectedProduct={selectedProduct}
        isUpdate={isUpdate}
      />
      <AddDesignation
        isOpen={isAddModalOpen}
        onClose={handleAddModalClose}
        isUpdate={isUpdate}
      />

      <UpdateCombo
        isOpen={Boolean(selectedCombo)}
        onClose={() => setSelectedCombo(null)}
        comboInfo={selectedCombo}
        availableProducts={allProducts?.map((product) => ({
          id: product._id,
          name: product.designation,
          category: product.category,
        }))}
        isUpdate={isUpdate}
      />

      <AddCombo
        isOpen={isComboModalOpen}
        onClose={() => setIsComboModalOpen(false)}
        availableProducts={allProducts?.map((product) => ({
          id: product._id,
          name: product.designation,
          category: product.category,
        }))}
        isUpdate={isUpdate}
      />
      <Box
        sx={{
          padding: "2px 15px",
        }}
      >
        <Button variant="contained" onClick={handleAddModalOpen}>
          Add Designation
        </Button>

        <Button
          variant="contained"
          onClick={() => setIsComboModalOpen(!isComboModalOpen)}
          sx={{ ml: 2 }}
        >
          Add Combo
        </Button>

        <Grid
          container
          sx={{
            marginTop: "10px",
            marginBottom: "10px",
            display: "flex",
            justifyContent: "center",
          }}
          spacing={2}
        >
          <Grid item xs={6} sm={2.5}>
            <TextField
              size="medium"
              type="number"
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

          <Grid item xs={12} sm={2.5}>
            <TextField
              size="medium"
              type="number"
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

          <Grid item xs={12} sm={2.5}>
            <TextField
              size="medium"
              type="number"
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

          <Grid item xs={12} sm={2.5}>
            <TextField
              size="medium"
              type="number"
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

          <Grid
            xs={12}
            sm={2}
            variant=""
            item
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Button
              variant="outlined"
              onClick={async () => {
                await saveDiscount({
                  ...discount,
                });
              }}
            >
              Apply Discount
            </Button>
          </Grid>
        </Grid>
        <Box
          sx={{
            margin: isMobile ? "" : "10px 0px",
          }}
        >
          {Object.keys(mainCategories).map((category, catIndex) => (
            <div key={catIndex} style={{ marginBottom: "20px" }}>
              {/* Display category title */}
              <h2>{category}</h2>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  margin: isMobile ? "" : "10px 0px",
                  padding: "8px 0px",
                }}
              >
                {groupedProducts[category].map((item, index) => (
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
                        image={
                          item?.image
                            ? `https://app.noutfermeture.com/api/${item?.image}`
                            : "/assets/images/default-img.png"
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
                              fontSize: "10px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item?.designation}
                          </Button>
                        </div>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </div>
            </div>
          ))}
          {Others && (
            <div style={{ marginBottom: "20px" }}>
              <h2>Others</h2>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  margin: isMobile ? "" : "10px 0px",
                  padding: "8px 0px",
                }}
              >
                {Others.map((item, index) => (
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
                        image={
                          item?.image
                            ? `https://app.noutfermeture.com/api/${item?.image}`
                            : "/assets/images/default-img.png"
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
                              fontSize: "10px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item?.designation}
                          </Button>
                        </div>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {allCombos && allCombos?.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h2>Combos</h2>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  margin: isMobile ? "" : "10px 0px",
                  padding: "8px 0px",
                }}
              >
                {allCombos.map((item, index) => (
                  <Card
                    sx={{
                      width: "299px",
                      margin: "10px",
                      backgroundColor: "transparent",
                      boxShadow: "none",
                    }}
                    key={index}
                    onClick={() => {
                      setSelectedCombo(item);
                    }}
                  >
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="250"
                        image={
                          item?.image
                            ? `https://app.noutfermeture.com/api/${item?.image}`
                            : "/assets/images/default-img.png"
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
                              fontSize: "10px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item?.name}
                          </Button>
                        </div>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Box>
      </Box>
    </>
  );
};

export default AllDesignation;

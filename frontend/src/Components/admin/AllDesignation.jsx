import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Button,
  useMediaQuery,
} from "@mui/material";
import { getAllDesignation } from "../../services/designation/getAllDesignation";
import { toast } from "react-toastify";
import UpdateDesignation from "./UpdateDesignation";
import AddDesignation from "./AddDesignation";

const AllDesignation = () => {
  const [allProducts, setAllProducts] = useState([]);
  //   const [page, setPage] = useState(1);
  //   const [pageSize, setPageSize] = useState(12);
  //   const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState();
  const [onUpdate, setOnUpdate] = useState(false);
  const isMobile = useMediaQuery("(max-width:800px)");
  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddModalOpen = () => {
    setIsAddModalOpen(true);
  };
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

    getProducts();
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
      <Box
        sx={{
          padding: "2px 15px",
        }}
      >
        <Button variant="contained" onClick={handleAddModalOpen}>
          Add Designation
        </Button>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            margin: isMobile ? "" : "10px 0px",
            padding: "8px 0px",
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
                  image={
                    item?.image
                      ? `https://app.noutfermeture.com/api/${item?.image}`
                      : "/assets/images/default-img.png"
                  }
                  //image={default_img}
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
      </Box>
    </>
  );
};

export default AllDesignation;

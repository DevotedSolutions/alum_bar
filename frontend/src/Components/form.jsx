// import React, { useEffect, useState } from 'react';
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// import Paper from '@mui/material/Paper';
// import Grid from '@mui/material/Grid';
// import Button from '@mui/material/Button';
// import { addProducts } from '../services/products/addProducts';
// import { getAllProducts } from '../services/products/getAllProducts';

// const FormPageData = () => {
//   const [productName, setProductName] = useState('');
//   const [productDescription, setProductDescription] = useState('');
//   const [quantity, setQuantity] = useState('');
//   const [productcode, setProductcode] = useState('');
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [data, setData] = useState([]);
//   const handleProductNameChange = (e) => {
//     setProductName(e.target.value);
//   };

//   const handleProductDescriptionChange = (e) => {
//     setProductDescription(e.target.value);
//   };

//   const handleQuantityChange = (e) => {
//     setQuantity(e.target.value);
//   };

//   const handleProductCodeChange = (e) => {
//     setProductcode(e.target.value);
//   };

//   const handleImageChange = (e) => {
//     const selectedImage = e.target.files[0];
//     setImage(selectedImage);

//     // Create a preview URL for the selected image
//     const imagePreviewURL = URL.createObjectURL(selectedImage);
//     setImagePreview(imagePreviewURL);
//   };

//   const handleSubmit =async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append('productName', productName);
//     formData.append('productDescription', productDescription);
//     formData.append('quantity', quantity);
//     formData.append('productcode', productcode);
//     formData.append('image', image);


//     // Now you can use the formData to send to the server or process as needed
//     console.log(formData);

//     let resp=await addProducts(formData);
//     console.log(resp);
//     // Clear form fields after submission
//     setProductName('');
//     setProductDescription('');
//     setQuantity('');
//     setProductcode('');
//     setImage(null);
//     setImagePreview(null);
//   };




// const getall= async()=>{
//     let resp=await getAllProducts()
//     console.log(resp.data.getdata);
//     setData([...data,resp.data.getdata])
    
//   }
// useEffect(()=>{
//     getall();
// },[])



















//   return (
//     <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//       <Box
//         component="form"
//         sx={{
//           '& > :not(style)': { margin: '0 auto', width: '80%', padding: '20px 10px', border: '1px solid black' },
//         }}
//         noValidate
//         enctype="multipart/form-data"
//         autoComplete="off"
//         onSubmit={handleSubmit}
//       >
//         <Grid container spacing={1}>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               id="productName"
//               label="Product Name"
//               variant="outlined"
//               value={productName}
//               onChange={handleProductNameChange}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               id="productDescription"
//               label="Product Description"
//               variant="outlined"
//               value={productDescription}
//               onChange={handleProductDescriptionChange}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               id="quantity"
//               label="Quantity"
//               variant="outlined"
//               value={quantity}
//               onChange={handleQuantityChange}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               id="productcode"
//               label="Product Code"
//               variant="outlined"
//               value={productcode}
//               onChange={handleProductCodeChange}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <input type="file" name="image" onChange={handleImageChange} />
//           </Grid>
//           {imagePreview && (
//             <Grid item xs={12}>
//               <img src={imagePreview} alt="ImagePreview" style={{ maxWidth: '50px', height: '50px' }} />
//             </Grid>
//           )}
//           <Grid item xs={12}>
//             <Button variant="contained" type="submit">
//               Submit
//             </Button>
//           </Grid>
//         </Grid>
//       </Box>

//       <div>
//         {data ? (data.map((item,i)=>{

// console.log(item,'iiiiii');
// return <div>
//   <img src={`http/image.jpg`} width="50px" height="50px"></img>
// </div>


//         })):<div>not found</div>}
//       </div>
//     </div>
//   );
// };

// export default FormPageData;

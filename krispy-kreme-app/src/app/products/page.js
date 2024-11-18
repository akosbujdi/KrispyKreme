'use client';
import Footer from "../templates/footer";
import {ThemeProvider} from "@mui/material/styles";
import Navbar from "../templates/navbar";
import Box from "@mui/material/Box";
import theme from '../theme';
import {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import {Card, Snackbar, CardContent, CardMedia, Grid} from "@mui/material";
import Button from "@mui/material/Button";
import {AddShoppingCart} from '@mui/icons-material';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [quantity, setQuantity] = useState({});
    const [cartVisible, setCartVisible] = useState(false);
    const [userID, setUserID] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                // Check the session
                const sessionRes = await fetch('/api/session');
                const sessionData = await sessionRes.json();

                if (sessionRes.ok) {
                    setUserID(sessionData._id);

                    // Check the cart if userID is available
                    const cartRes = await fetch(`/api/getBasket?userID=${sessionData._id}`);
                    const cartData = await cartRes.json();

                    if (cartRes.ok && cartData.length > 0) {
                        setCartVisible(true); // Show cart bar if there are items in the cart
                    }

                    // Fetch products
                    const productsRes = await fetch('api/getProducts');
                    const productsData = await productsRes.json();

                    setProducts(productsData);
                }
            } catch (error) {
                console.error("Error in fetching data:", error);
            }
        }

        fetchData();
    }, []);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };


    const handleAddToCart = async (productID) => {
        setQuantity(0);
        setOpenSnackbar(true);
        const product = products.find((p) => p._id === productID);
        const quantities = quantity[productID] || 1;

        setSnackbarMessage(`${quantities} x ${product.name} added`);

        const total = Math.round((product.price * quantities) * 100) / 100;

        // Send the data to the API
        const response = await fetch('/api/addToCart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID,
                productID: product._id,
                quantity: quantities,
                total: total, // Send the correct total price
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error adding to cart:', errorData.message);
        } else {
            const data = await response.json();
            console.log('Item added to cart:', data);
            setCartVisible(true);
        }

    };

    const handleViewCart = () => {
        // Redirect to cart page or handle cart view logic
        window.location.href = '/cart';
    };

    const handleIncrement = (id) => {
        setQuantity((prev) => ({
            ...prev,
            [id]: (prev[id] || 1) + 1,
        }));
    };

    const handleDecrement = (id) => {
        setQuantity((prev) => ({
            ...prev,
            [id]: Math.max((prev[id] || 1) - 1, 1), // Prevents negative values
        }));
    };

    return (<>
        <ThemeProvider theme={theme}>
            <Navbar/>
            {cartVisible && (
                <Box
                    sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        padding: '10px',
                        textAlign: 'center',
                        position: 'sticky',
                        top: 'auto',
                        zIndex: 1000,
                        boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    <Typography variant="h6" sx={{display: 'inline', marginRight: '20px'}}>
                        You have items in your cart!
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ color: 'white' }} // This sets the text color to white
                        onClick={handleViewCart}
                    >
                        View Cart
                    </Button>
                </Box>
            )}
            <Box
                sx={{
                    minHeight: '100vh',
                    padding: '20px',
                    backgroundColor: theme.palette.background.default,
                }}
            >
                <Grid container spacing={4}>
                    {products.map((product) => (
                        <Grid
                            item
                            key={product._id}
                            xs={12}
                            sm={6}
                            md={4}
                        >
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    backgroundColor: 'secondary.main',
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={product.path}
                                    alt={product.path}
                                    sx={{height: 300, width: 300, objectFit: "cover", margin: "0 auto"}}
                                />
                                <CardContent>
                                    <Typography variant="h6" gutterBottom color="black">
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="black">
                                        {product.description}
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            mb: 2,
                                            px: 8, // Adds 20px margin left and right
                                            marginTop: 2
                                        }}
                                    >
                                        <Typography variant="h6" sx={{fontWeight: 'bold', color: 'white'}}>
                                            €{product.price}
                                        </Typography>
                                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleDecrement(product._id)}
                                                sx={{
                                                    minWidth: '30px',
                                                    padding: '0',
                                                    backgroundColor: 'white',
                                                    color: 'black',
                                                    borderColor: 'black',
                                                    fontWeight: 600,
                                                    '&:hover': {backgroundColor: 'lightgray'},
                                                }}
                                            >
                                                -
                                            </Button>
                                            <Typography
                                                sx={{
                                                    mx: 1,
                                                    minWidth: '20px',
                                                    textAlign: 'center',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {quantity[product._id] || 1}
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleIncrement(product._id)}
                                                sx={{
                                                    minWidth: '30px',
                                                    padding: '0',
                                                    backgroundColor: 'white',
                                                    color: 'black',
                                                    fontWeight: 600,
                                                    borderColor: 'black',
                                                    '&:hover': {backgroundColor: 'lightgray'},
                                                }}
                                            >
                                                +
                                            </Button>
                                        </Box>
                                    </Box>
                                    {/* Add to Basket Button */}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{width: '100%', margin: '0'}}
                                        onClick={() => handleAddToCart(product._id)}
                                        startIcon={<AddShoppingCart />}
                                    >
                                        Add to Basket
                                    </Button>
                                    <Snackbar
                                        open={openSnackbar}
                                        autoHideDuration={3000} // Snackbar will hide after 3 seconds
                                        onClose={handleCloseSnackbar}
                                        message={snackbarMessage}
                                        action={
                                            <Button color="secondary" size="small" onClick={() => { window.location.href = "/cart"; }}>
                                                View Cart
                                            </Button>
                                        }
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Footer/>
        </ThemeProvider>
    </>);
};

export default Products;
'use client';
import Footer from "../templates/footer";
import {ThemeProvider} from "@mui/material/styles";
import Navbar from "../templates/navbar";
import Box from "@mui/material/Box";
import theme from '../theme';
import {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import {Card, CardContent, CardMedia, Grid} from "@mui/material";
import Button from "@mui/material/Button";

const Products = () => {
    const [products, setProducts] = useState([]);

    const [quantity, setQuantity] = useState({});

    const handleIncrement = (id) => {
        setQuantity((prev) => ({
            ...prev,
            [id]: (prev[id] || 0) + 1,
        }));
    };

    const handleDecrement = (id) => {
        setQuantity((prev) => ({
            ...prev,
            [id]: Math.max((prev[id] || 0) - 1, 0), // Prevents negative values
        }));
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('api/getProducts');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.log("Error fetching products:",error);
            }
        };
        fetchProducts();
    }, []);
    return (<>
        <ThemeProvider theme={theme}>
            <Navbar/>
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
                                    sx={{ height: 300, width:300, objectFit:"cover", margin:"0 auto" }}
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
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color:'white' }}>
                                            €{product.price}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                                                    fontWeight:600,
                                                    '&:hover': { backgroundColor: 'lightgray' },
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
                                                {quantity[product._id] || 0}
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
                                                    fontWeight:600,
                                                    borderColor: 'black',
                                                    '&:hover': { backgroundColor: 'lightgray' },
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
                                        sx={{ width: '100%', margin: '0' }}
                                        onClick={() => console.log('Add to Basket clicked')}
                                    >
                                        Add to Basket
                                    </Button>
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
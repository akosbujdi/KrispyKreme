'use client';

import Footer from "../templates/footer";
import { ThemeProvider } from "@mui/material/styles";
import Navbar from "../templates/navbar";
import Box from "@mui/material/Box";
import theme from '../theme';
import { useState, useEffect } from 'react';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    TableFooter
} from '@mui/material';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userID, setUserID] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                // Check the session
                const sessionRes = await fetch('/api/session');
                const sessionData = await sessionRes.json();

                if (sessionRes.ok && sessionData._id) {
                    setUserID(sessionData._id);

                    // Fetch cart items only if userID is available
                    const cartRes = await fetch(`/api/getBasket?userID=${sessionData._id}`);
                    const cartData = await cartRes.json();

                    if (cartRes.ok) {
                        setCartItems(cartData);
                    } else {
                        console.error('Error fetching cart items');
                    }
                }
            } catch (error) {
                console.error('An error occurred:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);


    const handleCheckout = () => {
        window.location.href = './';
    };

    const handleRemoveItem = async (productID) => {
        try {
            const response = await fetch(`/api/removeFromCart?userID=${userID}&productID=${productID}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Update the cart items after removing
                setCartItems(cartItems.filter(item => item.productID !== productID)); // Remove from UI
            } else {
                console.error('Failed to remove item from cart');
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Navbar />
            <Box sx={{ padding: '20px', minHeight:'100vh'}}>
                <Typography variant="h4" sx={{ marginBottom: '20px' }}>Your Cart</Typography>

                {loading ? (
                    <Typography>Loading cart items...</Typography>
                ) : (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650, backgroundColor:'#f5f5f5' }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell align="right">Quantity</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cartItems.length > 0 ? (
                                    cartItems.map((item) => (
                                        <TableRow key={item._id}>
                                            <TableCell component="th" scope="row">
                                                {item.productName} {/* Assuming the field is 'productName' */}
                                            </TableCell>
                                            <TableCell align="right">{item.quantity}</TableCell>
                                            <TableCell align="right">€{item.price}</TableCell>
                                            <TableCell align="right">€{Math.round((item.total)*100)/100}</TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    color="primary"
                                                    onClick={() => handleRemoveItem(item.productID)} // Call function to remove item
                                                >
                                                    Remove
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="right">
                                            <Typography variant="h6">Your cart is empty.</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={3} align="right">
                                        <Typography variant="h6">Total Price:</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="h6">
                                            €{cartItems.reduce((total, item) => total + item.total, 0).toFixed(2)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                )}

                <Box sx={{ marginTop: '20px', textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        fullWidth={true}
                        onClick={handleCheckout}
                        disabled={cartItems.length === 0}
                    >
                        Checkout
                    </Button>
                </Box>
            </Box>
            <Footer />
        </ThemeProvider>
    );
};

export default Cart;
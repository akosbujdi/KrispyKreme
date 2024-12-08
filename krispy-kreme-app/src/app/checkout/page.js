'use client'
import { useState, useEffect } from 'react';
import { Button, Box, TextField, Typography, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import Navbar from '../templates/navbar'; // Adjust path if needed
import Footer from '../templates/footer'; // Adjust path if needed
import {Alert} from "@mui/material";
import theme from '../theme';
import Stack from "@mui/material/Stack";
import * as React from "react";
import {useRouter} from 'next/navigation';

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [userEmail, setUserEmail] = useState('');
    const [userID, setUserID] = useState(''); // To store the userID
    const [paymentMethod, setPaymentMethod] = useState('creditCard');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');

    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            try {
                // Check the session
                const sessionRes = await fetch('/api/session');
                const sessionData = await sessionRes.json();

                if (sessionRes.ok && sessionData._id) {
                    // Set the user's ID and email
                    setUserID(sessionData._id);
                    setUserEmail(sessionData.email);

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
            }
        }

        fetchData();
    }, []); // Empty dependency array ensures this runs once on mount

    const handleSubmit = async () => {
        try {
            if (paymentMethod === 'creditCard') {
                const response = await fetch('/api/validateCard', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({cardNumber, expiryDate, cvv}),
                });

                const data = await response.json();

                if (!response.ok) {
                    setAlertMessage(data.message);
                    setAlertType('error');
                    return;
                }
                setAlertMessage('');
            }

            if (!address) {
                setAlertMessage("Shipping address is required");
                setAlertType('error')
                return;
            }

            if (!phone) {
                setAlertMessage("Mobile number is required")
                setAlertType('error')
                return;
            }

            const phoneRegex = /^[+]?[0-9]+$/;
            if (!phoneRegex.test(phone)) {
                setAlertMessage('Please enter valid phone number')
                setAlertType('error')
                return;
            }

            const orderData = {
                userID,
                userEmail,
                address,
                phone,
                paymentMethod,
            }
            const orderResponse = await fetch('/api/addToOrders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const orderResult = await orderResponse.json();

            if (!orderResponse.ok) {
                console.error('Error submitting order:', orderResult.message);
                setAlertMessage(orderResult.message || 'Failed to submit order.');
                setAlertType('error');
                return;
            }
            router.push('./confirm');

        } catch (error) {
            console.error('Error during order submission:', error);
            setAlertMessage("Error during order submission:");
            setAlertType("error");
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Navbar />
            <Box sx={{ minHeight:'100vh', maxWidth: '1500px', mx: 'auto', padding: '20px' }}>
                <Typography variant="h4" sx={{ marginBottom: '20px' }}>Checkout</Typography>

                <Box sx={{ marginBottom: '20px' }}>
                    <Typography sx={{mb:2}} variant="h6">Cart Summary</Typography>
                    <ul>
                        {cartItems.map(item => (
                            <li key={item.productID}>
                                {item.productName} x {item.quantity} - €{(item.price * item.quantity).toFixed(2)}
                            </li>
                        ))}
                    </ul>
                    <Typography variant="h6">Total Price: €{cartItems.reduce((total, item) => total + item.total, 0).toFixed(2)}</Typography>
                </Box>

                <Box sx={{ marginBottom: '20px' }}>
                    <Typography sx={{mb:2}} variant="h6">Your Information</Typography>
                    <TextField
                        label="Email Address"
                        value={userEmail}
                        fullWidth
                        sx={{ marginBottom: '20px' }}
                        disabled
                    />
                    <TextField
                        label="Shipping Address"
                        value={address}
                        type={'text'}
                        onChange={(e) => setAddress(e.target.value)}
                        fullWidth
                        sx={{ marginBottom: '20px' }}
                    />
                    <TextField
                        label="Mobile Number"
                        value={phone}
                        type={"tel"}
                        onChange={(e) => setPhone(e.target.value)}
                        fullWidth
                        sx={{marginBottom: '20px'}}
                    />
                </Box>

                <Box sx={{ marginBottom: '20px' }}>
                    <Typography variant="h6">Payment Method</Typography>
                    <FormControl>
                        <RadioGroup
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            row
                        >
                            <FormControlLabel value="creditCard" control={<Radio />} label="Credit Card" />
                            <FormControlLabel value="cashOnDelivery" control={<Radio />} label="Cash on Delivery" />
                        </RadioGroup>
                    </FormControl>
                    {paymentMethod === 'creditCard' && (
                        <Box>
                            <TextField
                                label="Card Number"
                                fullWidth
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                sx={{ marginBottom: '20px' }}
                                placeholder="1234 5678 9012 3456"
                            />
                            <TextField
                                label="Expiration Date"
                                fullWidth
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                sx={{ marginBottom: '20px' }}
                                placeholder="MM/YY"
                            />
                            <TextField
                                label="CVV"
                                fullWidth
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                placeholder="123"
                                type="password"
                            />
                        </Box>
                    )}
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                    {alertMessage && (
                        <Stack sx={{ width: '100%', mb: 2 }} spacing={2}>
                            <Alert severity={alertType} onClose={() => setAlertMessage('')}>
                                {alertMessage}
                            </Alert>
                        </Stack>
                    )}
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        onClick={handleSubmit}
                        fullWidth
                    >
                        Confirm Order
                    </Button>
                </Box>
            </Box>
            <Footer />
        </ThemeProvider>
    );
};

export default Checkout;

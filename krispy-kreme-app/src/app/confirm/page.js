'use client';
import { useState, useEffect } from 'react';
import Footer from "../templates/footer";
import { ThemeProvider } from "@mui/material/styles";
import Navbar from "../templates/navbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import theme from '../theme';
import Button from "@mui/material/Button";
import {useRouter} from 'next/navigation';

const Confirm = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const router = useRouter();

    useEffect(() => {
        async function fetchOrderDetails() {
            try {
                const response = await fetch('/api/getLastOrder');
                const data = await response.json();

                if (response.ok) {
                    setOrder(data);  // Assuming the data contains the latest order information
                } else {
                    setError(data.message || 'Error fetching order details');
                }
            } catch (err) {
                setError('Failed to fetch order details');
            } finally {
                setLoading(false);
            }
        }

        fetchOrderDetails();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const backToHomePage = () => {
        router.push('./');
    }

    return (
        <>
            <ThemeProvider theme={theme}>
                <Navbar/>
                <Box
                    sx={{
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundImage: 'url(/background.jpg)',
                        backgroundSize: 'cover',  // Ensures the background image covers the entire container
                        backgroundPosition: 'center',  // Centers the background image
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: 'secondary.main',
                            padding: '80px',
                            borderRadius: '12px',
                            maxWidth: '800px',
                            textAlign: 'center',
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.6)'
                        }}
                    >
                    <Typography variant="h4" gutterBottom color={'white'}>
                        Thank you for your order!
                    </Typography>
                    <Typography variant="h6" color={'white'}>
                        Your order number: <strong>{order._id}</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 2 }} color={'white'}>
                        An email has been sent to <strong>{order.userEmail}</strong> regarding delivery information.
                    </Typography>
                        <Button variant="contained" onClick={backToHomePage} fullWidth sx={{backgroundColor:'primary.main'}}>Back to home page</Button>
                    </Box>
                </Box>
                <Footer />
            </ThemeProvider>
        </>
    );
};

export default Confirm;
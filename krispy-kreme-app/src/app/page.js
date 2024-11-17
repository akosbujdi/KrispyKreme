'use client'
import Navbar from './/templates/navbar';
import Footer from './/templates/footer';
import {Grid} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {ThemeProvider} from '@mui/material/styles';
import theme from './theme';
import Button from "@mui/material/Button";
import {useEffect, useState} from "react";

const HomePage = () => {

    const [username, setUsername] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        async function checkSession() {
            const res = await fetch('/api/session');
            const data = await res.json();

            if (res.ok) {
                setRole(data.role);
                setUsername(data.username);
                // alert(`User logged in as: ${data.email}, Username: ${data.username}, Role: ${data.role}`);
            }
        }

        checkSession();
    }, []);

    return (
        <>
            <ThemeProvider theme={theme}>
            <Navbar/>
            <Box sx={{ width: '100%', maxWidth: '1500px', mx: 'auto', mt: 2, mb: 2, px:{xs:2,sm:3}}}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                p: 3,
                                borderRadius: '8px',
                                backgroundColor: 'secondary.main',
                                color: 'white',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                            }}
                        >
                            {/* Heading */}
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                About Us
                            </Typography>

                            {/* Line under the heading */}
                            <Box sx={{ width: '50%', borderBottom: '2px solid white', my: 2 }} />

                            {/* Description */}
                            <Typography sx={{ fontSize: '1.1rem' }}>
                                We are Krispy Kreme, dedicated to serving the best donuts and coffee to satisfy your sweet cravings!
                            </Typography>

                            {/* Another Line */}
                            <Box sx={{ width: '50%', borderBottom: '2px solid white', my: 2 }} />

                            {/* Button to Products Page */}
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, color: 'white' }}
                                href="/products" // Replace this with the actual path once the products page exists
                            >Check Out Our Products
                            </Button>
                            {role === 'admin' && (
                                <Box sx={{ textAlign: 'center', width: '100%'}}>
                                    <Box sx={{ width: '50%', borderBottom: '2px solid white', my: 2, mx: 'auto', mt:5}} />
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Hello, {username}</Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 3, color: 'white' }}
                                        href="/dashboard" // Replace this with the actual path once the products page exists
                                    >Admin dashboard
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                position: 'relative',
                                height: {xs: 'auto', md:'100vh'},
                                borderRadius: '8px',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundImage: 'url(/background.jpg)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                paddingTop: '5rem',
                                paddingBottom: '5rem'
                            }}
                        >
                            <Typography
                                variant="h3" // Larger font size
                                sx={{
                                    color: 'white',
                                    textShadow: '3px 3px 8px rgba(0, 0, 0, 1)', // Adding shadow for better readability
                                    fontWeight: 700, // Makes it bold for better emphasis
                                    textAlign: 'center',
                                    zIndex: 1, // Ensures the text is on top of the image
                                    padding: '1rem', // Adds padding around the text
                                    width: '100%', // Ensure text does not overflow
                                }}
                            >
                                Krispy Kreme
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Footer/>
            </ThemeProvider>
        </>
    );
};

export default HomePage;
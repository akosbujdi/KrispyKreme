// templates/footer.js
import React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';

const Footer = () => {
    return (
        <Box
            sx={{
                backgroundColor: 'primary.main', // Use primary color from the theme
                color: 'white',
                padding: 2,
                boxShadow: '0px -2px 5px rgba(0, 0, 0, 0.2)', // Shadow at the top of the footer
                textAlign: 'center',
                position: 'relative', // Ensure footer sticks to bottom
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: { xs: 'column', md: 'row' }, // Stack elements on small screens
                }}
            >
                <Typography variant="body1">
                    © {new Date().getFullYear()} Krispy Kreme. All rights reserved.
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        flexDirection: { xs: 'column', md: 'row' }, // Stack links on small screens
                    }}
                >
                    <Link href="#" color="inherit">
                        Privacy Policy
                    </Link>
                    <Link href="#" color="inherit">
                        Terms of Service
                    </Link>
                    <Link href="#" color="inherit">
                        Contact Us
                    </Link>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;

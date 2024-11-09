'use client'
import Navbar from './/templates/navbar';
import { Container, Typography } from '@mui/material';

const HomePage = () => {
    return (
        <>
            <Navbar />
            <Container>
                <Typography variant="h4">Welcome to My Website</Typography>
                <p>This is a Krispy Kreme website!</p>
            </Container>
        </>
    );
};

export default HomePage;
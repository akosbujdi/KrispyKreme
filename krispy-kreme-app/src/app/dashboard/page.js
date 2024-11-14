'use client';
import Footer from "../templates/footer";
import {ThemeProvider} from "@mui/material/styles";
import Navbar from "../templates/navbar";
import Box from "@mui/material/Box";
import theme from '../theme';

const Dashboard = () => {
    return (<>
        <ThemeProvider theme={theme}>
            <Navbar/>
            <Box
                sx={{
                    height: '100vh'
                }}
            ></Box>
            <Footer/>
        </ThemeProvider>
    </>);
};

export default Dashboard;
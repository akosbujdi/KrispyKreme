import * as React from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Image from 'next/image';
import {ThemeProvider} from '@mui/material/styles';
import theme from '../theme';
import PersonIcon from "@mui/icons-material/Person";
import {useRouter} from 'next/navigation';
import {useEffect, useState} from "react";

const pages = ['About', 'Products'];
const settings = ['Logout'];

function Navbar() {
    const [role, setRole] = useState(null);  // Track the user's role
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const router = useRouter();

    useEffect(() => {
        async function checkSession() {
            const res = await fetch('/api/session');
            const data = await res.json();

            if (res.ok) {
                setRole(data.role);
                // alert(`User logged in as: ${data.email}, Role: ${data.role}`);
            } else {
                // No valid session, redirect to login page
                router.push('/login');
            }
        }

        checkSession();
    }, []);

    const pagesWithDashboard = role === 'admin' ? [...pages, 'Dashboard'] : pages;

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = async () => {

        document.cookie = "session=; max-age=0; path=/;";

        // Make a request to clear the session on the server-side
        await fetch('/api/session', {method: 'DELETE'});

        // Redirect to the login page
        router.push('/login');
    };
    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Image src="/logo.png" alt={"logo"} width={110} height={0} className={"navbar-logo"}
                               style={{height: 'auto', maxWidth: '100%', marginRight: '.3rem'}} priority></Image>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="./"
                            sx={{
                                mr: 2,
                                display: {xs: 'none', md: 'flex'},
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.2rem',
                                color: 'white',
                                textDecoration: 'none',
                            }}
                        >
                            Krispy Kreme
                        </Typography>

                        <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon sx={{color: 'white'}}/>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom', horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top', horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{display: {xs: 'block', md: 'none'}}}
                            >
                                {pagesWithDashboard.map((page) => (<MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography sx={{textAlign: 'center'}}>{page}</Typography>
                                </MenuItem>))}
                            </Menu>
                        </Box>
                        <Image src="/logo.png" alt={"logo"} width={90} height={0} className={"sm-navbar-logo"}
                               style={{height: 'auto', maxWidth: '100%', marginRight: '.3rem'}} priority></Image>
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="./"
                            sx={{
                                mr: 2,
                                display: {xs: 'flex', md: 'none'},
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.2rem',
                                color: 'white',
                                textDecoration: 'none',
                            }}
                        >
                            Krispy Kreme
                        </Typography>
                        <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                            {pagesWithDashboard.map((page) => (<Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                                {page}
                            </Button>))}
                        </Box>
                        <Box sx={{flexGrow: 0}}>
                            <Tooltip title="Open user settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                    <PersonIcon sx={{fontSize: 30, color: 'white'}}/>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{mt: '45px'}}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top', horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top', horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (<MenuItem key={setting}
                                                                      onClick={setting === 'Logout' ? handleLogout : handleCloseUserMenu}>
                                    <Typography sx={{textAlign: 'center'}}>{setting}</Typography>
                                </MenuItem>))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider>);
}

export default Navbar;
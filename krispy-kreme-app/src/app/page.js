'use client';
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

export default function Home() {
    return (
        <Container maxWidth="sm">
            <Box sx={{height: '100vh'}}>
                <Box component="form" noValidate sx={{mt: 1}}>
                    <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus/>
                    <TextField margin="normal" required fullWidth name="pass" label="Pass" type="pass" id="pass" autoComplete="current-password"/>
                    <FormControlLabel control={<Checkbox value="remember" color="primary"/>} label="Remember me"/>
                    <Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}}>Sign In</Button>
                </Box>
            </Box>
        </Container>
    ); // end return
}

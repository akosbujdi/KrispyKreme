'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import {styled} from '@mui/material/styles';
import {Alert} from "@mui/material";
import {useState} from 'react';
import validator from "validator";

const Card = styled(MuiCard)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignUpContainer = styled(Stack)(({theme}) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

export default function SignUp() {
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [usernameError, setUsernameError] = React.useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [confPasswordError, setConfPasswordError] = React.useState('');
    const [confPasswordErrorMessage, setConfPasswordErrorMessage] = React.useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (emailError || usernameError || passwordError || confPasswordError) {
            return;
        }
        const data = new FormData(event.currentTarget);
        let email = data.get('email');
        let username = data.get('username');
        let password = data.get('password');

        const url = `/api/register?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

        fetch(url)
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) {
                    setAlertMessage(data.message);
                    setAlertType('error');
                    return;
                }
                window.location.href = './login';

            })
            .catch((error) => {
                console.error('Error during registration:', error.message);
                setAlertMessage('Something went wrong. Please try again.');
                setAlertType('error');
            })
    };


    const validateInputs = () => {
        const email = document.getElementById('email');
        const username = document.getElementById('username');
        const password = document.getElementById('password');
        const confPassword = document.getElementById('confPassword');

        email.value = email.value.trim();
        username.value = username.value.trim();
        password.value = password.value.trim();
        confPassword.value = confPassword.value.trim();

        let isValid = true;

        if (!validator.isEmail(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        const userRegex = /^[a-zA-Z0-9_-]+$/;
        if (!validator.isLength(username.value, {min: 3, max: 16}) || !userRegex.test(username.value)) {
            setUsernameError(true);
            setUsernameErrorMessage("Username must be 3-16 characters, letters, numbers, underscores, and dashes only");
            isValid = false;
        } else {
            setUsernameError(false);
            setUsernameErrorMessage('');
        }

        if (!validator.isStrongPassword(password.value, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1,
            minNumbers: 1
        })) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        if (confPassword.value !== password.value) {
            setConfPasswordError(true);
            setConfPasswordErrorMessage("Passwords do not match!");
            isValid = false;
        } else {
            setConfPasswordError(false);
            setConfPasswordErrorMessage('');
        }

        return isValid;
    };

    return (
        <>
            <CssBaseline enableColorScheme/>
            <SignUpContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    {alertMessage && (
                        <Stack sx={{ width: '100%', mb: 2 }} spacing={2}>
                            <Alert severity={alertType} onClose={() => setAlertMessage('')}>
                                {alertMessage}
                            </Alert>
                        </Stack>
                    )}
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
                    >
                        Sign up
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 2,
                        }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <TextField
                                error={emailError}
                                helperText={emailErrorMessage}
                                id="email"
                                type="email"
                                name="email"
                                placeholder="your@email.com"
                                autoComplete="email"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={emailError ? 'error' : 'primary'}
                                sx={{ariaLabel: 'email'}}
                                inputProps={{maxLength:40}}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="username">Username</FormLabel>
                            <TextField
                                error={usernameError}
                                helperText={usernameErrorMessage}
                                id="username"
                                type="text"
                                name="username"
                                placeholder="username"
                                autoComplete="username"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={emailError ? 'error' : 'primary'}
                                sx={{ariaLabel: 'username'}}
                                inputProps={{maxLength:30}}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                name="password"
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={passwordError ? 'error' : 'primary'}
                                inputProps={{maxLength:30}}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="confPassword">Confirm Password</FormLabel>
                            <TextField
                                error={confPasswordError}
                                helperText={confPasswordErrorMessage}
                                name="confPassword"
                                placeholder="••••••"
                                type="password"
                                id="confPassword"
                                autoComplete="current-password"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={confPasswordError ? 'error' : 'primary'}
                                inputProps={{maxLength:30}}
                            />
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={validateInputs}
                        >
                            Sign up
                        </Button>
                        <Typography sx={{textAlign: 'center'}}>
                            Already have an account?{' '}
                            <span>
                <Link
                    href=".//login"
                    variant="body2"
                    sx={{alignSelf: 'center'}}
                >
                  Sign in
                </Link>
              </span>
                        </Typography>
                    </Box>
                </Card>
            </SignUpContainer>
        </>
    );
}
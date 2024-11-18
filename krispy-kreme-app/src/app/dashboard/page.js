'use client'
import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Navbar from '../templates/navbar';
import Footer from '../templates/footer';
import theme from '../theme';

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch orders from the API
    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/getOrders'); // Replace with your actual API endpoint
            const data = await response.json();
            setOrders(data.orders); // Assuming the API response structure is { orders: [...] }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Navbar />
            <Box sx={{ padding: '20px', minHeight: '100vh', maxWidth: '1500px', mx: 'auto' }}>
                <Typography variant="h4" sx={{ marginBottom: '20px' }}>Admin Dashboard</Typography>

                {loading ? (
                    <Typography>Loading orders...</Typography>
                ) : (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650, backgroundColor: '#f5f5f5' }} aria-label="orders table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>User Email</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Payment Method</TableCell>
                                    <TableCell>Total Amount</TableCell>
                                    <TableCell>Order Date</TableCell>
                                    <TableCell>Items</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.length > 0 ? (
                                    orders.map((order) => (
                                        <TableRow key={`order-${order._id}`}>
                                            <TableCell>{order._id}</TableCell>
                                            <TableCell>{order.userEmail}</TableCell>
                                            <TableCell>{order.address}</TableCell>
                                            <TableCell>{order.phone}</TableCell>
                                            <TableCell>{order.paymentMethod}</TableCell>
                                            <TableCell>€{order.totalAmount.toFixed(2)}</TableCell>
                                            <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                                            <TableCell>
                                                {Array.isArray(order.items) && order.items.length > 0 ? (
                                                    <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
                                                        {order.items.map((item, index) => (
                                                            <li key={`item-${order._id}-${item.productID}-${index}`}>
                                                                Product ID: {item.productID}, Quantity: {item.quantity}, Total: €{item.total.toFixed(2)}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <Typography>No items found</Typography>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            <Typography variant="h6">No orders found.</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
            <Footer />
        </ThemeProvider>
    );
};

export default Dashboard;
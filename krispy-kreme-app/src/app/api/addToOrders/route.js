// /src/app/api/addToOrders/route.js
import clientPromise from "../../lib/mongodb";
import {verifySession} from "../../lib/session";
import {parse} from 'cookie';
import sgMail from "@sendgrid/mail";
import {ObjectId} from "mongodb";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
    try {
        // Parse cookies from the request headers
        const cookies = parse(req.headers.get('cookie') || '');
        const token = cookies.session;

        if (!token) {
            return new Response(JSON.stringify({message: 'Unauthorized: No session token found.'}), {status: 401});
        }

        // Verify the session token
        const session = verifySession(token);

        if (!session) {
            return new Response(JSON.stringify({message: 'Unauthorized: Invalid session token.'}), {status: 401});
        }

        const {_id: userID, email: userEmail} = session;
        const body = await req.json();
        const {address, phone, paymentMethod} = body;

        if (!address || !phone) {
            return new Response(JSON.stringify({message: 'Missing required order information.'}), {status: 400});
        }

        // Connect to MongoDB using clientPromise
        const client = await clientPromise;
        const db = client.db('krispy-kreme');
        const cartItems = await db.collection('cart').find({userID}).toArray();
        const productsCollection = db.collection('products');

        if (!cartItems.length) {
            return new Response(JSON.stringify({message: 'Cart is empty.'}), {status: 404});
        }

        // Construct the order items array (multidimensional array)
        const items = cartItems.map(item => ({
            productID: item.productID,
            quantity: item.quantity,
            total: item.total,
        }));

        const productIDs = cartItems.map(item => new ObjectId(item.productID)); // Convert to ObjectId

        const products = await productsCollection.find({_id: {$in: productIDs}}).toArray();

        const itemsWithNames = items.map(item => {
            const product = products.find(p => p._id.toString() === item.productID);

            return {
                ...item,
                productName: product?.name || 'Unknown Product',
            };
        });

        // Calculate the total amount for the entire order
        const totalAmount = cartItems.reduce((total, item) => total + item.total, 0);

        // Prepare order data
        const orderData = {
            userID,
            userEmail,
            address,
            phone,
            paymentMethod,
            items,
            totalAmount,
            createdAt: new Date(),
        };

        // Insert the order into the orders collection
        const result = await db.collection('orders').insertOne(orderData);

        if (!result.acknowledged) {
            return new Response(JSON.stringify({message: 'Failed to create order.'}), {status: 500});
        }


        // Clear the user's cart after order submission
        await db.collection('cart').deleteMany({userID});


        const msg = {
            to: userEmail, // User email from the checkout form
            from: 'b00153898@mytudublin.ie', // Verified sender email
            subject: `Order Confirmation #${result.insertedId}`,
            text: `Thank you for your order! Your order number is #${result.insertedId}. We have sent an email to you with the delivery details.`,
            html: `
              <strong>Thank you for your order!</strong><br><br> 
              Your order number is #${result.insertedId}.<br><br>
              
              <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsWithNames.map(item => `
                    <tr>
                      <td style="text-align: center">${item.productName}</td>
                      <td style="text-align: center">${item.quantity}</td>
                      <td style="text-align: center">€${item.total}</td>
                    </tr>
                  `).join('')}
                  <tr>
                    <td colspan="2" style="text-align: right; font-weight: bold;">Final Total:</td>
                    <td style="font-weight: bold; text-align: center;">€${totalAmount}</td>
                  </tr>
                </tbody>
              </table><br>
              
              <strong>Shipping Information:</strong><br>
              <strong>Address:</strong> ${address}<br>
              <strong>Phone Number:</strong> ${phone}<br><br>
              
              We will contact you once your delivery is on the way. Your estimated arrival time is 30-45 minutes.<br>
              Thank you for choosing us! If you have any questions, feel free to reach out.<br>
              Enjoy your delicious order!
            `
        };

        try {
            // Send the email with SendGrid
            await sgMail.send(msg);
        } catch (error) {
            // Log detailed error information to the console
            console.error('SendGrid error:', error.response ? error.response.body : error.message);

            // Return an appropriate error response to the client
            return new Response(
                JSON.stringify({
                    error: 'Failed to send email',
                    message: error.response ? error.response.body : error.message
                }),
                {status: 500}
            );
        }

        return new Response(JSON.stringify({
            message: 'Order placed successfully.',
            orderID: result.insertedId
        }), {status: 201});
    } catch (error) {
        console.error('Error creating order:', error);
        return new Response(JSON.stringify({message: 'Internal server error.'}), {status: 500});
    }
}

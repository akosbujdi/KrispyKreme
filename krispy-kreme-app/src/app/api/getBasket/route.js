import clientPromise from '../../lib/mongodb';
import {ObjectId} from "mongodb";

export async function GET(req) {
    const {searchParams} = new URL(req.url);
    const userID = searchParams.get('userID');
    // console.log('Received userId:', userID);

    if (!userID) {
        return new Response('User ID is required', {status: 400});
    }

    try {
        const client = await clientPromise;
        const db = client.db('krispy-kreme');
        const cartCollection = db.collection('cart');
        const productsCollection = db.collection('products');

        // Find all cart items for the given userId
        const cartItems = await cartCollection.find({userID}).toArray();

        if (cartItems.length === 0) {
            return new Response(JSON.stringify([]), {status: 200}); // No items in cart
        }

        const productIDs = cartItems.map(item => new ObjectId(item.productID)); // Convert to ObjectId

        const products = await productsCollection.find({_id: {$in: productIDs}}).toArray();

        const cartWithDetails = cartItems.map(cartItem => {
            const product = products.find(p => p._id.toString() === cartItem.productID);

            return {
                ...cartItem,
                productName: product?.name || 'Unknown Product',
                price: product?.price || 0,
                total: (product?.price || 0) * cartItem.quantity,
            };
        });

        return new Response(JSON.stringify(cartWithDetails), {status: 200});
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return new Response('Error fetching cart items', {status: 500});
    }
}
import clientPromise from '../../lib/mongodb';

export async function GET(req) {
    const {searchParams} = new URL(req.url);
    const userID = searchParams.get('userID');
    console.log('Received userId:', userID);

    if (!userID) {
        return new Response('User ID is required', { status: 400 });
    }

    try {
        const client = await clientPromise;
        const db = client.db('krispy-kreme');
        const collection = db.collection('cart');

        // Find all cart items for the given userId
        const cartItems = await collection.find({ userID }).toArray();
        console.log("Cart items : ",JSON.stringify(cartItems));

        if (cartItems.length === 0) {
            return new Response(JSON.stringify([]), { status: 200 }); // No items in cart
        }

        return new Response(JSON.stringify(cartItems), { status: 200 });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return new Response('Error fetching cart items', { status: 500 });
    }
}
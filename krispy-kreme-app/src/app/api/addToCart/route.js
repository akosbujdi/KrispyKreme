import clientPromise from "../../lib/mongodb";

export async function POST(req) {
    const { userID, productID, quantity, total } = await req.json();

    // console.log('Received data:', { userID, productId, quantity, total });

    if (!userID || !productID || !quantity || !total) {
        console.error('Missing required fields');
        return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
    }

    try {
        const client = await clientPromise;
        const db = client.db('krispy-kreme');  // Use the appropriate database
        const collection = db.collection('cart');  // Change to your cart collection name

        const result = await collection.insertOne({
            userID,
            productID,
            quantity,
            total,
            addedAt: new Date(),
        });

        console.log('Item added to cart:', result);
        return new Response(JSON.stringify({ message: 'Item added to cart', item: result }), { status: 200 });
    } catch (error) {
        console.error('Error adding to cart:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}
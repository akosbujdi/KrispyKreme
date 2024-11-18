import clientPromise from '../../lib/mongodb';

export async function GET(req) {
    try {
        const client = await clientPromise;
        const db = client.db('krispy-kreme'); // Your MongoDB database name
        const orders = await db.collection('orders').find({}).toArray();

        // Return a JSON response with status 200
        return new Response(JSON.stringify({ orders }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Failed to fetch orders:', error);

        // Return a JSON response with status 500 on error
        return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
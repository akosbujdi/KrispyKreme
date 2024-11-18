import clientPromise from "../../lib/mongodb";
import {verifySession} from "../../lib/session";
import {parse} from 'cookie';

export async function GET(req) {
    try {
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

        const {_id: userID} = session;

        const client = await clientPromise;
        const db = client.db('krispy-kreme');
        const ordersCollection = db.collection('orders');

        // Fetch the most recent order for the logged-in user, sorted by date descending
        const latestOrder = await ordersCollection.find({userID})
            .sort({createdAt: -1})
            .limit(1)
            .toArray();

        if (latestOrder.length === 0) {
            return new Response(JSON.stringify({message: 'No orders found.'}), {status: 404});
        }

        return new Response(JSON.stringify(latestOrder[0]), {status: 200});
    } catch (error) {
        console.error('Error fetching last order:', error);
        return new Response(JSON.stringify({message: 'Internal Server Error'}), {status: 500});
    }
}
// app/api/register/route.js
import clientPromise from '../../lib/mongodb';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        const password = searchParams.get('password');

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('krispy-kreme'); // Replace with your database name
        const collection = db.collection('users');

        // Insert user data into the "users" collection
        const result = await collection.insertOne({ email, password });

        console.log('User inserted:', result);

        // Return success response
        return Response.json({ data: 'valid' });
    } catch (error) {
        console.error('Error inserting user:', error);
        return Response.json({ data: 'error' });
    }
}

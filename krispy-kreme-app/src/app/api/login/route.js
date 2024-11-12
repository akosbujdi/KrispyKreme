import clientPromise from '../../lib/mongodb';
import {NextResponse} from "next/server";
import bcrypt from 'bcrypt';
import {createSession, verifySession} from "@/app/lib/session";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

export async function GET(req) {
    try {
        const {searchParams} = new URL(req.url);
        const email = searchParams.get('email');
        const password = searchParams.get('password');

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('krispy-kreme'); // Replace with your database name
        const collection = db.collection('users');

        // Check if email already exists
        const existingUser = await collection.findOne({email});
        if (!existingUser) {
            return NextResponse.json({message: 'User not found.'}, {status: 404});
        }

        // Verify password (compare)
        const passwordMatches = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatches) {
            return NextResponse.json({message: 'Invalid password.'}, {status: 401});
        }

        const sessionToken = createSession(existingUser);

        // Successful login
        const response = NextResponse.json({message: 'User logged in successfully.'}, {status: 200});
        response.cookies.set('session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600,
            path: '/',
        });
        return response;
    } catch (error) {
        console.error('Error in user login:', error);
        return NextResponse.json({message: 'Internal server error.'}, {status: 500});
    }
}

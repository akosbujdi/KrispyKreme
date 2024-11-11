// app/api/register/route.js
import clientPromise from '../../lib/mongodb';
import {NextResponse} from "next/server";
import bcrypt from 'bcrypt';

export async function GET(req) {
    try {
        const {searchParams} = new URL(req.url);
        const email = searchParams.get('email');
        const password = searchParams.get('password');

        // Email validation
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({message: 'Invalid email format.'}, {status: 400});
        }

        // Password validation
        if (password.length < 6) {
            return NextResponse.json({message: 'Password must be at least 6 characters long.'}, {status: 400});
        }

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('krispy-kreme'); // Replace with your database name
        const collection = db.collection('users');

        // Check if email already exists
        const existingUser = await collection.findOne({email});
        if (existingUser) {
            return NextResponse.json({message: 'User already exists.'}, {status: 409});
        }

        // Hash pass using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user data into the "users" collection
        const result = await collection.insertOne({
            email,
            password: hashedPassword,
            role: "user",
        });

        console.log('User inserted:', result);

        // Return success response
        return NextResponse.json({message: 'User registered successfully.'}, {status: 201});
    } catch (error) {
        console.error('Error inserting user:', error);
        return NextResponse.json({message: 'Internal server error.'}, {status: 500});
    }
}

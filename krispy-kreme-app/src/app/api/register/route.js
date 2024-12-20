// app/api/register/route.js
import clientPromise from '../../lib/mongodb';
import {NextResponse} from "next/server";
import bcrypt from 'bcrypt';
import escapeHtml from "escape-html";
import validator from "validator";

export async function GET(req) {
    try {
        const {searchParams} = new URL(req.url);
        const email = escapeHtml(searchParams.get('email')?.trim() || '');
        const password = escapeHtml(searchParams.get('password')?.trim() || '');
        const username = escapeHtml(searchParams.get('username')?.trim() || '');

        console.log('email:', email);
        console.log('password:', password);
        console.log('username:', username);

        if (!validator.isEmail(email)) {
            return NextResponse.json({message: 'Invalid email format.'}, {status: 400});
        }

        const userRegex = /^[a-zA-Z0-9_-]+$/;
        if (!validator.isLength(username, {min: 3, max: 16}) || !userRegex.test(username)) {
            return NextResponse.json({message: 'Username must be 3-16 characters, letters, numbers, underscores, and dashes only.'}, {status: 400});
        }

        // Password validation
        if (!validator.isStrongPassword(password, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1,
            minNumbers: 1
        })) {
            return NextResponse.json({message: 'Password must be at least 6 characters long, contain at least one lowercase letter, one uppercase letter, one symbol, and one number.'}, {status: 400});
        }

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('krispy-kreme'); // Replace with your database name
        const collection = db.collection('users');

        // Check if email already exists
        const existingEmail = await collection.findOne({email});
        if (existingEmail) {
            return NextResponse.json({message: 'Email already exists.'}, {status: 409});
        }

        // Check if username already exists
        const existingUsername = await collection.findOne({username});
        if (existingUsername) {
            return NextResponse.json({message: 'Username already exists.'}, {status: 409});
        }

        // Hash pass using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user data into the "users" collection
        const result = await collection.insertOne({
            email,
            username,
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

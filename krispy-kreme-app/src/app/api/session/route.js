import { NextResponse } from 'next/server';
import { verifySession } from '../../lib/session';

export async function GET(req) {
    const token = req.cookies.get('session')?.value;

    if (!token) {
        console.error('No session token found');
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = verifySession(token);

    if (!user) {
        console.error('Session verification failed');
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ _id: user._id, email: user.email, username: user.username, role: user.role });
}

export async function DELETE() {
    // Create the response
    const response = NextResponse.json({ message: 'Logged out successfully' });

    // Set the session cookie to expire (deleting it)
    response.cookies.set('session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 0,  // Setting maxAge to 0 deletes the cookie
        path: '/'    // Ensure the path matches the path used when setting the cookie
    });

    return response;
}

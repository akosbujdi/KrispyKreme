import {sign, verify} from 'jsonwebtoken';
import cookie from 'cookie';

const SECRET_KEY = process.env.SECRET_KEY;

export function createSession(user) {
    const {_id, email, username, role} = user;
    return sign({_id, email, username, role}, SECRET_KEY, {expiresIn: '1h'});
}

export function verifySession(token) {
    try {
        return verify(token, SECRET_KEY);
    } catch (error) {
        console.error('Invalid session token', error);
        return null;
    }
}
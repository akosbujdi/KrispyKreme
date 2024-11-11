import {sign, verify} from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY;

export function createSession(user) {
    const {_id,username,role} = user;
    const token = sign({_id,username,role},SECRET_KEY,{expiresIn: '1h'});
    return token;
}

export function verifySession(user) {
    try {
        return verify(token, SECRET_KEY);
    } catch (error) {
        console.error('Invalid session token',error);
        return null;
    }
}

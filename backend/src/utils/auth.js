import jwt from 'jsonwebtoken';
import { ApiError } from './error.js';

const generateAccessToken = (payload) => {
    console.log(process.env.JWT_SECRET, process.env.JWT_EXPIRATION);
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
}


const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

const middlewareAuth = (req, res, next) => {

    // TODO: sử lý đăng nhập ở đây
    // const token = req.cookies.access_token;
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token)

    if (!token) {
        throw new ApiError('Access denied', 401);
    }
    try {
        verifyAccessToken(token);
        req.is_admin = true
        next();
    } catch (error) {
        throw new ApiError('Invalid access token', 401);
    }

};
export default { generateAccessToken, verifyAccessToken, middlewareAuth };

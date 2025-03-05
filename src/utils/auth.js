import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};
const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const middlewareAuth = (req, res, next) => {
  // C1: luu token vao trong accesstoken
  const token = req.cookies.access_token;
  // c2: luu token vao vao
  // const token = req.headers['authorization'].split('')[1];

  if (!token) {
    return res.status(401).json('Access denied');
  }
  try {
    const user = verifyAccessToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json('Invalid access token');
  }
};
export default { generateAccessToken, verifyAccessToken, middlewareAuth };

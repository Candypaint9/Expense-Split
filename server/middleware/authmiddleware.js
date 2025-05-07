import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;


export function authenticateToken(req, res, next) {
  const token = req.cookies.jwtcookie;
  if (!token) {
    // not logged in
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;    // { userId, email, iat, exp }
    // console.log(token);
    next();
  } catch (err) {
    // invalid / expired
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
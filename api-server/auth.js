// npm install jsonwebtoken

const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;

function generateToken(userId) {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '2h' });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

function authenticate(req, res, next) {
  const token = req.cookies?.authToken;
  if (!token) return res.status(401).send('Not authenticated');

  try {
    const payload = verifyToken(token);
    req.user = payload; // attach user info
    next();
  } catch (err) {
    return res.status(403).send('Invalid or expired token');
  }
}

module.exports = { generateToken, verifyToken, authenticate };

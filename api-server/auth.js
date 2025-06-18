// npm install jsonwebtoken

const jwt = require('jsonwebtoken');
const fs = require('fs');

const SECRET_KEY = process.env.JWT_SECRET;

function generateToken(userId, userType) {
  return jwt.sign({ userId, userType }, SECRET_KEY, { expiresIn: '2h' });
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

// Reusable file read/write helpers
function readFromFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(filePath, 'utf8');
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeToFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function isAdmin(req, res, next) {
  if (req.user && req.user.userType === 'admin') {
    next();
  } else {
    res.status(403).send("Accès refusé : admin requis");
  }
}

module.exports = { generateToken, verifyToken, authenticate, isAdmin, writeToFile, readFromFile };

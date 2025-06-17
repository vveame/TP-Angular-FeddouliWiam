// npm install cookie-parser

require('dotenv').config();
const express = require("express");
const cookieParser = require('cookie-parser');
const { generateToken, authenticate } = require('./auth');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto');


const app = express();
const port = 3000;

const usersFilePath = path.join(__dirname, 'db', 'users.json');
const productsFilePath = path.join(__dirname, 'db', 'products.json');

const corsOptions = {
  origin: 'http://localhost:4200', // your Angular app origin
  credentials: true,               // allow cookies & credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // allowed headers
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());

let baseImageUrl = "assets/images/";

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

// Products API

// GET all products
app.get("/api/products", (req, res) => {
  const products = readFromFile(productsFilePath);
  res.send(products);
});

// GET single product by ID
app.get("/api/products/:id", (req, res) => {
  const products = readFromFile(productsFilePath);
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.productId === productId);
  if (product) {
    res.status(200).send(product);
  } else {
    res.status(404).send("Product not found");
  }
});

// Users API

app.post("/api/signin", (req, res) => {
  const { email, password } = req.body;
  const users = readFromFile(usersFilePath);

  const user = users.find(u => u.email === email);
  if (!user || user.password !== password) {
    return res.status(401).send("Invalid credentials.");
  }

  const token = generateToken(user.userId);

  res.cookie("authToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 1000 * 60 * 60 * 2, // 2 hours
  });

  // Just send confirmation, Angular can call /api/me
  res.status(200).send("Login successful.");
});


app.post("/api/signup", (req, res) => {
  const { email, password, fullName } = req.body;

  const users = readFromFile(usersFilePath);

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).send("User already exists.");
  }

  const newUser = {
    userId: randomUUID(),
    fullName,
    email,
    password,
    phone: 0,
    iban: '',
    bankName: '',
    orderHistory: [],
    userType: 'member'
  };

  users.push(newUser);
  writeToFile(usersFilePath, users);

  res.status(201).send("User registered successfully.");
});

app.post('/api/signout', authenticate, (req, res) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });
  res.status(200).send('Logged out successfully.');
});

app.get("/api/me", authenticate, (req, res) => {
  const users = readFromFile(usersFilePath);
  const user = users.find(u => u.userId === req.user.userId);

  if (!user) return res.status(404).send("User not found.");

  // Re-set the authToken cookie to extend session
  const newToken = generateToken(user.userId);
  res.cookie("authToken", newToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 1000 * 60 * 60 * 2, // 2 hours
  });

  res.send({
    userId: user.userId,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone || 0,
    iban: user.iban || '',
    bankName: user.bankName || '',
    userType: user.userType
  });
});


// LOCALIZED ANGULAR APP
const LOCALES = ['fr-CA', 'en-US'];

LOCALES.forEach((locale) => {
  const localePath = path.join(__dirname, '..', 'dist/tp2/browser', locale);

  console.log(localePath);

  app.use(`/${locale}`, express.static(localePath));

  app.get(`/${locale}/*`, (req, res) => {
    res.sendFile(path.join(localePath, 'index.html'));
  });
});

// Redirect root to default language
app.get('/', (req, res) => {
  res.redirect('/fr-CA');
});

app.listen(port, () => {
  console.log(`API Server & Angular localized app listening on port ${port}`);
  console.log(`-> http://localhost:${port}/fr-CA`);
  console.log(`-> http://localhost:${port}/en-US`);
});
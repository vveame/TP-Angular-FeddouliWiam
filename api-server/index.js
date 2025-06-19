// npm install cookie-parser
//npm start

require('dotenv').config();
const express = require("express");
const cookieParser = require('cookie-parser');
const { generateToken, authenticate, isAdmin, writeToFile, readFromFile } = require('./auth');
const cors = require('cors');
const path = require('path');
const { randomUUID } = require('crypto');


const app = express();
const port = 3000;

const usersFilePath = path.join(__dirname, 'db', 'users.json');
const productsFilePath = path.join(__dirname, 'db', 'products.json');
const ordersFilePath = path.join(__dirname, 'db', 'orders.json');
const offersFilePath = path.join(__dirname, 'db', 'offers.json');

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

// Products API

// GET all products
app.get("/api/products", (req, res) => {
  const products = readFromFile(productsFilePath);
  res.send(products);
});

// GET single product by ID
app.get("/api/products/:id", (req, res) => {
  const products = readFromFile(productsFilePath);
  const productId = req.params.id;
  const product = products.find(p => p.productId === productId);
  if (product) {
    res.status(200).send(product);
  } else {
    res.status(404).send("Product not found.");
  }
});

app.put("/api/products/:id/stock", authenticate, isAdmin, (req, res) => {
  const products = readFromFile(productsFilePath);
  const productId = req.params.id;
  const { quantity } = req.body;

  const index = products.findIndex(p => p.productId === productId);
  if (index === -1) {
    return res.status(404).send("Product not found");
  }

  if (typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).send("Invalid quantity.");
  }

  products[index].productQuantity += quantity;
  products[index].restockDate = new Date().toISOString();

  writeToFile(productsFilePath, products);
  return res.status(200).json(products[index]);
});

// Offers API

// GET all offers
app.get('/api/offers', (req, res) => {
  const offers = readFromFile(offersFilePath);
  res.status(200).json(offers);
});

// GET single offer
app.get('/api/offers/:id', (req, res) => {
  const offers = readFromFile(offersFilePath);
  const offer = offers.find(o => o.id === req.params.id);
  if (!offer) return res.status(404).send("Offer not found.");
  res.status(200).json(offer);
});

// POST new offer
app.post('/api/offers', authenticate, isAdmin, (req, res) => {
  const offers = readFromFile(offersFilePath);

  // Validate request
  const { title, description, discountPercent, startDate, endDate, active, type, productIds } = req.body;

  if (!title || discountPercent === undefined || !startDate || !endDate || !type || !Array.isArray(productIds)) {
    return res.status(400).send("Required fields missing or invalid.");
  }

  const newOffer = {
    id: randomUUID(),
    title,
    description: description || '',
    discountPercent,
    startDate,
    endDate,
    active: active ?? true,
    type,
    productIds
  };

  offers.push(newOffer);
  writeToFile(offersFilePath, offers);
  res.status(201).json(newOffer);
});

// PUT update offer
app.put('/api/offers/:id', authenticate, isAdmin, (req, res) => {
  const offers = readFromFile(offersFilePath);
  const index = offers.findIndex(o => o.id === req.params.id);
  if (index === -1) return res.status(404).send("Offer not found.");

  const updatedOffer = {
    ...offers[index],
    ...req.body,
    id: offers[index].id // Never overwrite ID
  };

  offers[index] = updatedOffer;
  writeToFile(offersFilePath, offers);
  res.status(200).json(updatedOffer);
});

// DELETE offer
app.delete('/api/offers/:id', authenticate, isAdmin, (req, res) => {
  const offers = readFromFile(offersFilePath);
  const index = offers.findIndex(o => o.id === req.params.id);
  if (index === -1) return res.status(404).send("Offer not found.");

  const deleted = offers.splice(index, 1);
  writeToFile(offersFilePath, offers);
  res.status(200).json({ message: "Offer deleted.", deleted });
});

// Users API

app.post("/api/signin", (req, res) => {
  const { email, password } = req.body;
  const users = readFromFile(usersFilePath);

  const user = users.find(u => u.email === email);
  if (!user || user.password !== password) {
    return res.status(401).send("Invalid credentials.");
  }

  const token = generateToken(user.userId, user.userType);

  res.cookie("authToken", token, {
    httpOnly: true,
    secure: true, //stock en HTTPS 
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

// Modifier un utilisateur par ID (infos personnelles & bancaires)
app.put('/api/users/:id', authenticate, (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;

  const users = readFromFile(usersFilePath);
  const userIndex = users.findIndex(u => u.userId === userId);

  if (userIndex === -1) {
    return res.status(404).send("User not found.");
  }

  // Vérifier les permissions
  if (req.user.userType !== 'admin' && req.user.userId !== userId) {
    return res.status(403).send("Access denied.");
  }

  // Mettre à jour uniquement les champs autorisés
  const allowedFields = ['fullName', 'email', 'iban', 'bankName', 'phone'];
  allowedFields.forEach(field => {
    if (updateData[field] !== undefined) {
      users[userIndex][field] = updateData[field];
    }
  });

  writeToFile(usersFilePath, users);

  // Ne pas renvoyer le mot de passe
  const { password, ...userWithoutPassword } = users[userIndex];
  res.status(200).send(userWithoutPassword);
});

app.get('/api/users', authenticate, isAdmin, (req, res) => {
  const users = readFromFile(usersFilePath);
  const safeUsers = users.map(({ password, ...u }) => u); // Masquer mots de passe
  res.status(200).send(safeUsers);
});

app.post('/api/users', authenticate, isAdmin, (req, res) => {
  const { fullName, email, password, iban, bankName, phone, userType } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).send("Required fields missing.");
  }

  const users = readFromFile(usersFilePath);
  if (users.find(u => u.email === email)) {
    return res.status(409).send("Email already in use.");
  }

  const newUser = {
    userId: randomUUID(),
    fullName,
    email,
    password,
    iban,
    bankName,
    phone,
    userType: userType || "member",
  };

  users.push(newUser);
  writeToFile(usersFilePath, users);

  const { password: _, ...safeUser } = newUser;
  res.status(201).send(safeUser);
});

app.delete('/api/users/:id', authenticate, isAdmin, (req, res) => {
  const userId = req.params.id;
  let users = readFromFile(usersFilePath);
  const userIndex = users.findIndex(u => u.userId === userId);

  if (userIndex === -1) {
    return res.status(404).send("User not found.");
  }

  users.splice(userIndex, 1);
  writeToFile(usersFilePath, users);
  res.status(204).send();
});


app.get("/api/me", authenticate, (req, res) => {
  const users = readFromFile(usersFilePath);
  const user = users.find(u => u.userId === req.user.userId);

  if (!user) return res.status(404).send("User not found.");

  // Re-set the authToken cookie to extend session
  const newToken = generateToken(user.userId, user.userType);
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

// Order API

app.post('/api/orders', authenticate, (req, res) => {
  const orderData = req.body;

  if (!orderData || !orderData.userId || !orderData.items || !orderData.paymentMethod || !orderData.deliveryAddress) {
    return res.status(400).send("Invalid order data.");
  }

  const orders = readFromFile(ordersFilePath);
  const products = readFromFile(productsFilePath);

  const newOrder = {
    orderId: randomUUID(),
    userId: orderData.userId,
    items: orderData.items,
    paymentMethod: orderData.paymentMethod,
    deliveryAddress: orderData.deliveryAddress,
    shippingFee: orderData.shippingFee,
    totalPrice: orderData.totalPrice,
    orderDate: new Date().toISOString(),
    status: 'pending'
  };

  // Decrease product quantities
  let allItemsAvailable = true;
  for (const item of orderData.items) {
    const product = products.find(p => p.productId === item.productId);
    if (product) {
      if (product.productQuantity >= item.quantity) {
        product.productQuantity -= item.quantity;
      } else {
        allItemsAvailable = false;
        break;
      }
    } else {
      allItemsAvailable = false;
      break;
    }
  }

  if (!allItemsAvailable) {
    return res.status(400).json({ message: "Insufficient stock for one of the products." });
  }

  // Save updated product quantities
  writeToFile(productsFilePath, products);

  // Save the new order
  orders.push(newOrder);
  writeToFile(ordersFilePath, orders);

  res.status(201).send({ message: 'Order successfully recorded.', orderId: newOrder.orderId });
});


// Récupérer commandes par utilisateur
app.get('/api/orders/user/:userId', authenticate, (req, res) => {
  const userId = req.params.userId;
  const orders = readFromFile(ordersFilePath);
  const userOrders = orders.filter(order => order.userId === userId);
  res.send(userOrders);
});

// Récupérer une commande par son ID
app.get('/api/orders/:orderId', authenticate, (req, res) => {
  const orderId = req.params.orderId;
  const orders = readFromFile(ordersFilePath);

  const order = orders.find(o => o.orderId === orderId);

  if (!order) {
    return res.status(404).send({ message: 'Order not found.' });
  }

  res.send(order);
});


// LOCALIZED ANGULAR APP
const LOCALES = ['fr', 'en-US', 'ar', 'es'];

LOCALES.forEach((locale) => {
  const localePath = path.join(__dirname, '..', 'dist/tp2/browser', locale);

  console.log(localePath);

  app.use(`/${locale}`, express.static(localePath));

  app.get(`/${locale}/*`, (req, res) => {
    res.sendFile(path.join(localePath, 'index.csr.html'));
  });
});

// Redirect root to default language
app.get('/', (req, res) => {
  res.redirect('/en-US');
});

app.listen(port, () => {
  console.log(`API Server & Angular localized app listening on port ${port}`);
  console.log(`-> http://localhost:${port}/fr`);
  console.log(`-> http://localhost:${port}/en-US`);
  console.log(`-> http://localhost:${port}/ar`);
  console.log(`-> http://localhost:${port}/es`);
});
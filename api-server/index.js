const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const usersFilePath = path.join(__dirname, 'users.json');
const { randomUUID } = require('crypto');


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

let baseImageUrl = "assets/images/";

// API ROUTES
const products = [
  {
    productId: 1,
    productTitle: "Clavier Gamer",
    productPrice: 300,
    productQuantity: 4,
    productImage: baseImageUrl + "clavier.png",
    productCategory: "Accessoires",
  },
  {
    productId: 2,
    productTitle: "Souris Logitech",
    productPrice: 150,
    productQuantity: 1,
    productImage: baseImageUrl + "souris.png",
    productCategory: "Accessoires",
  },
  {
    productId: 3,
    productTitle: "Écran 24",
    productPrice: 1200,
    productQuantity: 100,
    productImage: baseImageUrl + "ecran.png",
    productCategory: "Ecrans",
  },
  {
    productId: 4,
    productTitle: "Ordinateur Portable",
    productPrice: 7000,
    productQuantity: 2000,
    productImage: baseImageUrl + "laptop.png",
    productCategory: "Ordinateurs",
  },
  {
    productId: 5,
    productTitle: "Tapis de souris",
    productPrice: 40,
    productQuantity: 40,
    productImage: baseImageUrl + "tapis.png",
    productCategory: "Accessoires",
  },
];

// GET all products
app.get("/api/products", (req, res) => {
  res.send(products);
});

// GET single product by ID
app.get("/api/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.productId === productId);
  if (product) {
    res.status(200).send(product);
  } else {
    res.status(404).send("Product not found");
  }
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

// Handeling users API routes

function readUsersFromFile() {
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(usersFilePath);
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

function writeUsersToFile(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

app.post("/api/signin", (req, res) => {
  const { email, password } = req.body;
  const users = readUsersFromFile();

  const user = users.find(u => u.email === email);
  if (user && user.password === password) {
    res.status(200).send({
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || 0,
      iban: user.iban || '',
      bankName: user.bankName || '',
      orderHistory: user.orderHistory || [],
      userType: user.userType
    });
  } else {
    res.status(401).send("Invalid user credentials.");
  }
});


app.post("/api/signup", (req, res) => {
  const { email, password, fullName } = req.body;

  const users = readUsersFromFile();

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
  writeUsersToFile(users);

  res.status(201).send("User registered successfully.");
});

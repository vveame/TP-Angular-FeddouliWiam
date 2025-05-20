const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

let cart = [];
let baseImageUrl = "assets/images/";

// API ROUTES
app.get("/api/products", (req, res) => {
  let products = [
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
  res.send(products);
});

app.post("/api/cart", (req, res) => {
  cart = req.body;
  setTimeout(() => res.status(201).send(), 20);
});

app.get("/api/cart", (req, res) => res.send(cart));

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
  console.log(`➡️  http://localhost:${port}/fr-CA`);
  console.log(`➡️  http://localhost:${port}/en-US`);
});

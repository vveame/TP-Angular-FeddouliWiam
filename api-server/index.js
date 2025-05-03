const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let cart = [];
let baseImageUrl = "assets/images/";

app.get("/api/products", (req, res) => {
  let products = [
    {
      productId: 1,
      productTitle: "Clavier Gamer",
      productPrice: 300,
      productQuantity: 4,
      productImage: baseImageUrl + "clavier.png",
    },
    {
      productId: 2,
      productTitle: "Souris Logitech",
      productPrice: 150,
      productQuantity: 1,
      productImage: baseImageUrl + "souris.png",
    },
    {
      productId: 3,
      productTitle: "Écran 24",
      productPrice: 1200,
      productQuantity: 100,
      productImage: baseImageUrl + "ecran.png",
    },
    {
      productId: 4,
      productTitle: "Ordinateur Portable",
      productPrice: 7000,
      productQuantity: 2000,
      productImage: baseImageUrl + "laptop.png",
    },
    {
      productId: 5,
      productTitle: "Tapis de souris",
      productPrice: 40,
      productQuantity: 40,
      productImage: baseImageUrl + "tapis.png",
    },
  ];
  res.send(products);
});

app.post("/api/cart", (req, res) => {
  cart = req.body;
  setTimeout(() => res.status(201).send(), 20);
});

app.get("/api/cart", (req, res) => res.send(cart));

const port = 3000;

app.listen(port, () => console.log(`API Server listening on port ${port}`));



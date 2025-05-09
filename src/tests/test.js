"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Product_1 = require("../models/Product");
var ShoppingCartItem_1 = require("../models/ShoppingCartItem");
var ShoppingCart_1 = require("../models/ShoppingCart");
var product = new Product_1.Product(1, 'Test Product', 100);
product.printProduct;
var cartItem = new ShoppingCartItem_1.ShoppingCartItem(product, 2);
cartItem.displayProductItem();
var cart = new ShoppingCart_1.ShoppingCart();
var product1 = new Product_1.Product(1, 'Product 1', 100);
var product2 = new Product_1.Product(2, 'Product 2', 200);
var cartItem1 = new ShoppingCartItem_1.ShoppingCartItem(product1, 1);
var cartItem2 = new ShoppingCartItem_1.ShoppingCartItem(product2, 2);
cart.addItem(cartItem1);
cart.addItem(cartItem2);
cart.getItems;
cart.removeItem(cartItem);
cart.getItems;

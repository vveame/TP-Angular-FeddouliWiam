import { Product } from '../models/Product';
import { ShoppingCartItem } from '../models/ShoppingCartItem';
import { ShoppingCart } from '../models/ShoppingCart';

const product = new Product(1, 'Test Product', 100);
product.printProduct;

const cartItem = new ShoppingCartItem(product, 2);
cartItem.displayProductItem();

const cart = new ShoppingCart();
const product1 = new Product(1, 'Product 1', 100);
const product2 = new Product(2, 'Product 2', 200);
const cartItem1 = new ShoppingCartItem(product1, 1);
const cartItem2 = new ShoppingCartItem(product2, 2);
cart.addItem(cartItem1);
cart.addItem(cartItem2);
cart.getItems;

cart.removeItem(cartItem);
cart.getItems;
